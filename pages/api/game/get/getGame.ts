import axios from 'axios'
import { Response } from 'express'
import { NextApiRequest } from 'next'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'
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
      const getData = await axios.get(
        `https://api.rawg.io/api/games/${query.gameId}?key=39a2bd3750804b5a82669025ed9986a8`
      )
      const getScreenshots = await axios.get(
        `https://api.rawg.io/api/games/${query.gameId}/screenshots?key=39a2bd3750804b5a82669025ed9986a8`
      )

      const getTrailers = await axios.get(
        `https://api.rawg.io/api/games/${query.gameId}/movies?key=39a2bd3750804b5a82669025ed9986a8`
      )

      const getSeries = await axios.get(
        `https://api.rawg.io/api/games/${query.gameId}/game-series?key=39a2bd3750804b5a82669025ed9986a8`
      )

      const gameData = getData.data
      const screenshots = getScreenshots.data
      const trailers = getTrailers.data
      const same_series = getSeries.data

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
        screenshots,
        trailers,
        same_series,
        tags: gameData.tags,
        website: gameData.website,
      }

      const client = await clientPromise
      const db = client.db('gameFevr')
      const reviews = await db
        .collection('reviews')
        .find({ gameId: query.gameId })
        .toArray()

      res.status(200).send({
        game: finalData,
        reviews: JSON.parse(JSON.stringify(reviews)),
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
