import { Response } from 'express'
import { NextApiRequest } from 'next'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'
import { promiseHandler, wretchWrapper } from '../../../../lib/functions/fetchLogic'
import clientPromise from '../../../../lib/functions/mongodb'
import { DetailedGame, Screenshot, Short_Screenshot } from '../../../../types'

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
      // const getGame = () => wretchWrapper(`https://api.rawg.io/api/games/${query.gameId}?key=${process.env.FETCH_GAMES_KEY_GENERAL1}`
      //   , 'getGame')

      // const getScreenshots = () => wretchWrapper(`https://api.rawg.io/api/games/${query.gameId}/screenshots?key=${process.env.FETCH_GAMES_KEY_GENERAL1}`,
      //   'getScreenshots')

      // const getTrailers = () => wretchWrapper(
      //   `https://api.rawg.io/api/games/${query.gameId}/movies?key=${process.env.FETCH_GAMES_KEY_GENERAL1}`
      //   , 'getTreilers')

      // const getSeries = () => wretchWrapper(
      //   `https://api.rawg.io/api/games/${query.gameId}/game-series?key=${process.env.FETCH_GAMES_KEY_GENERAL2}`
      //   , 'getSeries')

      // const result: any = await Promise.allSettled([
      //   getGame(),
      //   getScreenshots(),
      //   getTrailers(),
      //   getSeries()
      // ])

      const client = await clientPromise
      const db = client.db()

      const gameData = await db.collection('games').findOne({ id: query.gameId })
      const screenshotsData = await db.collection('screenshots').findOne({ gameId: query.gameId })
      // const [gameData, screenshots, trailers, same_series]: any = promiseHandler(result)
      if (!gameData) {
        res.status(500).send()
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
        screenshots: screenshotsData?.length ? screenshotsData as unknown as any : [],
        trailers: null,
        same_series: null,
        tags: gameData.tags,
        website: gameData.website,
      }


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
