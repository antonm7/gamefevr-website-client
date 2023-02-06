import { Short_Screenshot } from "../../../../../types"
import { Review_Type } from "../../../../../types/schema"
import Screenshots from "../../../Screenshots"
import styles from './index.module.scss'
import Image from "next/image"
import { useEffect, useRef, useState } from 'react'
import ReviewsSlider from "../../../ReviewsSlider"
import YellowButton from "../../../../common/YellowButton"
import gsap from 'gsap'
import { ObjectId } from "bson"

type Props = {
    screenshots: Short_Screenshot[]
    reviews: Review_Type[]
    navigateAuth: () => void
    deleteReview: (id: ObjectId | undefined) => void
}

export default function Bigger1200({ screenshots, reviews, navigateAuth, deleteReview }: Props) {
    const [visible, setVisible] = useState<'screenshots' | 'reviews'>('screenshots')
    const screenshotsRef = useRef(null)
    const blueBoxRef = useRef(null)
    const wrapperRef = useRef(null)
    const reviewsRef = useRef(null)

    useEffect(() => {
        if (visible === 'reviews') {
            gsap.to(wrapperRef.current, {
                height: reviews.length ? '780px' : '180px',
                delay: 0.4,
                duration: 0.2
            })
            gsap.to(blueBoxRef.current, {
                x: '-100%',
                duration: 0.2
            })
            gsap.to(screenshotsRef.current, {
                x: '100%',
                duration: 0.2
            })
            gsap.to(reviewsRef.current, {
                top: reviews.length ? '5rem' : '50%',
                duration: 0.4,
                delay: reviews.length ? 0.4 : 1,
            })
        } else {
            gsap.to(wrapperRef.current, {
                height: '780px',
                delay: reviews.length ? 0.4 : 0.2
            })
            gsap.to(blueBoxRef.current, {
                x: '0%',
                duration: 0.2,
                delay: 0.2
            })
            gsap.to(screenshotsRef.current, {
                x: '130px',
                duration: 0.2,
                delay: 0.2,
            })
            gsap.to(reviewsRef.current, {
                top: '-100%',
                duration: 0.4
            })
        }
    }, [visible, reviews])

    return (
        <>
            <div className="relative overflow-hidden" ref={wrapperRef}>
                <Screenshots setRef={screenshotsRef} isVisible={visible === 'screenshots'} images={screenshots} />
                <div ref={blueBoxRef} className="relative z-20 h-full w-[600px] bg-darkIndigo"
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
                <ReviewsSlider navigateAuth={navigateAuth} setRef={reviewsRef} reviews={reviews} deleteReview={id => deleteReview(id)} />
            </div>
            <div className="w-56 m-auto mt-12">
                <YellowButton title={visible === 'screenshots' ? 'Show Reviews' : 'Show Screenshots'} onClick={() => setVisible(visible === 'reviews' ? 'screenshots' : 'reviews')} />
            </div>
        </>
    )


}