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

export default function Reviews(props: Props) {
  const [width] = useWindowSize()
  const state = useGlobalError((state) => state)
  //creating the alert
  const deleteReview = () => {
    state.setAnswer(undefined)
    state.setType('request')
    state.setText('Remove the review?')
    state.setIsVisible(true)
  }

  const deleteReviewMethod = async () => {
    if (props.deleteReview) {
      try {
        state.closeRequest()
        const req = await axios.post('/api/game/cancel/review/deleteReview', {
          userId: props.userId,
          gameId: props.gameId,
          reviewId: props._id,
        })
        if (req.status === 200) {
          props.deleteReview(props._id)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
  //catches the globalRequest user answer after he presses.
  useEffect(() => {
    if (state.type === 'request' && state.answer === 'yes') {
      deleteReviewMethod()
    } else {
      state.closeRequest()
    }
  }, [state.answer])

  if (props.visited) {
    return (
      <div
        id="profile-review-component"
        className="h-72 rounded-lg p-6"
        style={{ backgroundColor: '#0e3462', width: '28rem' }}
      >
        <div className="flex items-center flex-nowrap">
          <div
            className="h-8 w-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${props.game_image})` }}
          />
          <Link href={`/game/${props.gameId}`}>
            <h1 className="font-semibold text-lg cursor-pointer text-white whitespace-nowrap hover:text-gray-300 px-6 py-3">
              {width > 1200
                ? slicedParagrap(props.game_name, 22, 22)
                : width < 600
                ? slicedParagrap(props.game_name, 22, 22)
                : props.game_name}
            </h1>
          </Link>
        </div>
        <h1 className="inline font-semibold text-lg cursor-pointer text-white opacity-70 whitespace-nowrap hover:text-gray-300 py-1">
          {props.rank}
        </h1>
        <p
          className="leading-6 text-base text-white opacity-60"
          style={{
            minHeight: '8.5rem',
            height: '8.5rem',
            lineBreak: 'anywhere',
          }}
        >
          {slicedParagrap(props.text, 180, 180)}
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
            style={{ backgroundImage: `url(${props.game_image})` }}
          />
          <Link href={`/game/${props.gameId}`}>
            <h1 className="font-semibold text-lg cursor-pointer text-white whitespace-nowrap hover:text-gray-300 px-6 py-3">
              {width > 1200
                ? slicedParagrap(props.game_name, 22, 22)
                : width < 600
                ? slicedParagrap(props.game_name, 22, 22)
                : props.game_name}
            </h1>
          </Link>
          <FontAwesomeIcon
            onClick={() => deleteReview()}
            icon={faTrash}
            className="h-4 cursor-pointer text-red-500 opacity-40 hover:opacity-100"
            style={{ marginLeft: 'auto' }}
          />
        </div>
        <h1 className="inline font-semibold text-lg cursor-pointer text-white opacity-70 whitespace-nowrap hover:text-gray-300 py-1">
          {props.rank}
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
            ? slicedParagrap(props.text, 330, 330)
            : width < 600
            ? slicedParagrap(props.text, 150, 150)
            : width < 900
            ? slicedParagrap(props.text, 400, 400)
            : slicedParagrap(props.text, 600, 600)}
        </p>
        <p className="text-base text-white opacity-60 whitespace-nowrap">
          Sep 12,2022
        </p>
      </div>
    )
  }
}
