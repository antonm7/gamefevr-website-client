import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../backend-middlewares/authorize'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'
import clientPromise from '../../../../lib/functions/mongodb'

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
    let removedRank
    //initializing database
    try {
      const client = await clientPromise
      db = client.db()
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    //delete from ranks collection
    try {
      removedRank = await db
        .collection('ranks')
        .findOne({ userId: req.body.userId, gameId: req.body.gameId })
      await db
        .collection('ranks')
        .deleteOne({ userId: req.body.userId, gameId: req.body.gameId })
    } catch (e) {
      await GenerateError({
        error: 'error cancelling saved rank on game/cancel/cancelRank',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log(
        'error cancelling saved rank on game/cancel/cancelRank',
        e
      )
    }
    //updates user's document
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(req.body.userId) },
          { $pull: { ranks: removedRank?._id } }
        )
    } catch (e) {
      await GenerateError({
        error: 'error updating user rank field on game/cancel/cancelRank',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log(
        'error updating user rank field on game/cancel/cancelRank'
      )
    }
    //updates game data document
    try {
      if (req.body.value === 'waste_of_time') {
        await db
          .collection('games_data')
          .updateOne(
            { gameId: req.body.gameId },
            { $inc: { waste_of_time: -1 } }
          )
      }

      if (req.body.value === 'nuh') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { nuh: -1 } })
      }

      if (req.body.value === 'good') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { good: -1 } })
      }

      if (req.body.value === 'must') {
        await db
          .collection('games_data')
          .updateOne({ gameId: req.body.gameId }, { $inc: { must: -1 } })
      }
    } catch (e) {
      await GenerateError({
        error:
          'error on updating games_data document on game/cancel/cancelRank',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating games_data document', e)
    }
    res.status(200).send({ error: null })
  }
}

export default authorize(handler)
