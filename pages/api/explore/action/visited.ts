import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/functions/mongodb'
import { getToken } from 'next-auth/jwt'
import { ObjectId } from 'bson'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let db
    const { gameId } = req.body
    let userId

    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      console.log('error', e)
      return res.status(500).send({ error: 'Unexpected Error' })
    }

    try {
      const isExisted = await db
        .collection('explore_data')
        .findOne({ id: gameId })
      if (!isExisted) {
        await db.collection('explore_data').insertOne({
          id: gameId,
          visited: 0,
          clicked: 0,
        })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).send({ error: 'Unexpected Error' })
    }

    try {
      const token: any = await getToken({ req })
      userId = token.userId
      await db
        .collection('explore_data')
        .updateOne({ id: gameId }, { $inc: { visited: 1 } })
    } catch (e) {
      console.log('error', e)
      return res.status(500).send({ error: 'Unexpected Error' })
    }

    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $push: { visited_explore: gameId } }
        )
    } catch (e) {
      console.log('error', e)
      return res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}
