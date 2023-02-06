import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { promiseHandler, wretchAction } from '../../../lib/functions/fetchLogic'
import { Review_Type } from '../../../types/schema'

interface Props {
  onClose: () => void
  insertNewReview: (review: Review_Type) => void
  isUserRated: string | null
  visible: boolean
}

export default function WriteReview({
  onClose,
  insertNewReview,
  isUserRated,
  visible,
}: Props) {
  const [text, setText] = useState<string>('')
  const [rank, setRank] = useState<string | null>(null)
  const session = useSession()
  const router = useRouter()

  const writeReviewAction = async (): Promise<void> => {
    try {
      //if user already rated the game, and if the raview
      // ranking is different then needs to cancel the ranking
      if (isUserRated && rank !== isUserRated) {
        await wretchAction('/api/game/cancel/cancelRank', {
          userId: session.data?.user?.userId,
          gameId: router.query.id
        })
      }

      const writeReviewRequest = async () => await wretchAction(
        '/api/game/action/review/writeReview',
        {
          userId: session.data?.user?.userId,
          gameId: router.query.id,
          text,
          rank
        }
      )
      const rankGameAction = () => wretchAction('/api/game/action/rankGame', {
        userId: session.data?.user?.userId,
        gameId: router.query.id,
        value: rank
      })

      const result = await Promise.allSettled([writeReviewRequest(), rankGameAction()])
      const [writeReviewResponse]: any = promiseHandler(result)
      PubSub.publish('OPEN_ALERT', {
        type: 'success',
        msg: `Successfully created your review!`
      })
      setText('')
      setRank(null)
      onClose()
      insertNewReview(writeReviewResponse.review)
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: `error posting the review, try again`
      })
    }
  }

  useEffect(() => {
    if (isUserRated) {
      setRank(isUserRated)
    }
  }, [isUserRated])

  const setTextMethod = (eventText: string): void => {
    if (eventText.length > 760) return
    setText(eventText)
  }

  const toggleRank = (value: string): void => {
    if (rank === value) {
      setRank(null)
    } else {
      setRank(value)
    }
  }

  return (
    <div
      className={`scrollbar ${visible ? 'fixed ' : 'hidden'
        } px-7 py-6 rounded-xl w-3/5 z-30 h-3/4`}
      style={{
        height: '30rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(21,21,21)',
      }}
    >
      <FontAwesomeIcon
        onClick={onClose}
        icon={faXmark}
        className="h-6 absolute white text-white right-6 cursor-pointer"
      />
      <div className="flex flex-wrap my-2">
        <div
          onClick={() => toggleRank('waste_of_time')}
          className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'waste_of_time' ? 'bg-white' : ''
            }`}
          style={{ border: 'solid #e3e3e3', borderWidth: 1 }}
        >
          <span className="pr-2 text-md">😫</span>
          <h2
            className={`simple-transition text-white text-sm hover:text-black ${rank === 'waste_of_time' ? 'text-black' : ''
              }`}
          >
            Waste Of Time
          </h2>
        </div>
        <div
          onClick={() => toggleRank('nuh')}
          className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'nuh' ? 'bg-white' : ''
            }`}
          style={{ border: 'solid #e3e3e3', borderWidth: 1 }}
        >
          <span className="pr-2 text-md">😫</span>
          <h2
            className={`simple-transition text-white text-sm hover:text-black ${rank === 'nuh' ? 'text-black' : ''
              }`}
          >
            Nuh
          </h2>
        </div>
        <div
          onClick={() => toggleRank('good')}
          className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'good' ? 'bg-white' : ''
            }`}
          style={{ border: 'solid #e3e3e3', borderWidth: 1 }}
        >
          <span className="pr-2 text-md">😫</span>
          <h2
            className={`simple-transition text-white text-sm hover:text-black ${rank === 'good' ? 'text-black' : ''
              }`}
          >
            Good
          </h2>
        </div>
        <div
          onClick={() => toggleRank('must')}
          className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'must' ? 'bg-white' : ''
            }`}
          style={{ border: 'solid #e3e3e3', borderWidth: 1 }}
        >
          <span className="pr-2 text-md">😫</span>
          <h2
            className={`simple-transition text-white text-sm hover:text-black ${rank === 'must' ? 'text-black' : ''
              }`}
          >
            Must
          </h2>
        </div>
      </div>
      <TextareaAutosize
        className="textarea w-full"
        placeholder="Write Your Review"
        value={text}
        onChange={(e) => setTextMethod(e.target.value)}
      />
      <p className="text-xs opacity-40" style={{ color: '#9da8b6' }}>
        {text.length} / 760
      </p>
      <div
        id="write_review_footer"
        className="h-16 flex justify-between items-center"
        style={{ minHeight: '7rem' }}
      >
        <ul id="writeReviewUi" className="list-disc list-inside h-full">
          <li
            className="text-white text-sm font-medium "
            style={{ color: '#9da8b6', opacity: rank ? 1 : 0.4 }}
          >
            You need to choose a rank for the game
          </li>
          <li
            className="text-white text-sm font-medium opacity-40"
            style={{ color: '#9da8b6', opacity: text.length >= 60 ? 1 : 0.4 }}
          >
            At least 60 charecters
          </li>
        </ul>
        <div className="h-full flex items-end" id="writeReview-button-helper">
          <button
            disabled={!rank || text.length < 60 ? true : false}
            className="disabled:opacity-40 w-32 h-12 bg-specialYellow rounded-lg text-white text-lg font-normal"
            onClick={() => writeReviewAction()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
