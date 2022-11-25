import {
  faThumbsDown as faThumbsDownRegular,
  faThumbsUp as faThumbsUpRegular,
} from '@fortawesome/free-regular-svg-icons'
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import slicedParagrap from '../../lib/functions/slicedParagraph'
import { useGlobalError } from '../../store'
import { Review_Type } from '../../types/schema'

interface Props extends Review_Type {
  deleteReviewProps: (reviewId: ObjectId | undefined) => void
}

export default function Review({
  userId,
  gameId,
  likes,
  dislikes,
  _id,
  text,
  user_name,
  deleteReviewProps,
  rank,
}: Props) {
  const session = useSession()
  const [like, setLike] = useState<boolean>(false)
  const [dislike, setDislike] = useState<boolean>(false)
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false)
  const [isUserDisliked, setIsUserDisliked] = useState<boolean>(false)
  const [likesState, setLikesState] = useState<ObjectId[]>([])
  const [dislikesState, setDislikesState] = useState<ObjectId[]>([])
  const globalErrorState = useGlobalError((state) => state)

  const state = useGlobalError((state) => state)

  const [width] = useWindowSize()

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (likes.includes(session.data?.user?.userId)) {
        setIsUserLiked(true)
      }
      if (dislikes.includes(session.data?.user?.userId)) {
        setIsUserDisliked(true)
      }
      setLikesState(likes)
      setDislikesState(dislikes)
    }
    return
  }, [session.status, likes, dislikes])

  const deleteReview_STATE = (): void => {
    if (!_id) return
    state.setAnswer(undefined)
    state.setType('request')
    state.setText('Remove the review?')
    state.setIsVisible(true)
    state.setId(_id)
  }

  const deleteReviewMethod = async () => {
    try {
      const deleteReviewRequest = await axios.post(
        '/api/game/cancel/review/deleteReview',
        {
          userId,
          gameId,
          reviewId: _id,
        }
      )
      const cancelRankRequest = await axios.post(
        '/api/game/cancel/cancelRank',
        {
          userId,
          gameId,
          rankId: _id,
        }
      )
      if (deleteReviewRequest.status !== 200) {
        throw new Error(deleteReviewRequest.data.error)
      }
      if (cancelRankRequest.status !== 200) {
        throw new Error(deleteReviewRequest.data.error)
      }
      state.closeRequest()
      deleteReviewProps(_id)
    } catch (e) {
      globalErrorState.setType('error')
      globalErrorState.setText('oops, error deleting review, try again')
      globalErrorState.setIsVisible(true)
    }
  }

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

  const likeReview = async () => {
    if (session.status !== 'authenticated') return
    try {
      //if user already liked that means he want to cancel his like
      if (isUserLiked) {
        setLikesState(
          likes.filter((like) => like !== session.data?.user?.userId)
        )
        setIsUserLiked(false)
        //sending request to cancel the like
        const req = await axios.post('/api/game/cancel/review/like', {
          userId: session?.data?.user?.userId,
          reviewId: _id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      } else {
        //if user already disliked and now he want to like
        if (isUserDisliked) {
          setIsUserDisliked(false)
          //removing his dislike from the array
          setDislikesState(
            dislikesState.filter((id) => id !== session.data?.user?.userId)
          )
          //request to cancel the dislike
          const req = await axios.post('/api/game/cancel/review/dislike', {
            userId: session?.data?.user?.userId,
            reviewId: _id,
          })
          if (req.status !== 200) throw new Error(req.data.error)
        }
        setIsUserLiked(true)
        setLikesState([...likesState, session?.data?.user?.userId])
        const req = await axios.post('/api/game/action/review/like', {
          userId: session?.data?.user?.userId,
          reviewId: _id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      }
    } catch (e) {
      globalErrorState.setType('error')
      globalErrorState.setText('error liking the review, try again')
      globalErrorState.setIsVisible(true)
    }
  }

  const dislikeReview = async () => {
    try {
      if (session.status !== 'authenticated') return
      //if user already disliked that means he want to cancel his dislike
      if (isUserDisliked) {
        setDislikesState(
          likes.filter((like) => like !== session.data?.user?.userId)
        )
        setIsUserDisliked(false)
        //sending request to cancel the dislike
        const req = await axios.post('/api/game/cancel/review/dislike', {
          userId: session?.data?.user?.userId,
          reviewId: _id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      } else {
        //if user already liked and now he want to dislike
        if (isUserLiked) {
          setIsUserLiked(false)
          //removing his like from the array
          setLikesState((arr) =>
            arr.filter((id) => {
              return id !== session.data?.user?.userId
            })
          )
          //request to cancel the dislike
          const req = await axios.post('/api/game/cancel/review/like', {
            userId: session?.data?.user?.userId,
            reviewId: _id,
          })
          if (req.status !== 200) throw new Error(req.data.error)
        }
        setDislikesState([...dislikesState, session?.data?.user?.userId])
        setIsUserDisliked(true)
        const req = await axios.post('/api/game/action/review/dislike', {
          userId: session?.data?.user?.userId,
          reviewId: _id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      }
    } catch (e) {
      setDislikesState([...dislikesState])
      setIsUserDisliked(false)
      globalErrorState.setType('error')
      globalErrorState.setText('error disliking the review, try again')
      globalErrorState.setIsVisible(true)
    }
  }

  const CalculateCount = () => {
    if (likesState.length - dislikesState.length > 0) {
      return (
        <p
          className="mx-3 text-xl font-extrabold opacity-50"
          style={{ color: ' #8AFFAA' }}
        >
          +{likesState.length - dislikesState.length}
        </p>
      )
    } else if (likesState.length - dislikesState.length < 0) {
      return (
        <p
          className="mx-3 text-xl font-extrabold opacity-50"
          style={{ color: '#d63044' }}
        >
          {likesState.length - dislikesState.length}
        </p>
      )
    } else {
      return (
        <p
          className="mx-3 text-xl font-extrabold opacity-50"
          style={{ color: '#494949' }}
        >
          0
        </p>
      )
    }
  }

  const CalculateCountMemoized = useMemo(
    () => <CalculateCount />,
    [likesState, dislikesState]
  )

  return (
    <div
      id="review"
      className="scrollbar px-7 py-4 rounded-xl relative mx-2"
      style={{
        width: '32rem',
        minWidth: '32rem',
        height: '30rem',
        minHeight: '30rem',
        backgroundColor: 'rgba(21,21,21,0.6)',
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-white font-bold text-3xl  underline">{rank}</h1>
        {JSON.stringify(userId) !==
          JSON.stringify(session.data?.user.userId) ? null : (
          <FontAwesomeIcon
            onClick={() => deleteReview_STATE()}
            icon={faTrash}
            className="h-4 cursor-pointer text-red-500 opacity-40 hover:opacity-100"
          />
        )}
      </div>
      <p
        className="w-full text-white font-base pt-2"
        style={{ minHeight: '60%', overflowWrap: 'break-word' }}
      >
        {text}
      </p>
      <div
        id="review_bottom_container"
        className="flex flex-grow  items-center justify-between mt-20 "
      >
        <div id="review_bottom_container_names">
          <p className="text-cool-blue font-semibold">{slicedParagrap(user_name, width < 560 ? 12 : 36, 12)}</p>
          <p className="text-white opacity-50">19 Aug, 2022</p>
        </div>
        {JSON.stringify(userId) ===
          JSON.stringify(session.data?.user.userId) ? (
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faThumbsUpRegular}
              className="h-8 text-green-400 cursor-pointer"
            />
            {CalculateCountMemoized}
            <FontAwesomeIcon
              icon={faThumbsDownRegular}
              className="h-8 text-red-400 cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <FontAwesomeIcon
              onClick={() => likeReview()}
              onMouseEnter={() => setLike(true)}
              onMouseLeave={() => setLike(false)}
              icon={like || isUserLiked ? faThumbsUpSolid : faThumbsUpRegular}
              className="h-8 text-green-400 cursor-pointer"
            />
            {CalculateCountMemoized}
            <FontAwesomeIcon
              onClick={() => dislikeReview()}
              onMouseEnter={() => setDislike(true)}
              onMouseLeave={() => setDislike(false)}
              icon={
                dislike || isUserDisliked
                  ? faThumbsDownSolid
                  : faThumbsDownRegular
              }
              className="h-8 text-red-400 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  )
}
