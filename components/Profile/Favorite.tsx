import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import Image from 'next/image'
import { Favorite_Type } from '../../types/schema'

interface Props extends Favorite_Type {
    deleteFavorite: (id:ObjectId | undefined) => void
}

export default function Favorite(props:Props) {
    const deleteFavorite = async () => {
        try {
            const req = await axios.post('/api/game/cancel/favorite/deleteFavorite', {
                userId:props.userId,
                gameId:props.gameId,
                favoriteId:props._id
            })
            if(req.status === 200) {
                props.deleteFavorite(props._id)
            } else {
                throw new Error('Unexpected Error')
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
       <div className='relative w-80 h-56 rounded-lg bg-white'>
            <FontAwesomeIcon className="h-4 absolute z-10 cursor-pointer" icon={faBookmark} style={{color:'#38b6cc',right:20,top:15}} onClick={() => deleteFavorite()}/>
            <div id="favorite-image">
                <Image quality="1" loading="eager" objectPosition={'center center'} className="z-0" src={props.game_image} layout="fill" objectFit="cover" />
            </div>
            <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 px-6 py-3">{props.game_name}</h1>
       </div>
    )
}