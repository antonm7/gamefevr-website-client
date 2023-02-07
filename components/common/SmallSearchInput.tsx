import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { wretchWrapper } from '../../lib/functions/fetchLogic'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import { useFiltersStore, useStore } from '../../store'
import { NamedGame } from '../../types'
import FiltersAppliedCount from './FiltersAppliedCount'

export default function SmallSearchInput({ full }: { full: boolean }) {
  const [search, setSearch] = useState<string>('')
  const [games, setGames] = useState<NamedGame[]>([])
  const [width] = useWindowSize()

  const store = useStore()
  const router = useRouter()
  const filtersStore = useFiltersStore()

  const changeGameName = (text: string): void => {
    setSearch(text)
    store.changeGameName(text)
  }

  const navigate = (): void => {
    setCookie('prevRoute', '/')
    if (store.gameName.length > 0) {
      router.push({
        pathname: '/search',
        query: {
          search: store.gameName,
          genres: filtersStore.genres,
          consoles: filtersStore.consoles,
          yearRange:
            filtersStore.yearRange[0] === 1990 &&
              filtersStore.yearRange[1] === 2023
              ? []
              : filtersStore.yearRange,
        },
      })
    } else {
      router.push({
        pathname: '/search',
        query: {
          search: store.gameName,
          genres: filtersStore.genres,
          consoles: filtersStore.consoles,
          yearRange:
            filtersStore.yearRange[0] === 1990 &&
              filtersStore.yearRange[1] === 2023
              ? []
              : filtersStore.yearRange,
        },
      })
    }
    store.clearGames()
    store.clearPage()
    store.changeFilterVisibility(false)
  }

  const fetchData = async (name: string): Promise<void> => {
    try {
      const getGameNameData: any = wretchWrapper(`/api/query/name?search=${name}`, 'getGameNameData')
      const games: NamedGame[] = getGameNameData.games
      setGames(games)
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: 'error getting games, try again'
      })
    }
  }

  useEffect(() => {
    store.changeGameName(search)
    const delayDebounceFn = setTimeout(() => {
      if (search === '') {
        setGames([])
      } else {
        fetchData(search)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  //clear games state on navigation
  useEffect(() => {
    setGames([])
  }, [router])

  return (
    <>
      <div className="flex items-center relative">
        <FontAwesomeIcon
          onClick={() => store.changeFilterVisibility(true)}
          icon={faSliders}
          className={`absolute ${width > 700 ? 'h-3 right-10' : 'h-5 right-14'} cursor-pointer  text-gray-600`}
        />
        <FontAwesomeIcon
          onClick={() => navigate()}
          icon={faMagnifyingGlass}
          className={`${width > 700 ? 'h-3 right-4' : 'h-4 right-5'} absolute  cursor-pointer  text-white`}
        />
        <FiltersAppliedCount />
        <input
          value={search}
          autoSave="true"
          placeholder="Search..."
          className={`${full ? 'w-full h-50' : 'w-500 h-10'} text-white text-xs placeholder-slate-400 outline-0 p-4 bg-main-blue rounded-lg`}
          onChange={(e) => changeGameName(e.target.value)}
        />
      </div>
      {games.length > 0 ? (
        <div
          style={{ minHeight: '7rem' }}
          className="absolute w-500 text-white placeholder-slate-400 outline-0 px-4 py-2 h-auto bg-inputBg rounded-lg mt-2 z-50"
        >
          {games.map((game: NamedGame, index: number) => (
            <Link href={`/game/${game.id}`} key={index}>
              <h1
                className="cursor-pointer my-3 text-base font-base"
                style={{ color: '#9da8b6' }}
              >
                {game.name}
              </h1>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  )
}
