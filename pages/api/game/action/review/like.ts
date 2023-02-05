import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../../backend-middlewares/authorize'
import generateErrorBackend from '../../../../../backend-middlewares/generateErrorBackend'
import clientPromise from '../../../../../lib/functions/mongodb'
import updateHype from '../../../../../lib/functions/updateHype'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: {
      userId: string
      reviewId: string
    }
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let db = null
    const { userId, reviewId } = req.body.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db()
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    try {
      //making sure user didn't like the review before
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(reviewId) },
          { $pull: { likes: userId } }
        )
      //pushing the like
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(reviewId) },
          { $push: { likes: userId } }
        )

      await updateHype(
        'likeReview',
        new ObjectId(userId)
      )
      res.status(200).send({ error: null })
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
