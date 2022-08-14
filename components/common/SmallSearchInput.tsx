import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useFiltersStore, useStore } from '../../store'
import FiltersAppliedCount from './FiltersAppliedCount'

export default function SmallSearchInput() {
  const [search, setSearch] = useState<string>('')

  const store = useStore()
  const router = useRouter()
  const filtersStore = useFiltersStore()

  const changeGameName = (text: string) => {
    setSearch(text)
    store.changeGameName(text)
  }

  // const memoizedNavigate = useCallback(() => navigate(), [])

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

  return (
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
  )
}
