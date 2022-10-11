import { faBookmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useState } from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import slicedParagrap from '../../lib/functions/slicedParagraph'
import { useGlobalError } from '../../store'
import { Favorite_Type } from '../../types/schema'

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
  const state = useGlobalError((state) => state)
  const [width] = useWindowSize()
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  //creating the alert
  const deleteFavorite_STATE = () => {
    if (!_id) return
    state.setAnswer(undefined)
    state.setType('request')
    state.setText('Remove from favorite?')
    state.setIsVisible(true)
    state.setId(_id)
  }

  const deleteFavoriteMethod = async (): Promise<void> => {
    if (deleteFavorite) {
      state.closeRequest()
      try {
        const req = await axios.post(
          '/api/game/cancel/favorite/deleteFavorite',
          {
            userId,
            gameId,
            favoriteId: _id,
          }
        )
        if (req.status === 200) {
          deleteFavorite(_id)
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
    if (
      state.type === 'request' &&
      state.answer === 'yes' &&
      state.id === _id
    ) {
      deleteFavoriteMethod()
    } else {
      state.closeRequest()
    }
  }, [state.answer])

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
