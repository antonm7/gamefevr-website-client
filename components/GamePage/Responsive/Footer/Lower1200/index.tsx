import { ObjectId } from "bson";
import { Short_Screenshot } from "../../../../../types";
import { Review_Type } from "../../../../../types/schema";
import ReviewsSlider from "../../../ReviewsSlider";
import Screenshots from "../../../Screenshots";
import styles from './index.module.scss';
import { useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    screenshots: Short_Screenshot[]
    navigateAuth: () => void
    deleteReview: (id: ObjectId | undefined) => void
    reviews: Review_Type[]
    sliderRef: any
}

export default function Lower1200({ reviews, navigateAuth, deleteReview, screenshots }: Props) {
    const sliderRef = useRef<any>(null)
    return (
        <div>
            <div className="relative h-[450px]">
                <div className="absolute z-20 h-full w-[600px] bg-darkIndigo" id={styles.blueBox} >
                    <div className="pt-[23rem] pl-28">
                        <div id={styles.arrows_wrapper} className="flex items-center bottom-0">
                            <FontAwesomeIcon className="h-6 text-white"
                                icon={faArrowLeft as IconProp}
                                onClick={() => sliderRef.current.slickPrev()}
                            />
                            <div className="ml-8 bg-white flex items-center justify-center py-2 px-4 rounded-lg">
                                <FontAwesomeIcon className="h-6 text-inputBg"
                                    icon={faArrowRight as IconProp}
                                    onClick={() => sliderRef.current.slickNext()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Screenshots sliderRef={sliderRef} lower1200={true} images={screenshots} />
            </div>
            <div className="mt-32">
                <ReviewsSlider
                    lower1200={true}
                    reviews={reviews}
                    deleteReview={(id) => deleteReview(id)}
                    navigateAuth={navigateAuth} />
            </div>
        </div>
    )
}