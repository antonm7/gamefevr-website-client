import { useEffect, useState } from 'react'
import SearchLayout from '../../components/layout'
import { ShortGame } from '../../types'
import { genres, parentConsoles } from '../../lib/staticData'
import getRandomInt from '../../lib/functions/generateRandom'
import SmallGameBox from '../../components/SmallGameBox'
import SearchButton from '../../components/common/SearchButton'
import SmallLoader from '../../components/common/SmallLoader'
import Filters from '../../components/Filters'
import { useStore } from '../../store'
import generateErrorBackend from '../../backend-middlewares/generateErrorBackend'
import LoadingError from '../../components/common/LoadingError'
import { wretchWrapper } from '../../lib/functions/fetchLogic'

interface Props {
  games: ShortGame[]
}

export default function Index({ games }: Props) {
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false)
  const [localGames, setLocalGames] = useState<ShortGame[]>([])
  const [error, setError] = useState<boolean>(false)

  const store = useStore((state) => state)

  const loadMore = async (): Promise<void> => {
    try {
      setLoadMoreLoading(true)
      setError(false)
      const exploreSearchRequest: any = await wretchWrapper('/api/explore/get/search', 'exploreSearchRequest')
      setLocalGames((arr) => [...arr, ...exploreSearchRequest.data.results])
      setLoadMoreLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (games.length === 0) {
      setError(true)
    } else {
      setLocalGames(games)
    }
  }, [games])

  return (
    <SearchLayout>
      <div className="px-44 pb-10 py-10 we_found_padding">
        {store.isFilterOn ? <Filters /> : null}

        <div id="we_found_title_wrapper" className="flex h-auto ">
          <p
            id="we_found_title"
            className="explore_title font-bold text-white text-4xl"
          >
            Start Exploring Games New Games!
          </p>
        </div>
        {error ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'Unexpected Error'}
              description={'Oops...something went wrong'}
              button={true}
              onClick={() => loadMore()}
            />
          </div>
        ) : loadMoreLoading ? (
          <div>
            <SmallLoader xCentered={true} big={true} />
          </div>
        ) : (
          <div>
            <div
              className="flex flex-wrap justify-center pt-12"
            >
              {localGames.map((game: ShortGame, index: number) => (
                <SmallGameBox key={index} game={game} />
              ))}
            </div>
            <div className="w-24 h-16 rounded-lg m-auto mt-8">
              {loadMoreLoading ? (
                <SmallLoader big={false} xCentered={true} />
              ) : loadMoreLoading ? (
                <SmallLoader big={false} xCentered={true} />
              ) : (
                <SearchButton text="Load More" onClick={() => loadMore()} />
              )}
            </div>
          </div>
        )}
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps() {
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
      //if no filters applied
      // then it needs to fetch random games by skipping a random number of pages
      if (filters === null) {
        try {
          const randomNumber = getRandomInt(10, 200)
          const getGamesRequest: any = await wretchWrapper(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${randomNumber}&page_size=25`
            , 'getGamesRequest')
          const data = await getGamesRequest.data.results
          result = data
        } catch (e) {
          await generateErrorBackend({
            error: 'Error disliking review on dislike review action api',
            status: 500,
            e,
          })
          console.log('error on fetching games on /pages/explore')
        }
      } else {
        const randomNumber = getRandomInt(2, 15)
        try {
          const getGamesRequest: any = await wretchWrapper(
            `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${randomNumber}&page_size=25&${filters}`
            , 'getGamesRequest')
          const data = await getGamesRequest.data.results
          result = data
        } catch (e) {
          await generateErrorBackend({
            error: 'Error disliking review on dislike review action api',
            status: 500,
            e,
          })
          console.log('error on fetching games on /pages/explore')
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

            const getGeneratedGames: any = await wretchWrapper(x, 'getGeneratedGames')
            const data = await getGeneratedGames.data.results
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
