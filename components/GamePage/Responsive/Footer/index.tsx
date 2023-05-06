import { ObjectId } from "bson"
import { useSession } from "next-auth/react"
import router from "next/router"
import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import Bigger1200 from "./Bigger1200"
import Lower1200 from "./Lower1200"
import { useEffect, useState } from "react"
import { wretchWrapper } from "../../../../lib/functions/fetchLogic"
import SmallLoader from "../../../common/SmallLoader"

type Props = {
    game: DetailedGame
    reviews_state: any
    update_reviews: any
    updateReviewsVisibility: (value: boolean) => void
}

export default function Footer({
    updateReviewsVisibility, reviews_state, update_reviews }: Props) {
    const [screenshots, setScreenshots] = useState([])
    const [reviews, setReviews] = useState<Review_Type[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [width] = useWindowSize()
    const session = useSession()

    const navigateAuth = () => {
        if (session.status !== 'authenticated') {
            return router.push(`/register/login?back=${router.asPath}`)
        }
        const isAlreadyCommented = reviews.filter(
            (r) =>
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
            setReviews(newReviews)
        }
    }

    const initial_loading = async () => {
        setLoading(true)
        const fetchScreenshots = await wretchWrapper(`/api/game/get/getScreenshots?gameId=${router.query.id}`,
        )
        const fetchReviews = await wretchWrapper(`/api/game/get/getReviews?gameId=${router.query.id}`)
        setReviews(fetchReviews.reviews ? fetchReviews.reviews : [])
        setScreenshots(fetchScreenshots.screenshots.screenshots_body.results ? fetchScreenshots.screenshots.screenshots_body.results : [])
        update_reviews(fetchReviews.reviews ? fetchReviews.reviews : [])
        setLoading(false)
    }

    useEffect(() => {
        initial_loading()
    }, [])

    useEffect(() => {
        setReviews(reviews_state)
    }, [reviews_state])

    if (loading) return (
        <div className="pt-28 ">
            <SmallLoader xCentered={true} big={true} />
        </div>
    )

    return (
        <div className="pt-28">
            {width > 1200 ? (
                <Bigger1200
                    navigateAuth={() => navigateAuth()}
                    screenshots={screenshots}
                    reviews={reviews}
                    deleteReview={id => deleteReview(id)}
                />
            ) : (
                <Lower1200
                    navigateAuth={() => navigateAuth()}
                    screenshots={screenshots}
                    reviews={reviews}
                    deleteReview={id => deleteReview(id)}
                    sliderRef={undefined} />
            )}
        </div>
    )
}