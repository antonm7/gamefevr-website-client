import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { wretchWrapper } from '../../../lib/functions/fetchLogic'
import { useStore } from '../../../store'
import { NamedGame } from '../../../types'
import FiltersAppliedCount from '../FiltersAppliedCount'
import styles from './index.module.scss'

export default function SearchInput() {
  const store = useStore()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [games, setGames] = useState<NamedGame[]>([])

  const fetchData = async (name: string): Promise<void> => {
    try {
      const fetchNameData: any = await wretchWrapper(`/api/query/name?search=${name}`, 'fetchNameData')
      const games: NamedGame[] = fetchNameData.games
      setGames(games)
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: 'error getting games, try again'
      })
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
    <div className='flex flex-col' id={styles.wrapper}>
      <div className='relative'>
        <div className="absolute h-full w-1 rounded-tl-xl rounded-bl-xl bg-specialYellow"></div>
        <FiltersAppliedCount bigInput={true} />
        <FontAwesomeIcon
          onClick={() => store.changeFilterVisibility(true)}
          icon={faSliders}
          className="absolute h-4 cursor-pointer top-6 right-4 text-gray-600"
        />
        <input
          id={styles.input_wrapper}
          autoSave="true"
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
          placeholder="Search..."
          className="w-700 text-white placeholder-slate-400 outline-0 p-4 pl-6 h-16 bg-inputBg rounded-lg"
        />
      </div>
      {games.length > 0 ?
        null
        : <p className="text-cool-blue opacity-30 text-xs pt-2">
          Press the search button to start exploring games
        </p>
      }
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
      {/* <div className="flex items-center relative overflow-hidden">
        <div className="absolute h-full w-1 rounded-tl-xl rounded-bl-xl bg-specialYellow"></div>
        <FontAwesomeIcon
          onClick={() => store.changeFilterVisibility(true)}
          icon={faSliders}
          className="absolute h-4 cursor-pointer right-4 text-gray-600"
        />
        <FiltersAppliedCount bigInput={true} />
        <input
          id="search_input_wrapper"
          autoSave="true"
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
          placeholder="Search..."
          className="w-700 text-white placeholder-slate-400 outline-0 p-4 pl-6 h-16 bg-inputBg rounded-lg"
        />
      </div>
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
      ) : null} */}
    </div>
  )
}
