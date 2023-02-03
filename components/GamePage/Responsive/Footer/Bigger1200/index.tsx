import { Short_Screenshot } from "../../../../../types"
import { Review_Type } from "../../../../../types/schema"
import Screenshots from "../../../Screenshots"
import styles from './index.module.scss'
import Image from "next/image"
import { useEffect, useReducer, useRef, useState } from 'react'
import ReviewsSlider from "../../../ReviewsSlider"
import YellowButton from "../../../../common/YellowButton"


type Props = {
    screenshots: Short_Screenshot[]
    reviews: Review_Type[]
}

export default function Bigger1200({ screenshots, reviews }: Props) {
    const [visible, setVisible] = useState<'screenshots' | 'reviews'>('screenshots')

    return (
        <>
            <div className="relative">
                <Screenshots isVisible={visible === 'screenshots'} images={screenshots} />
                <div className="z-20 h-full w-[600px] bg-darkIndigo"
                    id={styles.blue_box}>
                    <div className="h-full pl-36 pt-28">
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
                <ReviewsSlider reviews={reviews} isVisible={visible === 'reviews' ? true : false} deleteReview={() => null} isUserCommented={false} />
            </div>
            <div className="w-56 m-auto mt-12">
                <YellowButton title={visible === 'screenshots' ? 'Show Reviews' : 'Show Screenshots'} onClick={() => setVisible(visible === 'reviews' ? 'screenshots' : 'reviews')} />
            </div>
        </>
    )


}