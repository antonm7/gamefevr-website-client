import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../../lib/functions/mongodb'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    gameId: string
    userId: string
    reviewId: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let db = null
    const query = req.body
    let savedReview
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    //saves the reviews inside own ranks collection
    try {
      await db
        .collection('reviews')
        .deleteOne({ _id: new ObjectId(query.reviewId) })
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error deleting the review', e)
    }
    //updates user's document
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(query.userId) },
          { $pull: { reviews: query.reviewId } }
        )
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating user ranks field', e)
    }
    //updates game data document
    try {
      await db.collection('games_data').updateOne(
        { gameId: query.gameId },
        {
          $inc: { reviews: -1 },
        }
      )
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating games_data document', e)
    }
    res.status(200).send({ error: null })
  }
}
