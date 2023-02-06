import { faBookmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'bson'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { wretchAction } from '../../../lib/functions/fetchLogic'
import useWindowSize from '../../../lib/functions/hooks/useWindowSize'
import slicedParagrap from '../../../lib/functions/slicedParagraph'
import { OPEN_ALERT_TYPE } from '../../../types'
import { Favorite_Type } from '../../../types/schema'

interface Props extends Favorite_Type {
  deleteFavorite?: (id: ObjectId | undefined) => void
  visited?: boolean
}

export default function Favorite({
  deleteFavorite,
  userId,
  gameId,
  game_image,
  game_name,
  visited,
  _id,
}: Props) {
  const [width] = useWindowSize()
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  //creating the alert
  const what_is_the_answer = (data: string, msg: 'no' | 'yes') => {
    if (msg === 'yes') {
      deleteFavoriteMethod()
    }
    PubSub.publish('CLOSE_ALERT')
  }

  const deleteFavorite_STATE = (): void => {
    const data: OPEN_ALERT_TYPE = {
      type: 'request',
      msg: 'Remove from favorites?',
      requestOwner: 'PROFILE_FAVORITE_OWNER'
    }
    PubSub.subscribe('PROFILE_FAVORITE_OWNER', what_is_the_answer)
    PubSub.publish('OPEN_ALERT', data)
  }


  const deleteFavoriteMethod = async (): Promise<void> => {
    if (deleteFavorite) {
      try {
        await wretchAction(
          '/api/game/cancel/favorite/deleteFavorite',
          {
            userId,
            gameId,
            favoriteId: _id,
          }
        )
        deleteFavorite(_id)
      } catch (e) {
        PubSub.publish('OPEN_ALERT', {
          type: 'error',
          msg: 'error removing the favorite, try again'
        })
      }
    }
  }

  if (visited) {
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
            src={game_image}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Link href={`/game/${gameId}`}>
          <h1
            id="favorite-title"
            style={{ lineBreak: 'anywhere' }}
            className="inline-block font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 mx-6 my-3 cursor-pointer"
          >
            {slicedParagrap(
              game_name,
              width >= 800 ? 25 : width <= 640 ? 40 : 11,
              width >= 800 ? 25 : width <= 640 ? 40 : 11
            )}
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
        {!mouseOver ? (
          <FontAwesomeIcon
            onMouseOver={() => setMouseOver(true)}
            className="h-4 absolute z-10 cursor-pointer"
            icon={faBookmark}
            style={{ color: '#38b6cc', right: 20, top: 15 }}
          // onClick={() => deleteFavorite_STATE()}
          />
        ) : (
          <FontAwesomeIcon
            onMouseLeave={() => setMouseOver(false)}
            className="h-4 absolute z-10 cursor-pointer"
            icon={faTrash}
            style={{ color: '#38b6cc', right: 20, top: 15 }}
            onClick={() => deleteFavorite_STATE()}
          />
        )}

        <div id="favorite-image">
          <Image
            quality="1"
            loading="eager"
            objectPosition={'center center'}
            className="z-0"
            src={game_image}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Link href={`/game/${gameId}`}>
          <h1
            id="favorite-title"
            style={{ lineBreak: 'anywhere' }}
            className="inline-block font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 mx-6 my-4 leading-5 cursor-pointer"
          >
            {slicedParagrap(
              game_name,
              width >= 800 ? 25 : width <= 640 ? 40 : 11,
              width >= 800 ? 25 : width <= 640 ? 40 : 11
            )}
          </h1>
        </Link>
      </div>
    )
  }
}
