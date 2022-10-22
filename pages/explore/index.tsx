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
        <div id="games_wrapper" className="flex flex-wrap justify-center pt-12">
          {games.map((game: ShortGame, index: number) => (
            <SmallGameBox key={index} game={game} />
          ))}
        </div>
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

    const getData: any = await fetch(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${page}&page_size=${limit}${filteredString}`
    )

    const result = await getData.json()

    // const games: ShortGame[] = []
    // const data = await getData.json().results

    const games = []

    if (!result) {
      const data: any = await fetch(
        `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=1&page_size=25`
      )
      const secondResult = await data.json()
      console.log(secondResult)
      console.log(secondResult.results.length)
      games.push(...secondResult.results)
    } else {
      console.log(result.results.length)
      games.push(...result.results)
    }

    console.log(games)

    return {
      props: {
        random_genres,
        random_platforms,
        games,
        error: null,
      },
    }
  } catch (e) {
    console.log('error on explore page', e)
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
