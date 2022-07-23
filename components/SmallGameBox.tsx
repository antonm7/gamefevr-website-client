import Link from "next/link";
import Image from "next/image";
import { ElementDescription, ShortGame } from "../types";

type Props = {
  game: ShortGame;
  key: number;
};

interface PlatformParentObject {
  platform: ElementDescription;
}

export default function SmallGameBox(props: Props) {
  const game = props.game;
  if (!game) return null;

  return (
    <div
      className="w-96 h-72 bg-white rounded-lg mx-8 mb-12 overflow-hidden"
      style={{ height: "1%" }}
    >
      <div className="bg-image">
        {!game.background_image ? null : (
          <Image
            quality="1"
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
            style={{ lineBreak: "anywhere" }}
            className="font-semibold text-xl whitespace-pre-wrap hover:text-gray-500"
          >
            {game.name}
          </h1>
        </Link>
        {/* TODO:Switch platform text to platform icons */}
        <div className="flex flex-row flex-nowrap">
          {game?.parent_platforms
            ?.slice(0, 3)
            .map((platform: PlatformParentObject, index: number) => (
              <h2 key={index} className="pr-1 text-sm text-cool-blue">
                {platform.platform.name}
                {index === game.parent_platforms.length - 1 || index === 2
                  ? ""
                  : ","}
              </h2>
            ))}
        </div>
        <div className="flex flex-row justify-between pt-6">
          <div className="flex flex-row flex-nowrap">
            {game.genres
              .slice(0, 3)
              .map((genre: ElementDescription, index: number) => (
                <h2
                  key={index}
                  className="pr-1 text-sm"
                  style={{ color: "#919191" }}
                >
                  {genre.name}
                  {index === game.genres.length - 1 || index === 2 ? "" : ","}
                </h2>
              ))}
          </div>
          <h2 className="pr-1 text-sm" style={{ color: "#919191" }}>
            {game.released.slice(0, 4)}
          </h2>
        </div>
      </div>
    </div>
  );
}
