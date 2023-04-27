import Link from 'next/link'
import { ElementDescription, ParentPlatform, ShortGame } from '../../types'
import { useEffect, useState } from 'react'
import BackgroundGameImage from '../BackgroundGameImage'
import { wretchWrapper } from '../../lib/functions/fetchLogic'
import styles from './index.module.scss'
type Props = {
  game: ShortGame
}

export default function SmallGameBox({ game }: Props) {
  if (!game) return null

  const [movieUrl, setMovieUrl] = useState<string | null>(null)

  const loadMovie = async (): Promise<void> => {
    try {
      const getMovies: any = await wretchWrapper(`/api/game/get/getMovie?gameId=${game.id}`
        , 'getMoviews')
      if (!getMovies.movies) return
      setMovieUrl(getMovies.movies[0].data.max)
    } catch (e) {
      return
    }
  }

  useEffect(() => {
    loadMovie()
  }, [])

  return (
    <Link href={`/game/${game.id}`} className="cursor-pointer">
      <div
        id={styles.wrapper}
        className="h-72 rounded-lg mx-3 overflow-hidden mb-12 z-10 cursor-pointer ">
        <BackgroundGameImage bg={game.background_image} movieUrl={movieUrl} />
        <div className="flex-grow p-4">
          <h1
            style={{ lineBreak: 'anywhere' }}
            className="font-semibold text-white text-xl whitespace-pre-wrap hover:text-gray-500"
          >
            {game.name}
          </h1>
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
                ?.slice(0, 3)
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
      </div >
    </Link >
  )
}
