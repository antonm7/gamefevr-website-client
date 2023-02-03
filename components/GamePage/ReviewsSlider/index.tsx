import Slider from 'react-slick'
import Review from '../Review'
import { Review_Type } from '../../../types/schema'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  reviews: Review_Type[]
  isAnimated: boolean
  deleteReview: (reviewId: ObjectId | undefined) => void
  isUserCommented: boolean
}

export default function ReviewsSlider({
  reviews,
  isAnimated,
  deleteReview,
  isUserCommented,
}: Props) {

  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])

  useEffect(() => {
    setReviewsState(reviews)
  }, [reviews])

  const settings = {
    infinite: false,
    slidesToScroll: 1,
    arrows: false,
    accessibility: false,
    slidesToShow: reviewsState.length
      ? reviewsState.length >= 3
        ? 3
        : reviewsState.length
      : 3,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: reviewsState.length
            ? reviewsState.length >= 2
              ? 2
              : reviewsState.length
            : 2,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const clearState = () => {
    if (reviews.length > reviewsState.length) {
      setReviewsState([])
    }
  }

  if (!reviewsState.length) return (
    <div className='flex items-center justify-center '>
      <FontAwesomeIcon
        icon={faPlus}
        className="h-16 text-white cursor-pointer simple-transition opacity-40 hover:opacity-100"
        onClick={() => null}
      />
    </div>
  )


  return (

    <Slider
      onReInit={() => clearState()}
      {...settings}
      arrows={false}
    >
      {reviewsState.map((review: Review_Type, index: number) => (
        <Review
          key={index}
          _id={review._id}
          likes={review.likes}
          dislikes={review.dislikes}
          gameId={review.gameId}
          userId={review.userId}
          created_at={review.created_at}
          text={review.text}
          rank={review.rank}
          game_name={''}
          game_image={''}
          deleteReviewProps={(id: ObjectId | undefined) => deleteReview(id)}
          user_name={review.user_name}
        />
      ))}
    </Slider>
  )
}
