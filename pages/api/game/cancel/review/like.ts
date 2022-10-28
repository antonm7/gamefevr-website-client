import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../../backend-middlewares/authorize'
import GenerateError from '../../../../../backend-middlewares/generateError'
import clientPromise from '../../../../../lib/functions/mongodb'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string
    reviewId: string
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let db = null
    const query = req.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    try {
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(query.reviewId) },
          { $pull: { likes: query.userId } }
        )
      res.status(200).send({ error: null })
    } catch (e) {
      await GenerateError({
        error: 'error on cancelling like on review on game/cancel/review/like',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log(
        'error on cancelling like on review on game/cancel/review/like',
        e
      )
    }
  }
}

export default authorize(handler)
