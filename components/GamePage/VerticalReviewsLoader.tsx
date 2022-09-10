import { ObjectId } from 'bson'
import { Review_Type } from '../../types/schema'
import Review from './Review'

interface Props {
  reviews: Review_Type[]
  deleteReview: (reviewId: ObjectId | undefined) => void
}

export default function VerticalReviewsLoader({
  reviews,
  deleteReview,
}: Props) {
  return (
    <>
      {reviews.map((review: Review_Type, index: number) => (
        <div className="my-4" key={index}>
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
            game_name={review.game_name}
            game_image={review.game_image}
            deleteReviewProps={(id) => deleteReview(id)}
            user_name={review.user_name}
          />
        </div>
      ))}
    </>
  )
}
