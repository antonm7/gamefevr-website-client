import { ObjectId } from 'mongodb'
import clientPromise from './mongodb'

interface Response {
  ok?: boolean
  error?: string | null
}

let db: any = null

const score = {
  a: 0.5,
  b: 1,
  c: 1.5,
  d: 2,
  e: 2.5,
}

export default async function updateHype(
  type:
    | 'writeReview'
    | 'likeReview'
    | 'dislikeReview'
    | 'rankGame'
    | 'addToFavorite',
  userId: ObjectId
): Promise<Response> {
  try {
    const client = await clientPromise
    db = client.db('gameFevr')
  } catch (e) {
    return { error: 'Unable to connect to database' }
  }

  switch (type) {
    case 'writeReview':
      return UpdateScore(userId, score.e)
    case 'likeReview':
      return UpdateScore(userId, score.c)
    case 'dislikeReview':
      return UpdateScore(userId, score.c)
    case 'rankGame':
      return UpdateScore(userId, score.c)
    case 'addToFavorite':
      return UpdateScore(userId, score.b)
    default:
      return UpdateScore(userId, score.a)
  }
}

async function UpdateScore(id: ObjectId, score: number): Promise<Response> {
  try {
    await db
      .collection('users')
      .updateOne({ _id: id }, { $inc: { hype: score } })
    return { ok: true }
  } catch (e) {
    return { error: '' }
  }
}
