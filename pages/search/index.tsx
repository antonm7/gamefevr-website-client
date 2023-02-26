import SearchLayout from '../../components/layout'
import SmallGameBox from '../../components/SmallGameBox'
import SearchButton from '../../components/common/SearchButton'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
import { wretchAction, wretchWrapper } from '../../lib/functions/fetchLogic'
import styles from './index.module.scss'

type Props = {
  games: ShortGame[]
  count: number
  error: string | null
  nextPage: boolean
}

export default function Index(props: Props) {
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<boolean>(false)
  //2 types of errors
  const [loadingError, setLoadingError] = useState<boolean>(false)
  const [noResults, setNoResults] = useState<boolean>(false)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState<boolean>(true)
  const router = useRouter()
  const store = useStore()

  const loadMoreGames = async () => {
    if (loadingError) {
      setLoadingError(false)
    }

    try {
      setNoResults(false)
      setLoadMoreLoading(true)
      const fetchMoreGames: any = await wretchAction('/api/query/search', {
        page: store.page,
        query: router.query
      })
      if (fetchMoreGames.length === 0) {
        //if there no games from server, dont update the games state
        //and remove the loadMore button
        setShowLoadMoreButton(false)
        setNextPage(false)
      } else {
        setShowLoadMoreButton(true)
        setNextPage(fetchMoreGames.nextPage)
        store.addPage()
        store.addGames(fetchMoreGames.games)
        store.setCount(fetchMoreGames.count)
      }
      setLoadMoreLoading(false)
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: ''
      })
      setLoadMoreLoading(false)
      setShowLoadMoreButton(true)
    }
  }

  const initialLoading = async () => {
    setLoadMoreLoading(false)
    setLoadingError(false)
    setShowLoadMoreButton(true)

    if (props.nextPage) {
      setNextPage(true)
    }

    if (props.error) return setLoadingError(true)

    if (!store.games.length && !props.games.length) {
      setLoadMoreLoading(true)
      loadMoreGames()
      return
    }
    if (!props.games.length && !props.error) return
    if (props.error) return setLoadingError(true)
    if (!props.games.length) {
      setNoResults(true)
    } else {
      store.clearGames()
      store.addPage()
      store.addGames(props.games)
      store.setCount(props.count)
    }
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
              onClick={() => loadMoreGames()}
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
          <div className="responsive_wrapper py-10">
            {!loadMoreLoading ? (
              <div
                id={styles.header_titles}
                className="flex justify-between items-center"
              >
                <p
                  id={styles.we_found_title}
                  className="font-bold text-white text-4xl pb-10"
                >
                  We found {store.count.toLocaleString()} games for you
                </p>
                <div className={`h-full pb-10 text-white ${router.query.sort ? 'underline' : ''}`}>
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
              id={styles.games_wrapper}
              className="flex flex-wrap justify-between">
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
                      onClick={() => loadMoreGames()}
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

function parseCookies(req: any) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
  const usedYears: visited_years[] = []
  const usedGenres: string[] = []
  const usedPlatforms: string[] = []
  const session = await getSession(context)

  const isNextPage = (page: number, count: number) => {
    if (page * 28 < count) {
      return true
    } else {
      return false
    }
  }

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

    if (consoles) {
      //if there is only one filtered console then I will get a string from
      // the query
      if (typeof consoles === 'string') {
        filteredString = filteredString.concat(
          `&parent_platforms=${consoles}}`
        )
        if (session) {
          usedPlatforms.push(consoles)
        }
        // if its not a string then the type is an array
        // and it means we got several consoles to filter from
      } else {
        let consolesString = ''
        for (const key in consoles) {
          if (session) {
            usedPlatforms.push(consoles[key])
          }
          if (parseInt(key) !== consoles.length - 1) {
            consolesString = consolesString.concat(
              `${parseInt(consoles[key])}`,
              ','
            )
          } else {
            consolesString = consolesString.concat(
              `${parseInt(consoles[key])}`,
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
        //filtering logic forseveral genres
        let genresString = ''
        for (const key in genres) {
          if (session) {
            usedGenres.push(genres[key])
          }
          if (parseInt(key) !== genres.length - 1) {
            genresString = genresString.concat(
              `${parseInt(genres[key])}`,
              ','
            )
          } else {
            genresString = genresString.concat(
              `${parseInt(genres[key])}`,
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

    if (session) {
      try {
        const client = await clientPromise
        const db = client.db()

        if (usedYears) {
          await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.userId) },
            { $push: { visited_years: { $each: usedYears } } }
          )
        }
        if (usedPlatforms) {
          await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.userId) },
            { $push: { visited_platforms: { $each: usedPlatforms } } }
          )
        }
        if (usedGenres) {
          await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.userId) },
            { $push: { visited_genres: { $each: usedGenres } } }
          )
        }
      } catch (e) {
        console.log('djsakdklasj')
        console.log('error on updating user fields for used_filters')
      }
    }

    try {
      const fetchGamesWithFilters = await wretchWrapper(`https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=1&page_size=28${filteredString}`, 'fetchGamesWithFilters')
      return {
        props: {
          games: fetchGamesWithFilters.results,
          count: fetchGamesWithFilters.count,
          nextPage: isNextPage(1, fetchGamesWithFilters.count),
          error: null,
        }
      }
    } catch (e) {
      return {
        props: {
          games: [],
          error: 'Error Loading Games',
        }
      }
    }
  } else {
    // No filters applied path
    try {
      const fetchGamesWithoutFilters = await wretchWrapper(`https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=1&page_size=28`, 'fetchGamesWithoutFilters')
      return {
        props: {
          games: fetchGamesWithoutFilters.results,
          count: fetchGamesWithoutFilters.count,
          nextPage: isNextPage(1, fetchGamesWithoutFilters.count),
          error: null,
        },
      }
    } catch (e) {
      return {
        props: {
          games: [],
          error: 'Error Loading Games',
        },
      }
    }
  }
}
