import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import Link from 'next/link'
import slicedParagrap from '../../lib/functions/slicedParagraph'
import { Review_Type } from '../../types/schema'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import { useGlobalError } from '../../store'
import { useEffect } from 'react'

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
  const state = useGlobalError((state) => state)
  //creating the alert
  const deleteReview_STATE = (): void => {
    if (!_id) return
    state.setAnswer(undefined)
    state.setType('request')
    state.setText('Remove the review?')
    state.setIsVisible(true)
    state.setId(_id)
  }

  const deleteReviewMethod = async (): Promise<void> => {
    if (deleteReview) {
      try {
        state.closeRequest()
        const req = await axios.post('/api/game/cancel/review/deleteReview', {
          userId: userId,
          gameId: gameId,
          reviewId: _id,
        })
        if (req.status === 200) {
          deleteReview(_id)
        }
      } catch (e) {
        state.setType('error')
        state.setText('error removing the review, try again')
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
      deleteReviewMethod()
    } else {
      state.closeRequest()
    }
  }, [state.answer])

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
                ? slicedParagrap(game_name, 22, 22)
                : width < 600
                ? slicedParagrap(game_name, 22, 22)
                : game_name}
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
                ? slicedParagrap(game_name, 22, 22)
                : width < 600
                ? slicedParagrap(game_name, 22, 22)
                : game_name}
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
          {width > 1200
            ? slicedParagrap(text, 190, 190)
            : width < 360
            ? slicedParagrap(text, 40, 40)
            : width < 600
            ? slicedParagrap(text, 100, 100)
            : width < 900
            ? slicedParagrap(text, 260, 260)
            : slicedParagrap(text, 450, 450)}
        </p>
        <p className="text-base text-white opacity-60 whitespace-nowrap">
          Sep 12,2022
        </p>
      </div>
    )
  }
}
