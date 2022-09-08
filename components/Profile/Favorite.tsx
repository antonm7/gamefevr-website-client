import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import slicedParagrap from '../../lib/functions/slicedParagraph'
import { useGlobalError } from '../../store'
import { Favorite_Type } from '../../types/schema'

interface Props extends Favorite_Type {
  deleteFavorite?: (id: ObjectId | undefined) => void
  visited?: boolean
}

export default function Favorite(props: Props) {
  const state = useGlobalError((state) => state)
  //creating the alert
  const deleteFavorite = () => {
    if (!props._id) return
    state.setAnswer(undefined)
    state.setType('request')
    state.setText('Remove from favorite?')
    state.setIsVisible(true)
    state.setId(props._id)
  }

  const deleteFavoriteMethod = async () => {
    if (props.deleteFavorite) {
      state.closeRequest()
      try {
        const req = await axios.post(
          '/api/game/cancel/favorite/deleteFavorite',
          {
            userId: props.userId,
            gameId: props.gameId,
            favoriteId: props._id,
          }
        )
        if (req.status === 200) {
          props.deleteFavorite(props._id)
        } else {
          throw new Error('Unexpected Error')
        }
      } catch (e) {
        state.setType('error')
        state.setText('error removing the favorite, try again')
        state.setIsVisible(true)
      }
    }
  }
  //catches the globalRequest user answer after he presses.
  useEffect(() => {
    if (state.type === 'request' && state.answer === 'yes') {
      deleteFavoriteMethod()
    } else {
      state.closeRequest()
    }
  }, [state.answer])

  if (props.visited) {
    return (
      <div
        id="favorite-component"
        className="relative w-80 h-56 rounded-lg bg-white"
      >
        <div id="favorite-image">
          <Image
            quality="1"
            loading="eager"
            objectPosition={'center center'}
            className="z-0"
            src={props.game_image}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Link href={`/game/${props.gameId}`} className="cursor-pointer">
          <h1
            id="favorite-title"
            style={{ lineBreak: 'anywhere' }}
            className="font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 px-6 py-3"
          >
            {slicedParagrap(props.game_name, 25, 25)}
          </h1>
        </Link>
      </div>
    )
  } else {
    return (
      <div
        id="favorite-component"
        className="relative w-80 h-56 rounded-lg bg-white overflow-hidden"
      >
        <FontAwesomeIcon
          className="h-4 absolute z-10 cursor-pointer"
          icon={faBookmark}
          style={{ color: '#38b6cc', right: 20, top: 15 }}
          onClick={() => deleteFavorite()}
        />
        <div id="favorite-image">
          <Image
            quality="1"
            loading="eager"
            objectPosition={'center center'}
            className="z-0"
            src={props.game_image}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Link href={`/game/${props.gameId}`} className="cursor-pointer">
          <h1
            id="favorite-title"
            style={{ lineBreak: 'anywhere' }}
            className="font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 px-6 py-4 leading-5"
          >
            {slicedParagrap(props.game_name, 25, 25)}
          </h1>
        </Link>
      </div>
    )
  }
}
