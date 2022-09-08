import { ShortGame } from '../../types'
import Link from 'next/link'
import Image from 'next/image'
interface Props {
  game: ShortGame
}

export default function GameCover({ game }: Props) {
  return (
    <div
      id="game_cover"
      className="flex items-center flex-nowrap mt-4 cursor-pointer mr-4"
    >
      {game.background_image ? (
        <Image
          className="rounded-md"
          src={game?.background_image}
          width={48}
          height={48}
          quality={100}
        />
      ) : null}
      <Link href={`/game/${game.id}`}>
        <h1 className="font-medium text-md  text-white whitespace-nowrap pl-4 py-3">
          {/* {slicedParagrap(game.name, 22, 60)} */}
          {game.name}
        </h1>
      </Link>
    </div>
  )
}
