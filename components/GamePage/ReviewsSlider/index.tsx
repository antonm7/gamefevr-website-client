import Slider from 'react-slick'
import Review from '../Review'
import { Review_Type } from '../../../types/schema'
import { ObjectId } from 'bson'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'

interface Props {
  reviews: Review_Type[]
  deleteReview: (reviewId: ObjectId | undefined) => void
  setRef?: any
  navigateAuth: () => void
  lower1200?: boolean
}

export default function ReviewsSlider({
  reviews,
  deleteReview,
  lower1200,
  navigateAuth,
  setRef
}: Props) {

  const settings = {
    infinite: false,
    slidesToScroll: 1,
    arrows: false,
    accessibility: false,
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

  const session = useSession()


  if (!reviews.length) return (

    <div
      ref={setRef}
      onClick={navigateAuth}
      style={{ left: '50%', transform: 'translateX(-50%)', bottom: '6.3rem' }}
      className="rounded-md flex items-center px-12 bg-[rgba(21,21,21)] absolute w-max h-16 text-white cursor-pointer opacity-40 hover:opacity-100">
      <FontAwesomeIcon
        icon={faPlus}
      />
      <span className='pl-2 text-lg'>Write A Review</span>
    </div>
  )

  return (
    <div
      ref={setRef}
      className={`h-full w-full overflow-hidden responsive_wrapper absolute top-0 ${lower1200 ? 'relative' : 'absolute'}`} >
      <Slider
        {...settings}
        arrows={false}
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
            deleteReviewProps={(id: ObjectId | undefined) => deleteReview(id)}
            user_name={review.user_name}
          />
        ))}
      </Slider>
      {!reviews.filter(r => JSON.stringify(r.userId) === JSON.stringify(session.data?.user.userId)).length ?
        <div
          onClick={navigateAuth}
          style={{ left: '50%', transform: 'translateX(-50%)', bottom: '6.3rem' }}
          className="rounded-md flex items-center px-12 bg-[rgba(21,21,21)] absolute w-max h-16 text-white cursor-pointer opacity-40 hover:opacity-100">
          <FontAwesomeIcon
            icon={faPlus}
          />
          <span className='pl-2 text-lg'>Write A Review</span>
        </div> : null
      }
    </div>
  )
}
