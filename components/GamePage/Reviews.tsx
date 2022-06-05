import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Reviews() {
    return (
        <div className="px-7 py-6 rounded-xl" style={{width:'42rem',minHeight:'18rem',backgroundColor:'rgba(21,21,21,0.6)'}}>
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