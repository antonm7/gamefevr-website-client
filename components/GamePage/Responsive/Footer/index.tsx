import { ObjectId } from "bson"
import { useSession } from "next-auth/react"
import router from "next/router"
import { useEffect, useReducer, useRef } from "react"
import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import FooterButtons from "../../FooterButtons"
import Bigger1200Footer from "./Bigger1200Footer"
import Lower1200Footer from "./lower1200Footer"

type Animation_State = {
    screenshotsAnimation: boolean
    reviewsAnimation: boolean
}

type Animation_Action = {
    type: 'screenshots' | 'reviews' | 'none',
    value: boolean
}

type Loaders_State = {
    globalLoading: boolean
    reviewsLoading: boolean
}

type Props = {
    game: DetailedGame
    reviews: Review_Type[]
    updateReviewsVisibility: (value: boolean) => void
    updateReviewsState: (reviews: Review_Type[]) => void
    loaders: Loaders_State
}

const animationReducer = (state: Animation_State, action: Animation_Action) => {
    switch (action.type) {
        case 'screenshots': {
            return { screenshotsAnimation: action.value, reviewsAnimation: state.reviewsAnimation }
        }
        case 'reviews': {
            return { screenshotsAnimation: state.screenshotsAnimation, reviewsAnimation: action.value }
        }
        case 'none': {
            return { ...state }
        }
    }
}

export default function Footer({ game, reviews, updateReviewsVisibility, updateReviewsState, loaders }: Props) {
    const [width] = useWindowSize()
    const [animations, setAnimations] = useReducer(animationReducer, { screenshotsAnimation: false, reviewsAnimation: false })
    const session = useSession()
    const sliderRef = useRef(null)

    useEffect(() => {
        setAnimations({ type: 'none', value: false })
    }, [])

    const toggleAnimation = () => {
        if (animations.reviewsAnimation) {
            setAnimations({ type: 'reviews', value: false })
            setTimeout(() => {
                setAnimations({ type: 'screenshots', value: false })
            }, 450)
        } else {
            setAnimations({ type: 'screenshots', value: true })
            setTimeout(() => {
                setAnimations({ type: 'reviews', value: true })
            }, 450)
        }
    }

    const navigateAuth = () => {
        if (session.status !== 'authenticated') {
            return router.push(`/register/login?back=${router.asPath}`)
        }
        const isAlreadyCommented = reviews.filter(
            (r: any) =>
                JSON.stringify(r.userId) === JSON.stringify(session.data.user.userId)
        )
        if (isAlreadyCommented.length > 0) {
            PubSub.publish('OPEN_ALERT', {
                type: 'warning',
                msg: 'You already commented this game'
            })
        } else {
            updateReviewsVisibility(true)
        }
    }

    const deleteReview = (id: ObjectId | undefined): void => {
        if (id) {
            const newReviews = reviews.filter(
                (review: Review_Type) => review._id !== id
            )
            updateReviewsState(newReviews)
        }
    }

    return (
        <>
            {width > 1200 ? (
                <Bigger1200Footer
                    screenshots={game.screenshots.results}
                    reviews={reviews}
                    reviewsAnimation={animations.reviewsAnimation}
                    screenshotsAnimation={animations.screenshotsAnimation}
                    sliderRef={sliderRef}
                    deleteReview={(id) => deleteReview(id)}
                    navigateAuth={() => navigateAuth()}
                />
            ) : (
                <Lower1200Footer
                    reviewsLoading={loaders.reviewsLoading}
                    screenshots={game.screenshots.results}
                    navigateAuth={() => navigateAuth()}
                    deleteReview={(id) => deleteReview(id)}
                    sliderRef={sliderRef}
                    reviews={reviews}
                />
            )}
            <FooterButtons
                reviewsLoading={loaders.reviewsLoading}
                screenshots={game.screenshots}
                reviewsAnimation={animations.reviewsAnimation}
                toggleAnimation={toggleAnimation}
            />
        </>
    )
}