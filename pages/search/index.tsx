import SearchLayout from '../../components/layout/SearchLayout'
import SmallGameBox from '../../components/SmallGameBox'
import SearchButton from '../../components/common/SearchButton'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGlobalError, useStore } from '../../store'
import Filters from '../../components/Filters'
import SmallLoader from '../../components/common/SmallLoader'
import { ShortGame } from '../../types'
import LoadingError from '../../components/common/LoadingError'
import cookie from 'cookie'
import { count } from 'console'

interface Props {
  games: ShortGame[]
  count: number
  error: string | null
}

export default function Index(props: Props) {
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(true)
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  //2 types of errors
  const [loadingError, setLoadingError] = useState<boolean>(false)
  const [noResults, setNoResults] = useState<boolean>(false)

  const router = useRouter()
  const store = useStore()

  const loadGames = async (cur: number) => {
    if (loadingError) {
      setLoadingError(false)
    }
    try {
      setNoResults(false)
      setLoadMoreLoading(true)
      const getData = await axios.post('/api/query/search', {
        page: cur,
        query: router.query,
      })
      if (getData.data.games.length === 0) {
        setNoResults(true)
      } else {
        store.addPage()
        store.addGames(getData.data.games)
      }
      setLoadMoreLoading(false)
    } catch (e) {
      setLoadMoreLoading(false)
      changeGlobalErrorVisibility(true)
      console.log('ERROR', e)
    }
  }

  useEffect(() => {
    setLoadMoreLoading(false)
    if (props.games.length === 0) return
    else {
      if (props.error) {
        console.log(props.error)
        setLoadingError(true)
        return
      }
      if (props.games.length === 0) {
        setNoResults(true)
        return
      }
      store.addPage()
      store.addGames(props.games)
      store.setCount(props.count)
    }
  }, [props.games, props.error])

  return (
    <SearchLayout>
      <div>
        {store.isFilterOn ? <Filters /> : null}
        {loadingError ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'Unexpected Error'}
              description={'Oops...something went wrong'}
              button={true}
              onClick={() => loadGames(1)}
            />
          </div>
        ) : noResults ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'No Results Found'}
              description={'We couldnt find what you searched...'}
            />
          </div>
        ) : (
          <div className="py-10">
            <p className="font-bold text-white text-4xl px-24 pb-10">
              We found {store.count} games for you
            </p>
            <div className="flex flex-wrap justify-center">
              {store.games.map((game: ShortGame, index: number) => (
                <SmallGameBox key={index} game={game} />
              ))}
            </div>
            {store.games.length > 0 ? (
              <div className="w-24 h-16 rounded-lg m-auto mt-8">
                {loadMoreLoading ? (
                  <SmallLoader big={false} xCentered={true} />
                ) : (
                  <SearchButton
                    text="Load More"
                    onClick={() => loadGames(store.page)}
                  />
                )}
              </div>
            ) : (
              <SmallLoader big={true} xCentered={true} />
            )}
          </div>
        )}
      </div>
    </SearchLayout>
  )
}

interface Context {
  query: {
    yearRange: string[] | string | undefined
    genres: string[] | string | undefined
    consoles: string[] | string | undefined
    search: string | undefined
  }
}

export async function getServerSideProps(context: any) {
  function parseCookies(req: any) {
    return cookie.parse(req ? req.headers.cookie || '' : document.cookie)
  }

  const cookies: any = parseCookies(context.req)
  console.log(context.query)

  if (cookies.prevRoute === '/game/[id]') {
    return {
      props: {
        games: [],
      },
    }
  }
  const { yearRange, genres, consoles, search } = context.query
  let filteredString = ''
  let games = []
  let count = 0
  try {
    if (yearRange || genres || consoles || search) {
      if (search) {
        filteredString += `&search=${search}&`
      }
      if (yearRange) {
        filteredString = filteredString.concat(
          '',
          `&dates=${yearRange[0]}-01-01,${yearRange[1]}-12-31`
        )
      }
      //simetimes from the client i get consoles as string, but i need an array
      //thats why i am checkinf the type of the consoles
      if (consoles) {
        if (typeof consoles === 'string') {
          filteredString = filteredString.concat(
            `&parent_platforms=${consoles}`
          )
        } else {
          let consolesString = ''
          for (const key in consoles) {
            if (parseInt(key) !== consoles.length - 1) {
              consolesString = consolesString.concat(`${consoles[key]}`, ',')
            } else {
              consolesString = consolesString.concat(`${consoles[key]}`, '')
            }
          }
          filteredString = filteredString.concat(`&platforms=${consolesString}`)
        }
      }
      if (genres) {
        if (typeof genres === 'string') {
          filteredString = filteredString.concat(`&genres=${genres}`)
        } else {
          let genresString = ''
          for (const key in genres) {
            if (parseInt(key) !== genres.length - 1) {
              genresString = genresString.concat(`${genres[key]}`, ',')
            } else {
              genresString = genresString.concat(`${genres[key]}`, '')
            }
          }
          filteredString = filteredString.concat(`&genres=${genresString}`)
        }
      }
      const getData: any = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&page=1&page_size=20${filteredString}`
      )
      console.log(getData)
      games = getData.data.results
      count = getData.data.count
    } else {
      const getData: any = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&dates=1990-01-01,2022-12-31&page=1&page_size=20`
      )
      games = getData.data.results
      count = getData.data.count
    }

    return {
      props: {
        games,
        count,
        error: null,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        games: [],
        error: 'Error Loading Games',
      },
    }
  }
}
