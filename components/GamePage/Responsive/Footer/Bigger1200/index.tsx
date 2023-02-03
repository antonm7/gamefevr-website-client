import { Short_Screenshot } from "../../../../../types"
import { Review_Type } from "../../../../../types/schema"
import Screenshots from "../../../Screenshots"
import styles from './index.module.scss'
import Image from "next/image"
import { useEffect, useRef, useState } from 'react'
import ReviewsSlider from "../../../ReviewsSlider"
import YellowButton from "../../../../common/YellowButton"
import { gsap } from "gsap"

type Props = {
    screenshots: Short_Screenshot[]
    reviews: Review_Type[]
}

export default function Bigger1200({ screenshots, reviews }: Props) {
    const [screenshotsState, setScreensotsState] = useState<'on' | 'off'>('on')
    const blueBox = useRef(null)
    const screenshotsRef = useRef(null)

    useEffect(() => {
        if (screenshotsState === 'off') {
            const tl = gsap.timeline()
            tl.to(blueBox.current, {
                x: '-100%'
            }, 'start')
                .to(screenshotsRef.current, {
                    x: '100%'
                }, 'start')
        }
    }, [screenshotsState])

    return (
        <>
            <div className="relative">
                <div ref={blueBox} className="h-[780px] w-[600px] bg-darkIndigo" id={styles.blue_box}>
                    <div className="h-full pl-36 pt-28">
                        <Screenshots setRef={screenshotsRef} isAnimated={false} images={screenshots} />
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
            </div>
            <ReviewsSlider reviews={reviews} isAnimated={false} deleteReview={() => null} isUserCommented={false} />
            <div className="w-56 m-auto mt-12">
                <YellowButton title={screenshotsState === 'on' ? 'Show Reviews' : 'Show Screenshots'} onClick={() => setScreensotsState(screenshotsState === 'on' ? 'off' : 'on')} />
            </div>
        </>
    )


}