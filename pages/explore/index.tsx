import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import SearchLayout from '../../components/layout/SearchLayout'
import { DetailedGame, ElementDescription, ShortGame } from '../../types'
import { genres, parentConsoles } from '../../lib/staticData'
import FiltersRow from '../../components/Explore/FiltersRow'
import getRandomInt from '../../lib/functions/generateRandom'
import clientPromise from '../../lib/functions/mongodb'
import { getSession } from 'next-auth/react'
import { games_data } from '../../types/schema'
import SmallGameBox from '../../components/SmallGameBox'
import axios from 'axios'

interface Props {
  random_genres: ElementDescription[]
  random_platforms: ElementDescription[]
  games: ShortGame[]
}

export default function Index({
  random_genres,
  random_platforms,
  games,
}: Props) {
  const [genres, setGenres] = useState<ElementDescription[]>([])
  const [platforms, setPlatforms] = useState<ElementDescription[]>([])

  const loadMore = async (): Promise<void> => {
    // try {
    //   const req = await axios.get('/api/explore/get/search')
    //   if (req.status !== 200) throw new Error()
    //   if (!req.data.results.length) throw new Error()
    //   setGames((arr) => [...arr, ...req.data.results])
    // } catch (e) {
    //   console.log(e)
    // }
  }

  useEffect(() => {
    setGenres(random_genres)
    setPlatforms(random_platforms)
    console.log(games)
  }, [])

  return (
    <SearchLayout>
      <div className="px-44 pb-10 py-10">
        <div id="explore_wrapper" className="flex h-auto">
          <p
            id="we_found_title"
            className="explore_title we_found_padding font-bold text-white text-4xl lea"
          >
            Start Exploring Games New Games!
          </p>
        </div>
        <p className="pt-4 text-white opacity-60 text-sm font-semibold">
          Discover new games based on your recent changes or use some filters
          below
        </p>
        <FiltersRow genres={genres} platforms={platforms} />
        {/* <div id="games_wrapper" className="flex flex-wrap justify-center pt-12">
          {returned_games.map((game: ShortGame, index: number) => (
            <SmallGameBox key={index} game={game} />
          ))}
        </div> */}
      </div>
    </SearchLayout>
  )
}

interface ElementExtends extends ElementDescription {
  type?: string
}

export async function getServerSideProps(context: any) {
  //fetch random genres

  const random_genres: ElementExtends[] = []
  const random_platforms: ElementExtends[] = []

  const shuffle = (
    currArr: ElementDescription[],
    list: ElementDescription[],
    type: 'genres' | 'platforms'
  ): void => {
    const chosen = list[Math.floor(Math.random() * list.length)]

    if (type === 'genres') {
      const filtered = random_genres.filter((r) => r.name === chosen.name)
      if (filtered.length) {
        shuffle(currArr, list, type)
      } else {
        random_genres.push(chosen)
      }
    } else {
      const filtered = random_platforms.filter((r) => r.name === chosen.name)
      if (filtered.length) {
        shuffle(currArr, list, type)
      } else {
        random_platforms.push(chosen)
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    shuffle(random_genres, genres, 'genres')
    shuffle(random_platforms, parentConsoles, 'platforms')
  }

  for (const key in random_genres) {
    random_genres[key] = {
      ...random_genres[key],
      type: 'genres',
    }
  }

  for (const key in random_platforms) {
    random_platforms[key] = {
      ...random_platforms[key],
      type: 'platforms',
    }
  }

  try {
    const limit = 25
    const page = Math.round(getRandomInt(2, 100) / limit)

    const useOrNot = () => {
      const num = Math.round(Math.random())
      if (num === 0) {
        return false
      }
      return true
    }

    //first[]4
    //second[]4
    //third[]4
    //fourth[]4


    const genereateFilters = (): string | null => {
      let filteredString = ''
      let is_consoles_used = false
      let is_genres_used = false

      if (useOrNot()) {
        const consoles = parentConsoles
        let consolesString = ''
        const item = consoles[Math.floor(Math.random() * consoles.length)]
        consolesString = consolesString.concat(`${item.id}`, '')
        filteredString = filteredString.concat(`&consoles=${consolesString}`)
        is_consoles_used = true
      }
      //add more
      if (useOrNot()) {
        const genresData = genres
        let genresString = ''
        const item = genresData[Math.floor(Math.random() * genresData.length)]
        genresString = genresString.concat(`${item.id}`, '')
        filteredString = filteredString.concat(`&platforms=${genresString}`)
        is_genres_used = true
      }

      if (!is_consoles_used && !is_genres_used) {
        return null
      } else {
        return filteredString
      }
    }

    const generateArray = async (): Promise<ShortGame[]> => {
      const filters = genereateFilters()
      let result = []
      if (filters === null) {
        try {
          const request: any = await axios.get(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(10, 200)}&page_size=4`
          )
          const data = await request.data.results
          result = data
        } catch (e) {
          console.log('e')
        }
      } else {
        try {
          const request: any = await axios.get(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(2, 15)}&page_size=4&${filters}`
          )
          const data = await request.data.results
          result = data
        } catch (e) {
          console.log('e')

        }
      }
      return result
    }

    const returned_games = async () => {
      try {
        const generator = async () => {
          const result = await generateArray()
          if (!result) {
            const x = `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(10, 200)}&page_size=4`

            const request: any = await axios.get(
              x)
            console.log('reeeweeeee', x)
            const data = await request.data.results
            return data
          } else {
            return result
          }
        }
        const first = await generator()
        const second = await generator()
        const third = await generator()
        const fourth = await generator()

        return [...first, ...second, ...third, ...fourth]
      } catch (e) {

        return []
      }
    }

    //created the first filters
    //created the second filters
    //created the third filters
    //created the fourth filters

    // if (useOrNot()) {
    //   const consoles = parentConsoles
    //   let consolesString = ''
    //   const item = consoles[Math.floor(Math.random() * consoles.length)]
    //   consolesString = consolesString.concat(`${item.id}`, '')
    //   filteredString = filteredString.concat(`&consoles=${consolesString}`)
    // }
    // //add more
    // if (useOrNot()) {
    //   const genresData = genres
    //   let genresString = ''
    //   const item = genresData[Math.floor(Math.random() * genresData.length)]
    //   genresString = genresString.concat(`${item.id}`, '')
    //   filteredString = filteredString.concat(`&platforms=${genresString}`)
    // }

    // const getData: any = await fetch(
    //   `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${page}&page_size=${limit}${filteredString}`
    // )

    // const result = await getData.json()

    // const games: ShortGame[] = []
    // const data = await getData.json().results
    const games: any = []
    return {
      props: {
        random_genres,
        random_platforms,
        games: await returned_games(),
        error: null,
      },
    }
  } catch (e) {

    return {
      props: {
        random_genres,
        random_platforms,
        games: null,
        error: 'Oops, Unexpected Error',
      },
    }
  }
}
