import { ObjectId } from 'bson'
import { useEffect } from 'react'
import { Review_Type } from '../../types/schema'
import Review from './Review'

export default function VerticalReviewsLoader(props: {
  reviews: Review_Type[]
  deleteReview: (reviewId: ObjectId | undefined) => void
}) {
  return (
    <>
      {props.reviews.map((review: Review_Type, index: number) => (
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
            deleteReview={(id) => props.deleteReview(id)}
          />
        </div>
      ))}
    </>
  )
}
