/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import Link from 'next/link'
import slicedParagrap from '../../../lib/functions/slicedParagraph'
import { Review_Type } from '../../../types/schema'
import useWindowSize from '../../../lib/functions/hooks/useWindowSize'
import { OPEN_ALERT_TYPE } from '../../../types'

interface Props extends Review_Type {
  deleteReview?: (id: ObjectId | undefined) => void
  visited?: boolean
}

export default function Reviews({
  deleteReview,
  visited,
  _id,
  userId,
  gameId,
  game_name,
  rank,
  text,
  game_image,
}: Props) {
  const [width] = useWindowSize()

  const what_is_the_answer = (data: string, msg: 'no' | 'yes') => {
    if (msg === 'yes') {
      deleteReviewMethod()
    }
    PubSub.publish('CLOSE_ALERT')
  }

  const deleteReview_STATE = (): void => {
    const data: OPEN_ALERT_TYPE = {
      type: 'request',
      msg: 'Remove the review?',
      requestOwner: 'PROFILE_REVIEW_OWNER'
    }
    PubSub.subscribe('PROFILE_REVIEW_OWNER', what_is_the_answer)
    PubSub.publish('OPEN_ALERT', data)
  }

  const deleteReviewMethod = async (): Promise<void> => {
    try {
      const req = await axios.post('/api/game/cancel/review/deleteReview', {
        userId: userId,
        gameId: gameId,
        reviewId: _id,
      })
      if (req.status !== 200) {
        throw new Error('error')
      }
      if (deleteReview) {
        deleteReview(_id)
      }
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: 'oops, error deleting review, try again'
      })
    }
  }

  if (visited) {
    return (
      <div
        id="profile-review-component"
        className="h-72 rounded-lg p-6"
        style={{ backgroundColor: '#0e3462', width: '28rem' }}
      >
        <div className="flex items-center flex-nowrap">
          <div
            className="h-8 w-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${game_image})` }}
          />
          <Link href={`/game/${gameId}`}>
            <h1 className="font-semibold text-lg cursor-pointer text-white whitespace-nowrap hover:text-gray-300 px-6 py-3">
              {width > 1200
                ? slicedParagrap(game_name, 22, 22) :
                width <= 800 ? game_name
                  : slicedParagrap(game_name, 22, 22)}
            </h1>
          </Link>
        </div>
        <h1 className="inline font-semibold text-lg cursor-pointer text-white opacity-70 whitespace-nowrap hover:text-gray-300 py-1">
          {rank}
        </h1>
        <p
          className="leading-6 text-base text-white opacity-60"
          style={{
            minHeight: '8.5rem',
            height: '8.5rem',
            lineBreak: 'anywhere',
          }}
        >
          {slicedParagrap(text, 180, 180)}
        </p>
        <p className="text-base text-white opacity-60 whitespace-nowrap">
          Sep 12,2022
        </p>
      </div>
    )
  } else {
    return (
      <div
        id="profile-review-component"
        className="h-72 rounded-lg p-6"
        style={{ backgroundColor: '#0e3462', width: '28rem' }}
      >
        <div className="flex items-center flex-nowrap">
          <div
            className="h-8 w-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${game_image})` }}
          />
          <Link href={`/game/${gameId}`}>
            <h1 className="font-semibold text-lg cursor-pointer text-white whitespace-nowrap hover:text-gray-300 px-6 py-3">
              {width > 1200
                ? slicedParagrap(game_name, 22, 22) :
                width <= 800 ? game_name
                  : slicedParagrap(game_name, 22, 22)}
            </h1>
          </Link>
          <FontAwesomeIcon
            onClick={() => deleteReview_STATE()}
            icon={faTrash}
            className="h-4 cursor-pointer text-red-500 opacity-40 hover:opacity-100"
            style={{ marginLeft: 'auto' }}
          />
        </div>
        <h1 className="inline font-semibold text-lg cursor-pointer text-white opacity-70 whitespace-nowrap hover:text-gray-300 py-1">
          {rank}
        </h1>
        <p
          className="leading-6 text-base text-white opacity-60"
          style={{
            minHeight: '8.5rem',
            height: '8.5rem',
            lineBreak: 'anywhere',
          }}
        >
          {width > 800 ? slicedParagrap(text, 150, 150) : slicedParagrap(text, 350, 350)}
        </p>
        <p className="text-base text-white opacity-60 whitespace-nowrap">
          Sep 12,2022
        </p>
      </div>
    )
  }
}
