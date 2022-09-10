import Link from 'next/link'
import { ElementDescription, ParentPlatform, ShortGame } from '../types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import BackgroundGameImage from './BackgroundGameImage'

type Props = {
  game: ShortGame
}

export default function SmallGameBox({ game }: Props) {
  if (!game) return null

  const [movieUrl, setMovieUrl] = useState<string | null>(null)

  const loadMovie = async (): Promise<void> => {
    try {
      const req = await axios.get(
        `https://api.rawg.io/api/games/${game.id}/movies?key=0ffbdb925caf4b20987cd068aa43fd75`
      )
      if (req.status !== 200) throw new Error()
      if (req.data.count > 0) {
        setMovieUrl(req.data.results[0].data.max)
      }
    } catch (e) {
      return
    }
  }

  useEffect(() => {
    loadMovie()
  }, [])

  return (
    <div
      id="game_box"
      className="h-72 rounded-lg mx-3 mb-10 overflow-hidden z-10"
      style={{ height: '1%', width: '26rem', backgroundColor: '#0e3462   ' }}
    >
      <BackgroundGameImage bg={game.background_image} movieUrl={movieUrl} />
      <div className="flex-grow p-4">
        <Link href={`/game/${game.id}`}>
          <h1
            style={{ lineBreak: 'anywhere' }}
            className="cursor-pointer font-semibold text-white text-xl whitespace-pre-wrap hover:text-gray-500"
          >
            {game.name}
          </h1>
        </Link>
        <div className="flex flex-row flex-nowrap pt-2">
          {game?.parent_platforms
            ?.slice(0, 3)
            .map((platform: ParentPlatform, index: number) => (
              <h2 key={index} className="pr-1 text-sm text-cool-blue">
                {platform.platform.name}
                {index === game.parent_platforms.length - 1 || index === 2
                  ? ''
                  : ','}
              </h2>
            ))}
        </div>
        <div className="flex flex-row justify-between pt-6">
          <div className="flex flex-row flex-nowrap">
            {game?.genres
              .slice(0, 3)
              .map((genre: ElementDescription, index: number) => (
                <h2 key={index} className="pr-1 text-sm text-white opacity-90">
                  {genre.name}
                  {index === game?.genres.length - 1 || index === 2 ? '' : ','}
                </h2>
              ))}
          </div>
          <h2 className="pr-1 text-sm text-white opacity-90">
            {game.released?.slice(0, 4)}
          </h2>
        </div>
      </div>
    </div>
  )
}
