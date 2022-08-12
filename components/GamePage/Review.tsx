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
import { useEffect, useState } from 'react'
import { Review_Type } from '../../types/schema'

interface Props extends Review_Type {
  deleteReview: (reviewId: ObjectId | undefined) => void
}

export default function Review(props: Props) {
  const session = useSession()
  const [like, setLike] = useState<boolean>(false)
  const [dislike, setDislike] = useState<boolean>(false)
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false)
  const [isUserDisliked, setIsUserDisliked] = useState<boolean>(false)
  const [likes, setLikes] = useState<ObjectId[]>([])
  const [dislikes, setDislikes] = useState<ObjectId[]>([])

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (props.likes.includes(session.data?.user?.userId)) {
        setIsUserLiked(true)
      }
      if (props.dislikes.includes(session.data?.user?.userId)) {
        setIsUserDisliked(true)
      }
      setLikes(props.likes)
      setDislikes(props.dislikes)
    }
  }, [])

  const deleteReview = async () => {
    try {
      const deleteReviewRequest = await axios.post(
        '/api/game/cancel/review/deleteReview',
        {
          userId: props.userId,
          gameId: props.gameId,
          reviewId: props._id,
        }
      )
      const cancelRankRequest = await axios.post(
        '/api/game/cancel/cancelRank',
        {
          userId: props.userId,
          gameId: props.gameId,
          rankId: props._id,
        }
      )
      if (deleteReviewRequest.status !== 200) {
        throw new Error(deleteReviewRequest.data.error)
      }
      if (cancelRankRequest.status !== 200) {
        throw new Error(deleteReviewRequest.data.error)
      }
      props.deleteReview(props._id)
    } catch (e) {
      console.log('error', e)
    }
  }

  const likeReview = async () => {
    if (session.status !== 'authenticated') return
    try {
      //if user already liked that means he want to cancel his like
      if (isUserLiked) {
        setLikes(likes.filter((like) => like !== session.data?.user?.userId))
        setIsUserLiked(false)
        //sending request to cancel the like
        const req = await axios.post('/api/game/cancel/review/like', {
          userId: session?.data?.user?.userId,
          reviewId: props._id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      } else {
        //if user already disliked and now he want to like
        if (isUserDisliked) {
          setIsUserDisliked(false)
          //removing his dislike from the array
          setDislikes(
            dislikes.filter((id) => id !== session.data?.user?.userId)
          )
          //request to cancel the dislike
          const req = await axios.post('/api/game/cancel/review/dislike', {
            userId: session?.data?.user?.userId,
            reviewId: props._id,
          })
          if (req.status !== 200) throw new Error(req.data.error)
        }
        setIsUserLiked(true)
        setLikes([...likes, session?.data?.user?.userId])
        const req = await axios.post('/api/game/action/review/like', {
          userId: session?.data?.user?.userId,
          reviewId: props._id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  const dislikeReview = async () => {
    try {
      if (session.status !== 'authenticated') return
      //if user already disliked that means he want to cancel his dislike
      if (isUserDisliked) {
        setDislikes(likes.filter((like) => like !== session.data?.user?.userId))
        setIsUserDisliked(false)
        //sending request to cancel the dislike
        const req = await axios.post('/api/game/cancel/review/dislike', {
          userId: session?.data?.user?.userId,
          reviewId: props._id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      } else {
        //if user already liked and now he want to dislike
        if (isUserLiked) {
          setIsUserLiked(false)
          //removing his like from the array
          setLikes(likes.filter((id) => id !== session.data?.user?.userId))
          //request to cancel the dislike
          const req = await axios.post('/api/game/cancel/review/like', {
            userId: session?.data?.user?.userId,
            reviewId: props._id,
          })
          if (req.status !== 200) throw new Error(req.data.error)
        }
        setDislikes([...dislikes, session?.data?.user?.userId])
        setIsUserDisliked(true)
        const req = await axios.post('/api/game/action/review/dislike', {
          userId: session?.data?.user?.userId,
          reviewId: props._id,
        })
        if (req.status !== 200) throw new Error(req.data.error)
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  const CalculateCount = () => {
    if (likes.length - dislikes.length > 0) {
      return (
        <p
          className="mx-3 text-xl font-extrabold opacity-50"
          style={{ color: ' #8AFFAA' }}
        >
          +{likes.length - dislikes.length}
        </p>
      )
    } else if (likes.length - dislikes.length < 0) {
      return (
        <p
          className="mx-3 text-xl font-extrabold opacity-50"
          style={{ color: '#d63044' }}
        >
          {likes.length - dislikes.length}
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

  return (
    <div
      id="review"
      className="px-7 py-6 rounded-xl relative mx-2"
      style={{
        width: '32rem',
        minWidth: '32rem',
        height: '30rem',
        minHeight: '30rem',
        backgroundColor: 'rgba(21,21,21,0.6)',
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-white font-bold text-3xl  underline">
          {props.rank}
        </h1>
        <FontAwesomeIcon
          onClick={() => deleteReview()}
          icon={faTrash}
          className="h-4 cursor-pointer text-red-500 opacity-40 hover:opacity-100"
        />
      </div>
      <p className="text-white font-base pt-2" style={{ minHeight: '60%' }}>
        {props.text}
      </p>
      <div
        id="review_bottom_container"
        className="flex flex-grow  items-center justify-between mt-20 "
      >
        <div>
          <p className="text-cool-blue font-semibold">Anton Migolko</p>
          <p className="text-white opacity-50">19 Aug, 2022</p>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon
            onClick={() => likeReview()}
            onMouseEnter={() => setLike(true)}
            onMouseLeave={() => setLike(false)}
            icon={like || isUserLiked ? faThumbsUpSolid : faThumbsUpRegular}
            className="h-8 text-green-400 cursor-pointer"
          />
          <CalculateCount />
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
      </div>
    </div>
  )
}
