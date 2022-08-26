import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWindowSize from "../../../lib/functions/hooks/useWindowSize";
import deleteReview from "../../../pages/api/game/cancel/review/deleteReview";
import { Short_Screenshot } from "../../../types";
import { Review_Type } from "../../../types/schema";
import NoScreenShots from "../NoScreenshots";
import ReviewsSlider from "../ReviewsSlider";
import Screenshots from "../Screenshots";
import Image from 'next/image'
import { ObjectId } from "bson";

interface Props {
    screenshots: Short_Screenshot[]
    reviews: Review_Type[]
    reviewsAnimation: boolean
    screenshotsAnimation: boolean
    sliderRef: any
    deleteReview: (id: ObjectId | undefined) => void
    navigateAuth: () => void
}

export default function Bigger1200Footer({
    screenshots,
    reviewsAnimation,
    reviews,
    screenshotsAnimation,
    sliderRef,
    navigateAuth,
    deleteReview }: Props) {
    const [width] = useWindowSize()

    return (
        <div>
            {screenshots.length >= 3 ? (
                <div
                    id="game_page_screenshots_controller"
                    className="relative overflow-hidden"
                    style={{
                        height:
                            width > 1400
                                ? reviewsAnimation && !reviews.length
                                    ? '150px'
                                    : '700px'
                                : reviewsAnimation && !reviews.length
                                    ? '150px'
                                    : '410px',
                    }}
                >
                    <div
                        id="controller"
                        className={`${screenshotsAnimation ? 'controller_animation' : ''
                            }`}
                    >
                        <div
                            className="flex items-center absolute"
                            style={{ bottom: 45, right: 125 }}
                        >
                            <div className="mr-4 flex items-center justify-center cursor-pointer">
                                <Image
                                    onClick={() => sliderRef?.current?.slickNext()}
                                    src={'/icons/arrow_left.svg'}
                                    width={25}
                                    height={18}
                                    alt="arrow-left"
                                />
                            </div>
                            <div className="cursor-pointer bg-white py-3 px-4 flex items-center justify-center rounded-lg">
                                <Image
                                    onClick={() => sliderRef?.current?.slickPrev()}
                                    src={'/icons/arrow_right.svg'}
                                    width={25}
                                    height={18}
                                    alt="arrow-right"
                                />
                            </div>
                        </div>
                    </div>
                    <Screenshots
                        setRef={sliderRef}
                        isAnimated={screenshotsAnimation}
                        images={screenshots}
                    />
                    {reviews.length ? (
                        <div
                            className="h-full flex items-center overflow-hidden"
                            style={{ marginTop: width > 1400 ? '-34rem' : '-20rem' }}
                        >
                            <div
                                className={`px-20 ${reviewsAnimation
                                    ? 'write_review_animation_enabled'
                                    : 'write_review_animation_disabled'
                                    }`}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition"
                                    onClick={navigateAuth}
                                />
                            </div>
                            <ReviewsSlider
                                isAnimated={reviewsAnimation}
                                reviews={reviews}
                                deleteReview={(id) => deleteReview(id)}
                            />
                        </div>
                    ) : (
                        <div
                            className="h-ful  flex justify-center overflow-hidden"
                            style={{ marginTop: width > 1400 ? '-34rem' : '-20rem' }}
                        >
                            <div
                                className={`px-20 ${reviewsAnimation
                                    ? 'write_review_animation_enabled'
                                    : 'write_review_animation_disabled'
                                    }`}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition"
                                    onClick={() => navigateAuth()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <NoScreenShots
                    reviewsAnimation={reviewsAnimation}
                    reviews={reviews}
                    navigateAuth={navigateAuth}
                    deleteReview={(id) => deleteReview(id)}
                />
            )})
        </div>
    )
}