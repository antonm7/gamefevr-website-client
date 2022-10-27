import { useEffect, useState } from 'react'
import SearchLayout from '../../components/layout/SearchLayout'
import { ElementDescription, ShortGame } from '../../types'
import { genres, parentConsoles } from '../../lib/staticData'
import getRandomInt from '../../lib/functions/generateRandom'
import SmallGameBox from '../../components/SmallGameBox'
import axios from 'axios'
import SearchButton from '../../components/common/SearchButton'
import SmallLoader from '../../components/common/SmallLoader'
import Filters from '../../components/Filters'
import { useStore } from '../../store'

interface Props {
  games: ShortGame[]
}

export default function Index({ games }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [localGames, setLocalGames] = useState<ShortGame[]>([])

  const store = useStore((state) => state)

  const loadMore = async (): Promise<void> => {
    try {
      setLoading(true)
      const req = await axios.get('/api/explore/get/search')
      if (req.status !== 200) throw new Error()
      if (!req.data.results.length) throw new Error()
      setLocalGames((arr) => [...arr, ...req.data.results])
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setLocalGames(games)
  }, [games])

  return (
    <SearchLayout>
      <div className="px-44 pb-10 py-10">
        {store.isFilterOn ? <Filters /> : null}

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
        <div id="games_wrapper" className="flex flex-wrap justify-center pt-12">
          {localGames.map((game: ShortGame, index: number) => (
            <SmallGameBox key={index} game={game} />
          ))}
        </div>
        <div className="w-24 h-16 rounded-lg m-auto mt-8">
          {loading ? (
            <SmallLoader big={false} xCentered={true} />
          ) : (
            <SearchButton text="Load More" onClick={() => loadMore()} />
          )}
        </div>
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const useOrNot = () => {
      const num = Math.round(Math.random())
      if (num === 0) {
        return false
      }
      return true
    }

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
    //function for creating array from fetched games
    const generateArray = async (): Promise<ShortGame[]> => {
      const filters = genereateFilters()
      let result = []
      //if no filters applied \
      // then it needs to fetch random games by skipping a lot of pages

      if (filters === null) {
        try {
          const randomNumber = getRandomInt(10, 200)
          const request: any = await axios.get(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${randomNumber}&page_size=25`
          )
          const data = await request.data.results
          result = data
        } catch (e) {
          console.log('e')
        }
      } else {
        const randomNumber = getRandomInt(2, 15)
        try {
          const request: any = await axios.get(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${randomNumber}&page_size=25&${filters}`
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
            const x = `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${getRandomInt(
              10,
              200
            )}&page_size=4`

            const request: any = await axios.get(x)
            const data = await request.data.results
            return data
          } else {
            return result
          }
        }
        const first = await generator()

        return [...first]
      } catch (e) {
        return []
      }
    }

    return {
      props: {
        games: await returned_games(),
        error: null,
      },
    }
  } catch (e) {
    return {
      props: {
        games: null,
        error: 'Oops, Unexpected Error',
      },
    }
  }
}
