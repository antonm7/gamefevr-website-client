import Link from "next/link"
import Image from 'next/image'
import { ElementDescription, ShortGame } from "../types"
type Props = {
    game:ShortGame;
    key:number
}

export default function SmallGameBox(props:Props) {
    const game = props.game
    return (
        <div className="w-80 h-72 bg-white rounded-lg mx-8 my-4 overflow-hidden" style={{height:'1%'}}>
            <div  className="bg-image" >
                <Image quality="1" loading="eager" className="z-0" src={game.background_image} layout="fill" objectFit="cover" />
            </div>
            <div className="flex-grow p-4">
                <a href={`/game/${props.game.id}`}>
                    <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-xl whitespace-pre-wrap hover:text-gray-500">{game.name}</h1>
                </a>
                <div className="flex flex-row justify-between pt-6">
                    <div className="flex flex-row flex-nowrap">{game.genres.slice(0, 3).map((genre:ElementDescription,index:number) => <h2 key={index} className={'pr-1'}>{genre.name}{index === game.genres.length - 1 || index === 2 ? '' : ','}</h2>)}</div>
                    <h2>{game.released.slice(0,4)}</h2>
                </div>
            </div>
        </div>
    )
}