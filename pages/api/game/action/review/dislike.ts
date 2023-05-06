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
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method Not Allowed' })
  }

  const { userId, reviewId } = req.body.body

  try {
    const client = await clientPromise
    const db = client.db()

    // remove previous dislikes by this user
    await db.collection('reviews').updateOne(
      { _id: new ObjectId(reviewId) },
      { $pull: { dislikes: userId } }
    )

    // add this user's dislike
    await db.collection('reviews').updateOne(
      { _id: new ObjectId(reviewId) },
      { $push: { dislikes: userId } }
    )

    // update user hype
    await updateHype('dislikeReview', new ObjectId(userId))

    res.status(200).send({ error: null })
  } catch (e) {
    await generateErrorBackend({
      error: 'Error disliking review on dislike review action api',
      status: 500,
      e,
    })

    res.status(500).send({ error: 'Unexpected error' })
  }
}

export default authorize(handler)
