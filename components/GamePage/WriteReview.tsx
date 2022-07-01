import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
    onClose: () => void;
    isUserRated:string | null;
    visible: boolean;
}

export default function WriteReview(props:Props) {
    const [text, setText] = useState<string>('')
    const [rank, setRank] = useState<string | null>(null)
    const session:any = useSession()
    const router = useRouter()

    const writeReview = async () => {
        try {
            //if user already rated the game, and if the raview
            // ranking is different then needs to cancel the ranking 
            if(props.isUserRated && rank !== props.isUserRated) {
                await axios.post('/api/game/cancelRank', {
                    userId:session.data?.user?.userId,
                    gameId:router.query.id,
                })
            }
            const writeReviewRequest = await axios.post('/api/game/writeReview', {
                userId:session.data?.user?.userId,
                gameId:router.query.id,
                text,
                rank
            })
            const rankGameRequest = await axios.post('/api/game/rankGame', {
                userId:session.data?.user?.userId,
                gameId:router.query.id,
                value:rank
            })
            if(writeReviewRequest.status !== 201) throw new Error(writeReviewRequest.data.error)
            if(rankGameRequest.status !== 201) throw new Error(rankGameRequest.data.error)
        } catch (e) {
            console.log('error',e)
        }
    }

    useEffect(() => {
        console.log(props.isUserRated)
        if(props.isUserRated) {
            setRank(props.isUserRated)
        }
    }, [props.isUserRated])

    // useEffect(() => { 
    //     const isUserRated = async () => {
    //         try {
    //             const req = await axios.get(`/api/game/getRank?userId=${session.data?.user?.userId}&gameId=${router.query.id}`)
    //             if(req.status === 200) {
    //                 if(!req.data.isUserRated) return
    //                 setIsUserRated(req.data.isUserRated)
    //                 setRank(req.data.isUserRated)
    //             } else {
    //                 throw new Error(req.data.error)
    //             }
    //         } catch (e) {
    //             console.log('error',e)
    //         }
    //     } 
    //     isUserRated()
    // },[])

    const toggleRank = (value:string) => {
        if(rank === value) {
            setRank(null)
        } else {
            setRank(value)
        }
    }

    return (
    <div id="write_review_container" className={`${props.visible ? 'fixed ' : 'hidden '}px-7 py-6 rounded-xl mx-2 w-3/5 z-40`} style={{minHeight:'24rem',maxHeight:'80%',backgroundColor:'rgba(21,21,21)'}}>
           <FontAwesomeIcon onClick={props.onClose} icon={faXmark} className="h-6 absolute white text-white right-6 cursor-pointer"/>
            <div className="flex flex-wrap my-2">
                <div onClick={() => toggleRank('waste_of_time')} className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'waste_of_time' ? 'bg-white' : ''}`} style={{border:'solid #e3e3e3',borderWidth:1}}>
                    <span className="pr-2 text-md">😫</span>
                    <h2 className={`simple-transition text-white text-sm hover:text-black ${rank === 'waste_of_time' ? 'text-black' : ''}`}>Waste Of Time</h2>
                </div>
                <div onClick={() => toggleRank('nuh')} className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'nuh' ? 'bg-white' : ''}`} style={{border:'solid #e3e3e3',borderWidth:1}}>
                    <span className="pr-2 text-md">😫</span>
                    <h2 className={`simple-transition text-white text-sm hover:text-black ${rank === 'nuh' ? 'text-black' : ''}`}>Nuh</h2>
                </div>
                <div onClick={() => toggleRank('good')} className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'good' ? 'bg-white' : ''}`} style={{border:'solid #e3e3e3',borderWidth:1}}>
                    <span className="pr-2 text-md">😫</span>
                    <h2 className={`simple-transition text-white text-sm hover:text-black ${rank === 'good' ? 'text-black' : ''}`}>Good</h2>
                </div>
                <div onClick={() => toggleRank('must')} className={`simple-transition cursor-pointer flex items-center flex-nowrap rounded-md py-1 px-2 mr-4 mb-4 hover:bg-white ${rank === 'must' ? 'bg-white' : ''}`} style={{border:'solid #e3e3e3',borderWidth:1}}>
                    <span className="pr-2 text-md">😫</span>
                    <h2 className={`simple-transition text-white text-sm hover:text-black ${rank === 'must' ? 'text-black' : ''}`}>Must</h2>
                </div>
            </div>
            <TextareaAutosize className="textarea w-full" placeholder="Write Your Review" onChange={e => setText(e.target.value)}/>
            <p className="text-xs" style={{color:'#9da8b6'}}>120 / 366</p>
            <div className="h-16 flex justify-end items-center">
                <button className="w-32 h-12 bg-specialYellow rounded-lg text-white text-lg font-normal" onClick={() => writeReview()}>
                    Send
                </button>
            </div>
        </div>
    )
}