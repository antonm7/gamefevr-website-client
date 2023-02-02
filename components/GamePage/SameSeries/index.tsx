import React, { ReactElement, useEffect, useState, useMemo } from 'react'
import { same_series_type, ShortGame } from '../../../types'
import GameCover from '../GameCover'
import styles from './index.module.scss'
interface Props {
  games: same_series_type
}

const RenderedTitle = (): ReactElement => {
  return (
    <h1 className="text-2xl text-white font-medium pt-2 underline">
      Same Series
    </h1>
  )
}

export default function SameSeries({ games }: Props) {
  const [gs, setGs] = useState<ShortGame[]>([])

  useEffect(() => {
    setGs(games.results)
  }, [games])

  const splicedGames = (g: ShortGame[]): ShortGame[] => {
    if (g.length > 5) {
      return g.splice(0, 5)
    } else {
      return g
    }
  }

  const memoizedGamesCount = useMemo(() => splicedGames(gs), [gs])

  if (gs.length === 0) return null

  return (
    <div
      id={styles.global_wrapper}
      className="text-center pt-12"
      style={{ width: '24%' }}
    >
      <RenderedTitle />
      <div id={styles.inner_games_container}>
        {memoizedGamesCount.map((game) => (
          <GameCover game={game} key={game.id} />
        ))}
      </div>
    </div>
  )
}
