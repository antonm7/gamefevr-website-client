import { ObjectId } from "bson"
import { useRef } from "react"
import Slider from "react-slick"
import useWindowSize from "../../lib/functions/hooks/useWindowSize"
import { Review_Type } from "../../types/schema"
import Review from "./Review"

interface Props {
    visited: boolean
    reviews: Review_Type[]
    deleteReview: (id: ObjectId | undefined) => void
}

export default function ReviewsSlider({ deleteReview, reviews, visited }: Props) {
    const [width] = useWindowSize()
    const reviewsRef = useRef(null)

    const reviewSettings = {
        infinite: false,
        slidesToShow: 3,
        arrows: false,
        responsive: [
            {
                breakpoint: 1700,
                settings: {
                    slidesToShow: reviews.length >= 2 ? 2 : reviews.length,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: reviews.length >= 2 ? 2 : reviews.length,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    }

    return (
        <div className="pt-16">
            <h1 className="text-white font-bold text-3xl">{visited ? 'Reviews' : 'Your Reviews'}</h1>
            <div
                className={`mt-12 ${reviews.length === 2 && width > 1200
                    ? 'w-[60rem]'
                    : 'w-full'
                    }`}
            >
                {reviews.length > 0 ? (
                    reviews.length === 2 && width >= 800 ? (
                        <div
                            className={`flex  flex-nowrap ${width < 1650 ? 'justify-between' : 'justify-between'
                                }`}
                        >
                            {reviews.map((review: Review_Type) =>
                                width < 1200 ? (
                                    <div className="w-[30rem]" key={JSON.stringify(review._id)}>
                                        <Review
                                            visited={visited}
                                            _id={review._id}
                                            userId={review.userId}
                                            created_at={review.created_at}
                                            gameId={review.gameId}
                                            game_name={review.game_name}
                                            game_image={review.game_image}
                                            deleteReview={(id) => deleteReview(id)}
                                            user_name={review.user_name}
                                            text={review.text}
                                            rank={review.rank}
                                            likes={review.likes}
                                            dislikes={review.dislikes}
                                        />
                                    </div>
                                ) : (
                                    <Review
                                        visited={visited}
                                        _id={review._id}
                                        key={JSON.stringify(review._id)}
                                        userId={review.userId}
                                        created_at={review.created_at}
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteReview={(id) => deleteReview(id)}
                                        user_name={review.user_name}
                                        text={review.text}
                                        rank={review.rank}
                                        likes={review.likes}
                                        dislikes={review.dislikes}
                                    />
                                )
                            )}
                        </div>
                    ) : reviews.length <= 3 && width > 1700 ? (
                        <div
                            className={`flex flex-nowrap ${width < 1700 ? 'justify-start' : 'justify-between'
                                }`}
                        >
                            {reviews.map((review: Review_Type) => (
                                <Review
                                    visited={visited}
                                    _id={review._id}
                                    key={JSON.stringify(review._id)}
                                    userId={review.userId}
                                    created_at={review.created_at}
                                    gameId={review.gameId}
                                    game_name={review.game_name}
                                    game_image={review.game_image}
                                    deleteReview={(id) => deleteReview(id)}
                                    user_name={review.user_name}
                                    text={review.text}
                                    rank={review.rank}
                                    likes={review.likes}
                                    dislikes={review.dislikes}
                                />
                            ))}
                        </div>
                    ) : reviews.length === 1 && width < 1200 && width > 800 ? (
                        reviews.map((review: Review_Type) => (
                            <div key={JSON.stringify(review._id)}>
                                <Review
                                    visited={visited}
                                    _id={review._id}
                                    userId={review.userId}
                                    created_at={review.created_at}
                                    gameId={review.gameId}
                                    game_name={review.game_name}
                                    game_image={review.game_image}
                                    deleteReview={(id) => deleteReview(id)}
                                    user_name={review.user_name}
                                    text={review.text}
                                    rank={review.rank}
                                    likes={review.likes}
                                    dislikes={review.dislikes}
                                />
                            </div>
                        ))
                    ) : width < 800 ? (
                        <Slider  {...reviewSettings} ref={reviewsRef}>
                            {reviews.map((review: Review_Type) => (
                                <Review
                                    visited={visited}
                                    _id={review._id}
                                    key={JSON.stringify(review._id)}
                                    userId={review.userId}
                                    created_at={review.created_at}
                                    gameId={review.gameId}
                                    game_name={review.game_name}
                                    game_image={review.game_image}
                                    deleteReview={(id) => deleteReview(id)}
                                    user_name={review.user_name}
                                    text={review.text}
                                    rank={review.rank}
                                    likes={review.likes}
                                    dislikes={review.dislikes}
                                />
                            ))}
                        </Slider>
                    ) : (
                        <Slider {...reviewSettings} ref={reviewsRef}>
                            {reviews.map((review: Review_Type) => (
                                <div key={JSON.stringify(review._id)}
                                    style={{ width: '32rem !important' }}>
                                    <Review
                                        visited={visited}
                                        _id={review._id}
                                        userId={review.userId}
                                        created_at={review.created_at}
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteReview={(id) => deleteReview(id)}
                                        user_name={review.user_name}
                                        text={review.text}
                                        rank={review.rank}
                                        likes={review.likes}
                                        dislikes={review.dislikes}
                                    />
                                </div>
                            ))}
                        </Slider>

                    )
                ) : (
                    <div className="text-md text-white font-semibold opacity-30">
                        {visited ? 'No reviews' : `You don't have any reviews yet!`}
                    </div>
                )}
            </div>
        </div>
    )
}