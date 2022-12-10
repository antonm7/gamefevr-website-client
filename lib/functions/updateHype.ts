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
  user_gets_hype: 7

}

export default async function updateHype(
  type:
    | 'writeReview'
    | 'likeReview'
    | 'dislikeReview'
    | 'rankGame'
    | 'addToFavorite'
    | 'userSendsHype'
    | 'userGetsHype',
  userId: ObjectId
): Promise<Response> {
  try {
    const client = await clientPromise
    db = client.db()
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
    case 'userSendsHype':
      return UpdateScore(userId, score.c)
    case 'userGetsHype':
      return UpdateScore(userId, score.user_gets_hype)
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
    console.log('error on updateHype, updateScoreFunc', e)
    return { error: '' }
  }
}
