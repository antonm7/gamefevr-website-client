import Link from "next/link"
import { Genre, ShortGame } from "../types"

type Props = {
    game:ShortGame;
    key:number
}

export default function SmallGameBox(props:Props) {
    const game = props.game
    return (
        <Link href={`/game/${props.game.id}`}>
            <div className="w-80 h-72 bg-white rounded-lg m-6 overflow-hidden" style={{height:'1%'}}>
                <div className="w-full h-4/6 bg-cover bg-center bg-no-repeat" style={{height:'14rem',backgroundImage: `url(${game.background_image})`}}>
                </div>
                <div className="flex-grow p-4">
                    <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-xl whitespace-pre-wrap">{game.name}</h1>
                    <div className="flex flex-row justify-between pt-6">
                        <div className="flex flex-row flex-nowrap">{game.genres.slice(0, 3).map((genre:Genre,index:number) => <h2 key={index} className={'pr-1'}>{genre.name}{index === game.genres.length - 1 || index === 2 ? '' : ','}</h2>)}</div>
                        <h2>{game.released.slice(0,4)}</h2>
                    </div>
                </div>
                {/* <h1>{game.background_image}</h1> */}
            </div>
        </Link>
    )
}