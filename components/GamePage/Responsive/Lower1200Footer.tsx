import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "bson";
import deleteReview from "../../../pages/api/game/cancel/review/deleteReview";
import { Short_Screenshot } from "../../../types";
import { Review_Type } from "../../../types/schema";
import Screenshots from "../Screenshots";
import VerticalReviewsLoader from "../VerticalReviewsLoader";

interface Props {
    screenshots: Short_Screenshot[],
    navigateAuth: () => void,
    deleteReview: (id: ObjectId | undefined) => void
    reviews: Review_Type[]
}

export default function Lower1200Footer({ screenshots, navigateAuth, reviews, deleteReview }: Props) {
    return (
        <div>
            <div
                id="game_page_screenshots_controller"
                className="relative overflow-hidden"
                style={{ height: '400px' }}
            >
                <div id="controller" />
                <Screenshots
                    isAnimated={false}
                    images={screenshots}
                />
            </div>
            <div
                id="game_page_reviews_container"
                className="flex flex-col items-center"
            >
                <div
                    className="w-72 p-6 flex items-center justify-center rounded-xl mb-8 
            cursor-pointer opacity-80 hover:opacity-100"
                    style={{ backgroundColor: 'rgba(21,21,21,0.6)' }}
                >
                    <div
                        className="flex items-center justify-center"
                        onClick={navigateAuth}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="h-6 text-white pr-4"
                            onClick={navigateAuth}
                        />
                        <h1 className="text-white text-xl flex items-center">
                            Add A Review
                        </h1>
                    </div>
                </div>
                {reviews.length ? (
                    <VerticalReviewsLoader
                        reviews={reviews}
                        deleteReview={(id) => deleteReview(id)}
                    />
                ) : null}
            </div>
        </div>
    )
}