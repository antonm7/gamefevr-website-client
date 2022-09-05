import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFiltersStore, useGlobalError, useStore } from '../../store'
import { NamedGame } from '../../types'
import FiltersAppliedCount from './FiltersAppliedCount'

export default function SmallSearchInput() {
  const [search, setSearch] = useState<string>('')
  const [games, setGames] = useState<NamedGame[]>([])
  const globalErrorState = useGlobalError((state) => state)

  const store = useStore()
  const router = useRouter()
  const filtersStore = useFiltersStore()

  const changeGameName = (text: string) => {
    setSearch(text)
    store.changeGameName(text)
  }

  const navigate = () => {
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
            filtersStore.yearRange[1] === 2022
              ? []
              : filtersStore.yearRange,
        },
      })
    } else {
      router.push({
        pathname: '/search',
        query: {
          genres: filtersStore.genres,
          consoles: filtersStore.consoles,
          yearRange:
            filtersStore.yearRange[0] === 1990 &&
            filtersStore.yearRange[1] === 2022
              ? []
              : filtersStore.yearRange,
        },
      })
    }
    store.clearGames()
    store.clearPage()
    store.changeFilterVisibility(false)
  }

  const fetchData = async (name: string) => {
    try {
      const getData = await axios.get(`/api/query/name?search=${name}`)
      const games: NamedGame[] = getData.data.games
      setGames(games)
    } catch (e) {
      globalErrorState.setType('error')
      globalErrorState.setText('error getting games, try again')
      globalErrorState.setIsVisible(true)
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

  return (
    <div>
      <div id="small_search_input" className="flex items-center relative">
        <FontAwesomeIcon
          onClick={() => store.changeFilterVisibility(true)}
          icon={faSliders}
          className="absolute h-3 cursor-pointer right-10 text-gray-600"
        />
        <FontAwesomeIcon
          onClick={() => navigate()}
          icon={faMagnifyingGlass}
          className="absolute h-3 cursor-pointer right-4 text-white"
        />
        <FiltersAppliedCount />
        <input
          id="small_search_input_input"
          value={search}
          autoSave="true"
          placeholder="Search..."
          className="w-500 text-white text-xs placeholder-slate-400 outline-0 p-4 h-10 bg-main-blue rounded-lg"
          onChange={(e) => changeGameName(e.target.value)}
        />
      </div>
      {games.length > 0 ? (
        <div
          id="small_search_input_game_box"
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
    </div>
  )
}
