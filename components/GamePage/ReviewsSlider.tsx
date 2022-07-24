import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import Review from './Review'
import { Review_Type } from '../../types/schema'
import { ObjectId } from 'bson'

interface Props {
  reviews: Review_Type[]
  isAnimated: boolean
  deleteReview: (reviewId: ObjectId | undefined) => void
}

export default function ReviewsSlider(props: Props) {
  const [width] = useWindowSize()

  const settings = {
    infinite: false,
    // slidesToShow:
    slidesToScroll: 1,
    slidesToShow: props.reviews.length >= 3 ? 3 : props.reviews.length,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: props.reviews.length >= 2 ? 2 : props.reviews.length,
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

  return (
    <Slider
      {...settings}
      className={`${props.isAnimated
          ? 'reviews_animation_enable'
          : 'reviews_animation_disable'
        }`}
    >
      {props.reviews.map((review: Review_Type, index: number) => (
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
