import { Review_Type } from "../../types/schema"
import Review from "./Review"

export default function VerticalReviewsLoader(props:{reviews:Review_Type[]}) {
    return (
            <>
                {props.reviews.map((review:Review_Type,index:number) => (
                    <div className="my-4" key={index}>
                        <Review key={index} _id={review._id} likes={review.likes} dislikes={review.dislikes} gameId={review.gameId} userId={review.gameId} created_at={review.created_at} text={review.text} rank={review.rank} game_name={review.game_name} game_image={review.game_image}/>
                    </div>
                ))}
            </>
    )
}
