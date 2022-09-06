import { ShortGame } from '../../types'
import Link from 'next/link'
import slicedParagrap from '../../lib/functions/slicedParagraph'
interface Props {
  game: ShortGame
}

export default function GameCover({ game }: Props) {
  return (
    <div className="flex items-center flex-nowrap pt-4">
      <div
        className="h-12 w-12 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${game.background_image})` }}
      />
      <Link href={`/game/${game.id}`}>
        <h1 className="font-semibold text-lg cursor-pointer text-white whitespace-nowrap hover:text-gray-300 px-6 py-3">
          {slicedParagrap(game.name, 22, 39)}
        </h1>
      </Link>
    </div>
  )
}
