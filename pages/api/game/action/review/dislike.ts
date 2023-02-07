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
      //making sure user didn't disliked the review before
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(reviewId) },
          { $pull: { dislikes: userId } }
        )
      //pushing the dislike
      await db
        .collection('reviews')
        .updateOne(
          { _id: new ObjectId(reviewId) },
          { $push: { dislikes: userId } }
        )
      await updateHype(
        'dislikeReview',
        new ObjectId(userId)
      )
      res.status(200).send({ error: null })
    } catch (e) {
      await generateErrorBackend({
        error: 'Error disliking review on dislike review action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on dislike review', e)
    }
  }
}

export default authorize(handler)
