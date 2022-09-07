import React, { ReactElement } from 'react'
import { same_series_type } from '../../types'
import GameCover from './GameCover'

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
  if (games.results.length === 0) return null

  return (
    <div
      id="same_series"
      className="text-center pt-12"
      style={{ width: '27%' }}
    >
      <RenderedTitle />
      <div id="same_series_inner">
        {games.results.length > 5
          ? games.results
              .splice(0, 5)
              .map((game) => <GameCover game={game} key={game.id} />)
          : games.results.map((game) => (
              <GameCover game={game} key={game.id} />
            ))}
      </div>
    </div>
  )

  // if (games.results.length >= 4) {
  //   return (
  //     <div>
  //       <RenderedTitle />
  //       <div className="flex">
  //         <GameCover game={games.results[0]} />
  //         <GameCover game={games.results[1]} />
  //       </div>
  //       <div className="flex">
  //         <GameCover game={games.results[2]} />
  //         <GameCover game={games.results[3]} />
  //       </div>
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div>
  //       <RenderedTitle />
  //       <div className="flex flex-wrap">
  //         {games.results.map((game) => (
  //           <GameCover game={game} key={game.id} />
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }
}
