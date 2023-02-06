import { ObjectId } from "bson";
import { Short_Screenshot } from "../../../../../types";
import { Review_Type } from "../../../../../types/schema";
import ReviewsSlider from "../../../ReviewsSlider";
import Screenshots from "../../../Screenshots";
import styles from './index.module.scss';
import Image from "next/image";

type Props = {
    screenshots: Short_Screenshot[]
    navigateAuth: () => void
    deleteReview: (id: ObjectId | undefined) => void
    reviews: Review_Type[]
    sliderRef: any
}

export default function Lower1200({ reviews, navigateAuth, deleteReview, screenshots }: Props) {
    return (
        <div className="">
            <div className="relative h-[450px]">
                <div className="absolute z-20 h-full w-[600px] bg-darkIndigo" id={styles.blueBox} >
                    <div className="pt-[23rem] pl-28">
                        <div id={styles.arrows_wrapper} className="flex items-center bottom-0">
                            <Image
                                src={'/icons/arrow_left.svg'}
                                width={25}
                                height={18}
                                alt="arrow-left"
                            />
                            <div className="ml-8 bg-white flex items-center justify-center py-2 px-4 rounded-lg">
                                <Image
                                    src={'/icons/arrow_right.svg'}
                                    width={25}
                                    height={18}
                                    alt="arrow-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Screenshots lower1200={true} isVisible={true} images={screenshots} />
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