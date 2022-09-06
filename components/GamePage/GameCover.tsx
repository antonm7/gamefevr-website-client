import { ShortGame } from '../../types'
import Image from 'next/image'
interface Props {
  game: ShortGame
}

export default function GameCover({ game }: Props) {
  return (
    <div className="mt-4 ml-4">
      <Image
        quality={75}
        loading="eager"
        className="z-0"
        src={game.background_image}
        width={240}
        height={140}
        alt="Not Working!"
      />
    </div>
  )
}
