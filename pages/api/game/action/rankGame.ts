import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../backend-middlewares/authorize'
import games_data_document from '../../../../lib/functions/create/games_data'
import clientPromise from '../../../../lib/functions/mongodb'
import { Rank } from '../../../../types/schema'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    gameId: string
    userId: string
    value: string
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let db = null
    let savedRank
    const body = req.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    //checks if game document exists
    try {
      await games_data_document(body.gameId)
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on games_data_document', e)
    }
    //saves the rank inside own ranks collection
    try {
      const rank: Rank = {
        userId: req.body.userId,
        gameId: req.body.gameId,
        created_at: 'time',
        value: req.body.value,
      }
      savedRank = await db.collection('ranks').insertOne(rank)
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error saving the rank', e)
    }
    //updates user's document
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(req.body.userId) },
          { $push: { ranks: savedRank?.insertedId } }
        )
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating user ranks field')
    }
    //updates game data document
    try {
      if (req.body.value === 'waste_of_time') {
        await db
          .collection('games_data')
          .updateOne(
            { gameId: req.body.gameId },
            { $inc: { waste_of_time: 1 } }
          )
      }

      if (req.body.value === 'nuh') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { nuh: 1 } })
      }

      if (req.body.value === 'good') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { good: 1 } })
      }

      if (req.body.value === 'must') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { must: 1 } })
      }
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating games_data document', e)
    }
    res.status(201).send({ error: null })
  }
}

export default authorize(handler)
