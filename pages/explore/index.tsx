import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import { getSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import SmallLoader from '../../components/common/SmallLoader'
import ExploreScroll from '../../components/Explore/ExploreScroll'
import SearchLayout from '../../components/layout/SearchLayout'
import getRandomInt from '../../lib/functions/generateRandom'
import clientPromise from '../../lib/functions/mongodb'
import { genres, parentConsoles } from '../../lib/staticData'
import { ShortGame } from '../../types'

interface Props {
  games: ShortGame[]
  explored: number
}

export default function Index(props: Props) {
  const [games, setGames] = useState<ShortGame[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [explored, setExplores] = useState<number>(0)
  const exploreScrollRef: any = useRef()

  useEffect(() => {
    setGames(props.games)
    setExplores(props.explored)
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
        <h1 id="navbar" className=" font-bold text-white text-4xl px-44  py-10">
          You have explored {explored} new games
        </h1>
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center bg-white w-12 h-12 rounded-full mt-0 cursor-pointer opacity-60 hover:opacity-90">
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
    </SearchLayout >
  )
}

export async function getServerSideProps(context: any) {
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

  const client = await clientPromise
  const db = client.db('gameFevr')
  const session = await getSession(context)

  const user: any = await db.collection('users').findOne({ _id: new ObjectId(session?.user.userId) })

  const explored = user?.visited_explore?.length

  const games = await getData.json()
  return {
    props: {
      games: games.results,
      explored: explored ? explored : 0
    },
  }
}
