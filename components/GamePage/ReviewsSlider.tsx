import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import Review from './Review'
import { Review_Type } from '../../types/schema'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'

interface Props {
  reviews: Review_Type[]
  isAnimated: boolean
  deleteReview: (reviewId: ObjectId | undefined) => void
}

export default function ReviewsSlider(props: Props) {
  const [width] = useWindowSize()
  const [reviews, setReviews] = useState<Review_Type[]>([])

  useEffect(() => {
    //added
    if (props.reviews.length > reviews.length) {
      setReviews(reviews.splice(0, reviews.length))
      setReviews(props.reviews)
    } else {
      setReviews(props.reviews)
    }
  }, [props.reviews])

  const settings = {
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: reviews.length
      ? reviews.length >= 3
        ? 3
        : reviews.length
      : 3,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: reviews.length
            ? reviews.length >= 2
              ? 2
              : reviews.length
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

  if (!reviews.length) return null

  return (
    <Slider
      {...settings}
      className={`${
        props.isAnimated
          ? 'reviews_animation_enable'
          : 'reviews_animation_disable'
      }`}
    >
      {reviews.map((review: Review_Type, index: number) => (
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
          deleteReview={(id) => props.deleteReview(id)}
        />
      ))}
    </Slider>
  )
}
