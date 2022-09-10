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
import { GetServerSidePropsContext } from 'next'

interface Props {
  games: ShortGame[]
  count: number
  error: string | null
  nextPage: boolean
}

export default function Index(props: Props) {
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<boolean>(props.nextPage)
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const changeGlobalErrorType = useGlobalError((store) => store.setType)
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
        setNextPage(getData.data.nextPage)
        store.setCount(getData.data.count)
      }
      setLoadMoreLoading(false)
    } catch (e) {
      setLoadMoreLoading(false)
      changeGlobalErrorVisibility(true)
      changeGlobalErrorType('error')
    }
  }

  useEffect(() => {
    setLoadMoreLoading(false)
    setLoadingError(false)
    if (store.games.length === 0 && props.games.length === 0) {
      setLoadMoreLoading(true)
      loadGames(1)
      return
    }
    if (props.games.length === 0) return
    else {
      if (props.error) {
        setLoadingError(true)
        return
      }
      if (props.games.length === 0) {
        setNoResults(true)
        return
      }
      //making sure there is no dublicate games on initial search
      store.clearGames()
      store.addPage()
      store.addGames(props.games)
      store.setCount(props.count)
    }
  }, [props.games, props.error])

  const sort = () => {
    const { pathname, query }: any = router
    const params = new URLSearchParams(query)
    if (router.query.sort) {
      params.delete('sort')
      router.replace({ pathname, query: params.toString() })
    } else {
      router.push({
        pathname: router.pathname,
        query: { ...query, sort: 'year' },
      })
    }
  }

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
            {!loadMoreLoading ? (
              <div
                id="we_found_title_wrapper"
                className="flex justify-between items-center"
              >
                <p
                  id="we_found_title"
                  className="we_found_padding font-bold text-white text-4xl px-44 pb-10"
                >
                  We found {store.count.toLocaleString()} games for you
                </p>
                <div
                  className={`we_found_padding px-44 pb-10 text-white ${
                    router.query.sort ? 'underline' : ''
                  }`}
                >
                  <span className="opacity-60">Sort by:</span>{' '}
                  <span
                    className="font-semibold  cursor-pointer"
                    onClick={() => sort()}
                  >
                    Year
                  </span>
                </div>
              </div>
            ) : null}
            <div
              id="games_wrapper"
              className="flex flex-wrap justify-center px-40 "
            >
              {store.games.map((game: ShortGame, index: number) => (
                <SmallGameBox key={index} game={game} />
              ))}
            </div>
            {nextPage ? (
              store.games.length > 0 ? (
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
              )
            ) : null}
          </div>
        )}
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  function parseCookies(req: any) {
    return cookie.parse(req ? req.headers.cookie || '' : document.cookie)
  }

  const cookies = parseCookies(context.req)

  if (cookies.prevRoute === '/game/[id]') {
    return {
      props: {
        games: [],
      },
    }
  }
  const { yearRange, genres, consoles, search, sort } = context.query
  let filteredString = ''
  let games = []
  let count = 0
  try {
    if (yearRange || genres || consoles || search || sort) {
      if (search) {
        filteredString += `&search=${search}&`
      }
      if (yearRange) {
        if (!Array.isArray(yearRange)) {
          filteredString = filteredString.concat(
            '',
            `&dates=1990-01-01,2023-12-31`
          )
        } else {
          filteredString = filteredString.concat(
            '',
            `&dates=${yearRange[0]}-01-01,${yearRange[1]}-12-31`
          )
        }
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

      if (sort === 'year') {
        filteredString = filteredString.concat('&ordering=-released')
      }

      const getData = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&dates=1990-01-01,2023-12-31&page=1&page_size=28${filteredString}`
      )
      console.log(filteredString)
      games = getData.data.results
      count = getData.data.count
    } else {
      const getData = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&dates=1990-01-01,2023-12-31&page=1&page_size=28`
      )
      games = getData.data.results
      count = getData.data.count
    }
    //calculate function to check if there is next page
    const isNextPage = (page: number) => {
      if (page * 28 < count) {
        return true
      } else {
        return false
      }
    }

    return {
      props: {
        games,
        count,
        nextPage: isNextPage(1),
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
