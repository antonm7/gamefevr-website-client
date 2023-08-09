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
import { wretchAction } from '../../lib/functions/fetchLogic'
import styles from './index.module.scss'

export default function Index() {
  const router = useRouter()
  const store = useStore()

  const [noResults, setNoResults] = useState<boolean>(false)
  const [initialError, setInitialError] = useState<boolean>(false)
  const [nextPage, setNextPage] = useState<boolean>(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const load_more = async (initial_render: boolean) => {
    if (store.games.length && initial_render) {
      setNextPage(true);
      return;
    }

    if (initial_render) {
      setLoading(true)
    }

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
    load_more(true)
  }, [])

  useEffect(() => {
    if (store.reload) {
      setLoading(true)
      load_more(false).then(() => store.activateReload(false))
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
                onClick={() => load_more(false)}
              />
            ) : null}
        </div>
      </div>
    </SearchLayout>
  )
}
