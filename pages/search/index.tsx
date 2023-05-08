import SearchLayout from '../../components/layout'
import SmallGameBox from '../../components/SmallGameBox'
import SearchButton from '../../components/common/SearchButton'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useStore } from '../../store'
import Filters from '../../components/Filters'
import SmallLoader from '../../components/common/SmallLoader'
import { type ShortGame } from '../../types'
import LoadingError from '../../components/common/LoadingError'
import cookie from 'cookie'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import clientPromise from '../../lib/functions/mongodb'
import { wretchAction } from '../../lib/functions/fetchLogic'
import styles from './index.module.scss'

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const store = useStore()

  const [noResults, setNoResults] = useState<boolean>(false)
  const [initialError, setInitialError] = useState<boolean>(false)
  const [nextPage, setNextPage] = useState<boolean>(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const loadInitialResults = () => {
    const { already_visited, error, games, count, isNextPage } = props;
    if (already_visited && store.games.length) {
      setNextPage(true);
      return;
    }

    if (already_visited && !store.games.length) {
      load_more()
      return
    }

    if (error) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: `error getting games, please try again`
      })
      setNoResults(true)
      setInitialError(true)
      return;
    }

    if (games?.length) {
      store.setCount(count ?? 0);
      store.clearGames();
      store.addGames(games);
      store.addPage();
      setNextPage(isNextPage);
    } else {
      setNoResults(true);
    }
  };

  const load_more = async () => {
    setNoResults(false);
    setLoadMoreLoading(true);
    setInitialError(false);
    try {
      const fetchMoreGames = await wretchAction('/api/query/search', {
        page: store.page,
        query: router.query,
      });
      if (fetchMoreGames.error) {
        throw new Error();
      }
      const { games = [], count = 0, isNextPage } = fetchMoreGames;
      store.setCount(count);
      store.addGames(games);
      setNextPage(isNextPage);

      store.addPage();

      if (!games.length) {
        setNoResults(true);
      }

    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: `error getting games, please try again`
      })
      setInitialError(true)
    } finally {
      setLoadMoreLoading(false);
      setLoading(false)
    }
  };

  useEffect(() => {
    loadInitialResults()
  }, [])

  useEffect(() => {
    if (store.reload) {
      setLoading(true)
      load_more().then(() => store.activateReload(false))
    }
  }, [store.reload])

  return (
    <SearchLayout>
      <div className='responsive_wrapper py-10'>
        {store.isFilterOn ? <Filters /> : null}
        {loading ? (
          <SmallLoader big={true} screenCentered={true} />
        ) : noResults && !initialError ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'No Results Found'}
              description={'We couldnt find what you searched...'}
            />
          </div>
        ) : initialError ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'Error occured'}
              description={'Unexpected error, please try again'}
              button={true}
              onClick={() => store.activateReload(true)}
            />
          </div>
        ) :
          loading ? <SmallLoader big={true} xCentered={true} /> : (
            <>
              <div
                id={styles.header_titles}
                className="flex justify-between items-center">
                {store.count > 0 ?
                  <p
                    id={styles.we_found_title}
                    className="font-bold text-white text-4xl pb-10"
                  >
                    We found {store.count.toLocaleString()} games for you
                  </p>
                  : null}
              </div>
              <div
                id={styles.games_wrapper}
                className="flex flex-wrap justify-between">
                {store.games.map((game: ShortGame, index: number) => (
                  <SmallGameBox key={index} game={game} />
                ))}
              </div>
            </>
          )}
        <div className="w-24 h-16 rounded-lg m-auto mt-8">
          {!initialError && !loading && nextPage ?
            loadMoreLoading ? (
              <SmallLoader xCentered={true} />
            ) : (
              <SearchButton
                text="Load More"
                onClick={() => load_more()}
              />
            ) : null}
        </div>
      </div>
    </SearchLayout>
  )
}

function parseCookies(req: any) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie)
}

interface PageProps {
  games: ShortGame[]
  error: string | null
  already_visited: boolean
  count: number | null
  isNextPage: boolean
}

interface QueryObject {
  [key: string]: {
    [key: string]: any
  } | any
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const cookies = parseCookies(ctx.req)
  if (cookies.prevRoute === '/game/[id]') {
    return {
      props: {
        games: [],
        error: null,
        already_visited: true,
        count: null,
        isNextPage: false,
      },
    }
  }

  const { yearRange, genres, consoles, search } = ctx.query

  const isNextPage = (page: number, count: number) => page * 16 < count

  let query: QueryObject = { $and: [] };

  if (search) {
    query.$and.push({ name: { $regex: new RegExp(search as string, 'i') } });
  }

  if (yearRange?.length === 2) {
    query.$and.push({
      released: {
        $gte: `${yearRange[0]}-01-01`,
        $lte: `${yearRange[1]}-12-31`,
      },
    })
  }

  if (genres) {
    const genreIds = Array.isArray(genres) ? genres.map((g) => parseInt(g)) : [parseInt(genres)]
    query.$and.push({
      genres: {
        $elemMatch: {
          id: { $in: genreIds },
        },
      },
    })
  }

  if (consoles) {
    const platformIds = Array.isArray(consoles) ? consoles.map((c) => parseInt(c)) : [parseInt(consoles)]
    query.$and.push({
      parent_platforms: {
        $elemMatch: {
          'platform.id': { $in: platformIds },
        },
      },
    })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const getGames = async (query: any) => {

      const data = await db.collection('short_games').find(query)
        .limit(16).toArray()
      const count = await db.collection('short_games').
        countDocuments(query) as unknown as number

      console.log(data.length, 'trying')
      return {
        games: JSON.parse(JSON.stringify(data)) as ShortGame[],
        count,
        error: null,
        already_visited: false,
        isNextPage: isNextPage(1, count),
      }
    }

    if (query.$and.length > 0) {
      return { props: await getGames(query) }
    } else {
      return { props: await getGames({}) }
    }

  } catch (e) {
    console.error(e)
    return {
      props: {
        games: [],
        error: 'Error loading data',
        already_visited: false,
        count: null,
        isNextPage: false,
      }
    }
  }
}