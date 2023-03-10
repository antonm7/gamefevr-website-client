import { ObjectId } from 'bson'
import games_data_document from '../../../../lib/functions/create/games_data'
import clientPromise from '../../../../lib/functions/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'

interface ExtendedRequest extends NextApiRequest {
  body: {
    body: {
      gameId: string
      userId: ObjectId
    }
  }
}

async function handler(req: ExtendedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { gameId, userId } = req.body.body
      const client = await clientPromise
      const db = client.db()

      await games_data_document(gameId)

      await db
        .collection('games_data')
        .updateOne({ gameId }, { $inc: { visited: 1 } })

      // if user is authenticated
      if (userId) {
        await db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(userId) },
            {
              $push: { visited_games: gameId }
            })
      }

      res.status(200).send({ error: null })

    } catch (e) {
      await GenerateError({
        error: 'Unexpected Error on visited api',
        status: 500,
        e,
      })
      return res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}

export default handler
