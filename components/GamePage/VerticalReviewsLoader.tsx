import { Review_Type } from "../../types/schema"
import Review from "./Review"
export default function VerticalReviewsLoader(props:any) {
    return (
            <>
                {props.reviews.map((review:Review_Type,index:number) => (
                    <div className="my-4" key={index}>
                        <Review key={index} gameId={review.gameId} userId={review.gameId} created_at={review.created_at} text={review.text} rank={review.rank}/>
                    </div>
                ))}
            </>
    )
}
