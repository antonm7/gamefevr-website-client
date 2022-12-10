import { ObjectId } from 'bson'
import games_data_document from '../../../../lib/functions/create/games_data'
import clientPromise from '../../../../lib/functions/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'

type ExtendedRequest = NextApiRequest & {
  query: {
    gameId: string
    userId: ObjectId
  }
}

async function handler(req: ExtendedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const query = req.query
      const client = await clientPromise
      const db = client.db()

      await games_data_document(query.gameId)
      await db
        .collection('games_data')
        .updateOne({ gameId: query.gameId }, { $inc: { visited: 1 } })

      if (query.userId) {
        await db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(query.userId) },
            { $push: { visited_games: query.gameId } }
          )
      }

      res.status(200).send({ error: null })
    } catch (e) {
      await GenerateError({
        error: 'Unexpected Error on visited api',
        status: 500,
        e,
      })
      console.log('error on visited', e)
      return res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}

export default handler
