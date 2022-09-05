import Link from 'next/link'
import Image from 'next/image'
import { ElementDescription, ShortGame } from '../types'
import PlatformIcon from './common/PlatformIcon'

type Props = {
  game: ShortGame
  key: number
}

interface PlatformParentObject {
  platform: ElementDescription
}

export default function SmallGameBox(props: Props) {
  const game = props.game
  if (!game) return null
  return (
    <div
      id="game_box"
      className="h-72 rounded-lg mx-3 mb-10 overflow-hidden z-10"
      style={{ height: '1%', width: '26rem', backgroundColor: '#0e3462   ' }}
    >
      <div className="bg-image">
        {!game.background_image ? null : (
          <Image
            quality={55}
            loading="eager"
            className="z-0"
            src={game.background_image}
            layout="fill"
            objectFit="cover"
            alt="Not Working!"
          />
        )}
      </div>
      <div className="flex-grow p-4">
        <Link href={`/game/${props.game.id}`}>
          <h1
            style={{ lineBreak: 'anywhere' }}
            className="font-semibold text-white text-xl whitespace-pre-wrap hover:text-gray-500"
          >
            {game.name}
          </h1>
        </Link>

        <div className="flex flex-row flex-nowrap pt-2">
          {game?.parent_platforms
            ?.slice(0, 3)
            .map((platform: PlatformParentObject, index: number) => (
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
