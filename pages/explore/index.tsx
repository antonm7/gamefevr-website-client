import { useCallback, useEffect, useState } from 'react'
import ExploreScroll from '../../components/Explore/ExploreScroll'
import GameBox from '../../components/Explore/GameBox'
import SearchLayout from '../../components/layout/SearchLayout'
import getRandomInt from '../../lib/functions/generateRandom'
import { genres, parentConsoles } from '../../lib/staticData'
import { DetailedGame, ShortGame } from '../../types'

interface Props {
  games: ShortGame[]
}

export default function Index(props: Props) {
  if (!props.games) return null

  return (
    <SearchLayout>
      <div className="flex justify-center overflow-hidden">
        <ExploreScroll games={props.games} />
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps() {
  const limit = 5
  const page = Math.round(getRandomInt(0, 760000) / limit)
  let filteredString = ''

  const useOrNot = () => {
    const num = Math.round(Math.random())
    if (num === 0) {
      return false
    }
    return true
  }
  //consoles
  if (useOrNot()) {
    const consoles = parentConsoles
    let consolesString = ''
    const item = consoles[Math.floor(Math.random() * consoles.length)]
    consolesString = consolesString.concat(`${item.id}`, '')
    filteredString = filteredString.concat(`&consoles=${consolesString}`)
  }

  //genres
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
