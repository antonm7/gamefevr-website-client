import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../../backend-middlewares/authorize'
import generateErrorBackend from '../../../../../backend-middlewares/generateErrorBackend'
import clientPromise from '../../../../../lib/functions/mongodb'
import updateHype from '../../../../../lib/functions/updateHype'

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
      //making sure user didn't like the review before
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(query.reviewId) },
          { $pull: { likes: query.userId } }
        )
      //pushing the like
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(query.reviewId) },
          { $push: { likes: query.userId } }
        )

      const update_hype = await updateHype(
        'likeReview',
        new ObjectId(query.userId)
      )

      if (update_hype.ok) {
        res.status(200).send({ error: null })
      } else {
        throw new Error('error updating hype')
      }
    } catch (e) {
      await generateErrorBackend({
        error: 'Error liking review on like review action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on like review', e)
    }
  }
}

export default authorize(handler)
