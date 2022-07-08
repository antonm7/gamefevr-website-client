import Image from 'next/image'
import { Favorite_Type } from '../../types/schema'

export default function Favorite(props:Favorite_Type) {
    return (
       <div className='w-80 h-56 rounded-lg bg-white'>
            <div id="favorite-image">
                <Image quality="1" loading="eager" objectPosition={'center center'} className="z-0" src={props.game_image} layout="fill" objectFit="cover" />
            </div>
            <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 px-6 py-3">{props.game_name}</h1>
       </div>
    )
}