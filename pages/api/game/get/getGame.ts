import { Response } from 'express'
import { NextApiRequest } from 'next'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'
import { promiseHandler, wretchWrapper } from '../../../../lib/functions/fetchLogic'
import clientPromise from '../../../../lib/functions/mongodb'
import { DetailedGame } from '../../../../types'

type ExtendedRequest = NextApiRequest & {
  query: {
    gameId: string
    userId: string
  }
}

async function handler(req: ExtendedRequest, res: Response) {
  if (req.method === 'GET') {
    const query = req.query
    try {
      const client = await clientPromise
      const db = client.db()

      const gameData = await db.collection('games').findOne({ id: parseInt(query.gameId) })
      console.log(gameData)

      if (!gameData) {
        res.status(404).json({ message: 'Game not found' })
        return
      }

      const finalData: DetailedGame = {
        id: gameData.id,
        name: gameData.name,
        released: gameData.released,
        background_image: gameData.background_image,
        description: gameData.description,
        genres: gameData.genres,
        developers: gameData.developers,
        parent_platforms: gameData.parent_platforms,
        platforms: gameData.platforms,
        stores: gameData.stores,
        publishers: gameData.publishers,
        same_series: null,
        tags: gameData.tags,
        website: gameData.website,
      }

      res.status(200).send({
        game: finalData
      })


    } catch (e) {
      await GenerateError({
        error: 'error getting game on game/get/getGame',
        status: 500,
        e,
      })
      res.status(500).send({
        game: null,
        reviews: null,
      })
    }
  }
}

export default handler
