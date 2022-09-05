import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGlobalError, useStore } from '../../store'
import { NamedGame } from '../../types'
import FiltersAppliedCount from './FiltersAppliedCount'

export default function SearchInput() {
  const store = useStore()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [games, setGames] = useState<NamedGame[]>([])
  const globalErrorState = useGlobalError((state) => state)

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
    store.changeGameName(searchTerm)
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm === '') {
        setGames([])
      } else {
        fetchData(searchTerm)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <div>
      <div className="flex items-center relative">
        <FontAwesomeIcon
          onClick={() => store.changeFilterVisibility(true)}
          icon={faSliders}
          className="absolute h-4 cursor-pointer right-4 text-gray-600"
        />
        <FiltersAppliedCount bigInput={true} />
        <input
          autoSave="true"
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
          placeholder="Search..."
          className="w-700 text-white placeholder-slate-400 outline-0 p-4 h-16 bg-inputBg rounded-lg"
        />
      </div>
      {games.length === 0 ? (
        <p className="text-cool-blue opacity-30 text-xs pt-2">
          Press the search button to start exploring games
        </p>
      ) : null}
      {games.length > 0 ? (
        <div
          style={{ minHeight: '7rem' }}
          className="w-700 text-white placeholder-slate-400 outline-0 px-4 py-2 h-auto bg-inputBg rounded-lg mt-2"
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
