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
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/functions/mongodb'
import { wretchAction } from '../../lib/functions/fetchLogic'
import styles from './index.module.scss'


export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //2 types of errors
  const router = useRouter()
  const store = useStore()

  const [error, setError] = useState<string>('')
  const [noResults, setNoResults] = useState<boolean>(false)
  const [nextPage, setNextPage] = useState<boolean>(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false)

  const loadInitialResults = () => {
    const { already_visited, error, games, count, isNextPage } = props;

    if (already_visited && store.games.length) {
      setNextPage(true);
      return;
    }

    if (error) {
      setError(error);
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
    setError('');
    setLoadMoreLoading(true);
    try {
      const fetchMoreGames = await wretchAction('/api/query/search', {
        page: store.page,
        query: router.query,
      });
      if (fetchMoreGames.error) {
        throw new Error('Unable to fetch more games');
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
      setError((e as Error).message);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    loadInitialResults()
  }, [])

  useEffect(() => {
    if (store.reload) {
      load_more().then(() => store.activateReload(false))
    }
  }, [store.reload])

  const sort = () => {
    // const { query } = router
    // if (router.query.sort) {
    //   router.query.sort = []
    //   router.push({
    //     pathname: router.pathname,
    //     query: { ...query },
    //   })
    // } else {
    //   router.push({
    //     pathname: router.pathname,
    //     query: { ...query, sort: 'year' },
    //   })
    // }
  }

  return (
    <SearchLayout>
      <div className='responsive_wrapper py-10'>
        {store.isFilterOn ? <Filters /> : null}
        {noResults ? (
          <div className="pt-32">
            <LoadingError
              mainTitle={'No Results Found'}
              description={'We couldnt find what you searched...'}
            />
          </div>
        ) : (
          <>
            <div
              id={styles.header_titles}
              className="flex justify-between items-center">
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
          {nextPage ?
            loadMoreLoading ? (
              // <div className='m-auto flext justify-center bg-red-200'>
              <SmallLoader xCentered={true} />
              // </div>
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

  const { yearRange, genres, consoles, search, sort } = ctx.query

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
      const data = await db.collection('short_games').find(query).limit(16).toArray()
      const count = await db.collection('short_games').countDocuments(query)
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