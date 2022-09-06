import { same_series_type } from '../../types'
import GameCover from './GameCover'

interface Props {
  games: same_series_type
}

export default function SameSeries({ games }: Props) {
  if (games.results.length === 0) return null

  if (games.results.length >= 4) {
    return (
      <div>
        <div className="flex">
          <GameCover game={games.results[0]} />
          <GameCover game={games.results[1]} />
        </div>
        <div className="flex">
          <GameCover game={games.results[2]} />
          <GameCover game={games.results[3]} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-wrap justify-end">
        {games.results.map((game) => (
          <GameCover game={game} key={game.id} />
        ))}
      </div>
    )
  }
}
