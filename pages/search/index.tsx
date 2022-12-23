import SearchLayout from '../../components/layout/SearchLayout'
import SmallGameBox from '../../components/SmallGameBox'
import SearchButton from '../../components/common/SearchButton'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useStore } from '../../store'
import Filters from '../../components/Filters'
import SmallLoader from '../../components/common/SmallLoader'
import { ShortGame } from '../../types'
import LoadingError from '../../components/common/LoadingError'
import cookie from 'cookie'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { visited_years } from '../../types/schema'
import clientPromise from '../../lib/functions/mongodb'
import { ObjectId } from 'bson'

interface Props {
  games: ShortGame[]
  count: number
  error: string | null
  nextPage: boolean
}

export default function Index(props: Props) {
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<boolean>(props.nextPage)
  //2 types of errors
  const [loadingError, setLoadingError] = useState<boolean>(false)
  const [noResults, setNoResults] = useState<boolean>(false)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState<boolean>(true)

  const router = useRouter()
  const store = useStore()

  const loadMoreGames = async (cur: number) => {
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
        //if there no games from server, dont update the games state
        //and remove the loadMore button
        setShowLoadMoreButton(false)
      } else {
        setShowLoadMoreButton(true)
        store.addPage()
        store.addGames(getData.data.games)
        setNextPage(getData.data.nextPage)
        store.setCount(getData.data.count)
      }
      setLoadMoreLoading(false)
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: ''
      })
      setLoadMoreLoading(false)
    }
  }

  const initialLoading = async () => {
    setLoadMoreLoading(false)
    setLoadingError(false)
    setShowLoadMoreButton(true)
    setNextPage(true)

    if (props.error) {
      setLoadingError(true)
      return
    }

    if (!store.games.length && !props.games.length) {
      setLoadMoreLoading(true)
      loadMoreGames(1)
      return
    }

    if (!props.games.length && !props.error) return

    if (props.error) {
      setLoadingError(true)
      return
    }

    if (!props.games.length) {
      setNoResults(true)
      return
    }

    store.clearGames()
    store.addPage()
    store.addGames(props.games)
    store.setCount(props.count)
  }

  useEffect(() => {
    initialLoading()
  }, [props.games, props.error])

  const sort = () => {
    const { query } = router
    if (router.query.sort) {
      router.query.sort = []
      router.push({
        pathname: router.pathname,
        query: { ...query },
      })
    } else {
      router.push({
        pathname: router.pathname,
        query: { ...query, sort: 'year' },
      })
    }
  }

  return (
    <SearchLayout>
      <>
        {store.isFilterOn ? <Filters /> : null}
        {loadingError ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'Unexpected Error'}
              description={'Oops...something went wrong'}
              button={true}
              onClick={() => loadMoreGames(1)}
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
                  className={`we_found_padding h-full px-44 pb-10 text-white ${router.query.sort ? 'underline' : ''
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
                  ) : showLoadMoreButton ? (
                    <SearchButton
                      text="Load More"
                      onClick={() => loadMoreGames(store.page)}
                    />
                  ) : null}
                </div>
              ) : (
                <SmallLoader big={true} xCentered={true} />
              )
            ) : null}
          </div>
        )}
      </>
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

  const usedYears: visited_years[] = []
  const usedGenres = []
  const usedPlatforms = []

  const session = await getSession(context)

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
          if (session) {
            usedYears.push({ range_1: yearRange[0], range_2: yearRange[1] })
          }
        }
      }
      //simetimes from the client i get consoles as string, but i need an array
      //thats why i am checkinf the type of the consoles
      if (consoles) {
        if (typeof consoles === 'string') {
          filteredString = filteredString.concat(
            `&parent_platforms=${parseInt(JSON.parse(consoles))}`
          )
          if (session) {
            usedPlatforms.push(JSON.parse(consoles))
          }
        } else {
          let consolesString = ''
          for (const key in consoles) {
            if (session) {
              usedPlatforms.push(consoles[key])
            }
            if (parseInt(key) !== consoles.length - 1) {
              consolesString = consolesString.concat(
                `${parseInt(JSON.parse(consoles[key]))}`,
                ','
              )
            } else {
              consolesString = consolesString.concat(
                `${parseInt(JSON.parse(consoles[key]))}`,
                ''
              )
            }
          }
          filteredString = filteredString.concat(`&platforms=${consolesString}`)
        }
      }
      if (genres) {
        if (typeof genres === 'string') {
          filteredString = filteredString.concat(
            `&genres=${parseInt(JSON.parse(genres))}`
          )
          if (session) {
            usedGenres.push(JSON.parse(genres))
          }
        } else {
          let genresString = ''
          for (const key in genres) {
            if (session) {
              usedGenres.push(genres[key])
            }
            if (parseInt(key) !== genres.length - 1) {
              genresString = genresString.concat(
                `${parseInt(JSON.parse(genres[key]))}`,
                ','
              )
            } else {
              genresString = genresString.concat(
                `${parseInt(JSON.parse(genres[key]))}`,
                ''
              )
            }
          }
          filteredString = filteredString.concat(`&genres=${genresString}`)
        }
      }

      if (sort === 'year') {
        filteredString = filteredString.concat('&ordering=-released')
      }
      //if some filters is applies
      const getData = await axios(
        `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=1&page_size=28${filteredString}`
      )
      games = getData.data.results
      count = getData.data.count

      if (session) {
        try {
          const client = await clientPromise
          const db = client.db()

          if (usedYears) {
            db.collection('users').updateOne(
              { _id: new ObjectId(session.user.userId) },
              { $push: { visited_years: { $each: usedYears } } }
            )
          }
          if (usedPlatforms) {
            db.collection('users').updateOne(
              { _id: new ObjectId(session.user.userId) },
              { $push: { visited_platforms: { $each: usedPlatforms } } }
            )
          }
          if (usedGenres) {
            db.collection('users').updateOne(
              { _id: new ObjectId(session.user.userId) },
              { $push: { visited_genres: { $each: usedGenres } } }
            )
          }
        } catch (e) {
          console.log('error on updating user fields for used_filters')
        }
      }
    } else {
      //empty filters search
      const getData = await axios(
        `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=1&page_size=28`
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

    console.log(isNextPage(1))

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
