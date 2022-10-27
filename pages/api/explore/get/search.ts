import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import getRandomInt from '../../../../lib/functions/generateRandom'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const request: any = await axios.get(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(
        10,
        200
      )}&page_size=25`
    )

    const games = request.data
    return res.status(200).send(games)
  }
}
