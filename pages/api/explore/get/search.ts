import { NextApiRequest, NextApiResponse } from 'next'
import getRandomInt from '../../../../lib/functions/generateRandom'
import { genres, parentConsoles } from '../../../../lib/staticData'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const limit = 40
    const page = Math.round(getRandomInt(0, 760000) / limit)
    let filteredString = ''

    const useOrNot = () => {
      const num = Math.round(Math.random())
      if (num === 0) {
        return false
      }
      return true
    }

    if (useOrNot()) {
      const consoles = parentConsoles
      let consolesString = ''
      const item = consoles[Math.floor(Math.random() * consoles.length)]
      consolesString = consolesString.concat(`${item.id}`, '')
      filteredString = filteredString.concat(`&consoles=${consolesString}`)
    }
    //add more
    if (useOrNot()) {
      const genresData = genres
      let genresString = ''
      const item = genresData[Math.floor(Math.random() * genresData.length)]
      genresString = genresString.concat(`${item.id}`, '')
      filteredString = filteredString.concat(`&platforms=${genresString}`)
    }

    const getData = await fetch(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${page}&page_size=${limit}`
    )

    const games = await getData.json()
    return res.status(200).send(games)
  }
}
