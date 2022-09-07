import { ShortGame } from '../../types'
import Link from 'next/link'
import slicedParagrap from '../../lib/functions/slicedParagraph'
import Image from 'next/image'
interface Props {
  game: ShortGame
}

export default function GameCover({ game }: Props) {
  return (
    <div className="flex items-center flex-nowrap mt-4 cursor-pointer hover:bg-inputBg">
      <Image src={game.background_image} width={48} height={48} quality={85} />
      <Link href={`/game/${game.id}`}>
        <h1 className="font-medium text-md  text-white whitespace-nowrap pl-4 py-3">
          {slicedParagrap(game.name, 22, 39)}
        </h1>
      </Link>
    </div>
  )
}
