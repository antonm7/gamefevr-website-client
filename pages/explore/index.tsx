import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import SmallLoader from '../../components/common/SmallLoader'
import ExploreScroll from '../../components/Explore/ExploreScroll'
import SearchLayout from '../../components/layout/SearchLayout'
import getRandomInt from '../../lib/functions/generateRandom'
import { genres, parentConsoles } from '../../lib/staticData'
import { ShortGame } from '../../types'

interface Props {
  games: ShortGame[]
}

export default function Index(props: Props) {
  const [games, setGames] = useState<ShortGame[]>([])
  const [current, setCurrent] = useState<number>(1)
  const exploreScrollRef: any = useRef()

  useEffect(() => {
    setGames(props.games)
  }, [])

  useEffect(() => {
    if (!games.length) return
    if (current >= games.length - 15) {
      loadMore()
    }
  }, [current])

  const loadMore = async () => {
    try {
      const req = await axios.get('/api/explore/get/search')
      if (req.status !== 200) throw new Error()
      if (!req.data.results.length) throw new Error()
      setGames((arr) => [...arr, ...req.data.results])
    } catch (e) {
      console.log(e)
    }
  }

  if (!games) return <SmallLoader screenCentered={true} big={true} />

  return (
    <SearchLayout>
      <div>
        <h1 id="navbar" className="text-white text-2xl font-semibold px-40">
          You have explored 0 new games
        </h1>
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center bg-white w-12 h-12 rounded-full mt-2 cursor-pointer opacity-60 hover:opacity-90">
            <FontAwesomeIcon
              onClick={() => exploreScrollRef?.current?.slickPrev()}
              icon={faArrowUp}
              className="text-darkIndigo h-6"
            />
          </div>
          <ExploreScroll
            onUpdate={(c: number) => setCurrent(c)}
            setRef={exploreScrollRef}
            games={games}
          />
          <div className="flex justify-center items-center bg-white w-12 h-12 rounded-full mt-8 cursor-pointer opacity-60 hover:opacity-90">
            <FontAwesomeIcon
              onClick={() => exploreScrollRef?.current?.slickNext()}
              icon={faArrowDown}
              className="text-darkIndigo h-6"
            />
          </div>
        </div>
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps() {
  const limit = 50
  const page = Math.round(getRandomInt(0, 760000) / limit)
  let filteredString = ''

  const useOrNot = () => {
    const num = Math.round(Math.random())
    if (num === 0) {
      return false
    }
    return true
  }

  if (useOrNot()) {
    const consoles = parentConsoles
    let consolesString = ''
    const item = consoles[Math.floor(Math.random() * consoles.length)]
    consolesString = consolesString.concat(`${item.id}`, '')
    filteredString = filteredString.concat(`&consoles=${consolesString}`)
  }
  //add more
  if (useOrNot()) {
    const genresData = genres
    let genresString = ''
    const item = genresData[Math.floor(Math.random() * genresData.length)]
    genresString = genresString.concat(`${item.id}`, '')
    filteredString = filteredString.concat(`&platforms=${genresString}`)
  }

  const getData = await fetch(
    `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&page=${page}&page_size=${limit}`
  )

  const games = await getData.json()
  return {
    props: {
      games: games.results,
    },
  }
}
