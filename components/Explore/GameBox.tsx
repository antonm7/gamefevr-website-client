import {
  ElementDescription,
  Platform,
  ShortGame,
  Short_Screenshot,
} from '../../types'
import Image from 'next/image'
import Link from 'next/link'
import Tags from '../GamePage/Tags'

interface Props {
  game: ShortGame
}

export default function GameBox({ game }: Props) {
  if (!game) return null

  return (
    <Link href={`/game/${game.id}`} className="cursor-pointer">
      <div
        className="relative bg-darkIndigo rounded-lg  overflow-hidden p-12 cursor-pointer"
        style={{ height: '42rem', maxWidth: '26rem' }}
      >
        <div className="flex justify-between">
          <div className="pr-6 ">
            <h3 className="text-white font-normal text-1xl opacity-40">
              {' '}
              {game?.released?.slice(0, 4)}
            </h3>
            <h1
              style={{ lineBreak: 'anywhere' }}
              className="pb-2 font-semibold text-6xl overflow-hidden hover:text-gray-500 text-white whitespace-normal"
            >
              {game.name}
            </h1>

            <div>
              <div className="flex flex-row flex-no-wrap pt-2">
                <h2
                  id="game_page_detail"
                  className="text-white font-normal text-1xl opacity-70"
                >
                  Genres:
                </h2>
                {game.genres.map((genre: ElementDescription, index: number) => (
                  <h2
                    key={index}
                    id="game_page_detail"
                    className="pl-1 text-white font-semibold text-1xl"
                  >
                    {genre.name}
                    {index !== game.genres.length - 1 ? ',' : ''}
                  </h2>
                ))}
              </div>
              <div
                className="flex flex-wrap w-42 pt-2"
                style={{ width: '70%' }}
                id="platforms_row"
              >
                <h2
                  id="game_page_detail"
                  className="text-white font-normal text-1xl opacity-70"
                >
                  Platforms:
                </h2>
                {game.platforms.map((platform: Platform, index: number) => (
                  <h2
                    key={index}
                    id="game_page_detail"
                    className="pl-1 text-white font-semibold text-1xl whitespace-nowrap"
                  >
                    {platform.platform.name}
                    {index !== game.platforms.length - 1 ? ',' : ''}
                  </h2>
                ))}
              </div>
              <Tags tags={game.tags} />
            </div>
          </div>
          <div
            className="bg-cover rounded-xl bg-center bg-no-repeat"
            style={{
              height: '19rem',
              minWidth: '23rem',
              backgroundImage: `url(${game.background_image})`,
            }}
          />
        </div>
        {game.short_screenshots.length <= 2 ? (
          <div
            className="flex flex-nowrap justify-between "
            style={{ marginTop: '5rem', width: '50%' }}
          >
            {game.short_screenshots.map((s: Short_Screenshot) => (
              <Image
                key={s.id}
                src={s.image}
                height={160}
                width={210}
                style={{
                  borderRadius: 15,
                  marginRight: 150,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-nowrap justify-between "
            style={{ margin: '0 auto', marginTop: '5rem', width: '90%' }}
          >
            {game.short_screenshots.slice(0, 3).map((s: Short_Screenshot) => (
              <Image
                key={s.id}
                src={s.image}
                height={160}
                width={250}
                style={{
                  borderRadius: 15,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
