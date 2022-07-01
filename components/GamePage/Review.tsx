import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Review_Type } from "../../types/schema"

export default function Review(props:Review_Type) {
    const session = useSession()

    const deleteReview = async () => {
        try {
            const deleteReviewRequest = await axios.post('api/game/deleteReview', {
                userId:props.userId,
                gameId:props.gameId,
                reviewId:props._id
            })
            const cancelRankRequest = await axios.post('api/game/cancelRank',{
                userId:props.userId,
                gameId:props.gameId,
                rankId:props._id
            })
            if(deleteReviewRequest.status !== 200) {
                throw new Error(deleteReviewRequest.data.error)
            }
            if(cancelRankRequest.status !== 200) {
                throw new Error(deleteReviewRequest.data.error)
            }
            console.log('deleted rank')
        } catch (e) {
            console.log('error',e)
        }
    }

    return (
        <div id="review" className="px-7 py-6 rounded-xl relative mx-2" style={{width:'32rem',minWidth:'32rem',height:'30rem',minHeight:'30rem', backgroundColor:'rgba(21,21,21,0.6)'}}>
            <h1 className="text-white font-bold text-3xl  underline">Rank</h1>
            <p className="text-white font-base pt-2">t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
            <div className="flex items-center justify-between pt-5">
                <div>
                    <p className="text-cool-blue font-semibold">Anton Migolko</p>
                    <p className="text-white opacity-50">19 Aug, 2022</p>
                </div>
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-5 h-8 text-green-400 cursor-pointer"/>
                    <FontAwesomeIcon icon={faThumbsDown} className="h-8 text-red-400 cursor-pointer"/>
                </div>
            </div>
        </div>
    )
}