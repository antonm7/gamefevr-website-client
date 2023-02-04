import { ObjectId } from "bson"
import { useSession } from "next-auth/react"
import router from "next/router"
import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import Bigger1200 from "./Bigger1200"
import Lower1200 from "./Lower1200"

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

export default function Footer({ game, reviews, updateReviewsVisibility, updateReviewsState, loaders }: Props) {
    const [width] = useWindowSize()
    const session = useSession()

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
        <div className="pt-28">
            {width > 1200 ? (
                <Bigger1200
                    navigateAuth={() => navigateAuth()}
                    screenshots={game.screenshots.results}
                    reviews={reviews}
                />

            ) : (
                <Lower1200
                    navigateAuth={() => navigateAuth()}
                    screenshots={game.screenshots.results}
                    reviews={reviews}
                    deleteReview={id => deleteReview(id)}
                    sliderRef={undefined} />

            )}
        </div>
    )
}