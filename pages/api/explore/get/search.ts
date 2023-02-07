import { NextApiRequest, NextApiResponse } from 'next'
import generateErrorBackend from '../../../../backend-middlewares/generateErrorBackend'
import { wretchWrapper } from '../../../../lib/functions/fetchLogic'
import getRandomInt from '../../../../lib/functions/generateRandom'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const fetchExploredGames: any = await wretchWrapper(
        `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(
          10,
          200
        )}&page_size=25`
        , 'fetchExploredGames')
      const games = fetchExploredGames.data
      return res.status(200).send(games)
    } catch (e) {
      await generateErrorBackend({
        error: 'error on api/explore/get/search',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}
