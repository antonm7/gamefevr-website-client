import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function RateGame(props:any){
    const [wasteOfTime,setWasteOfTime] = useState<boolean>(false)
    const [nuh,setNuh] = useState<boolean>(false)
    const [good,setGood] = useState<boolean>(false)
    const [must,setMust] = useState<boolean>(false)
    const [isUserRated, setIsUserRated] = useState<string | null>(null)

    const session:any = useSession()
    const router = useRouter()

    useEffect(() => { 
        const isUserRated = async () => {
            try {
                const req = await axios.get(`/api/game/get/getRank?userId=${session.data?.user?.userId}&gameId=${router.query.id}`)
                if(req.status === 200) {
                    if(!req.data.isUserRated) return
                    setIsUserRated(req.data.isUserRated)
                    props.updateIsUserRated(req.data.isUserRated)
                } else {
                    throw new Error(req.data.error)
                }
            } catch (e) {
                console.log('error',e)
            }
        } 
        isUserRated()
    },[])

    const rate = async (rank:string) => {
        if(session.status === 'unauthenticated') return
        try {
            //cancel rank
            if(rank === isUserRated) {
                setIsUserRated(null)
                const req = await axios.post('/api/game/cancel/cancelRank',{
                    userId:session.data?.user?.userId,
                    gameId:router.query.id,
                    value:rank
                })
                if(req.status !== 200) throw new Error(req.data.error)
            } else {
                setIsUserRated(rank)
                //for not getting several ranking on the same game
                if(isUserRated) {
                    const req = await axios.post('/api/game/cancel/cancelRank',{
                        userId:session.data?.user?.userId,
                        gameId:router.query.id,
                        value:rank
                    })
                    if(req.status !== 200) throw new Error(req.data.error)
                }
                const req = await axios.post('/api/game/action/rankGame', {
                    userId:session.data?.user?.userId,
                    gameId:router.query.id,
                    value:rank
                })
                if(req.status !== 201) throw new Error(req.data.error)
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    return (
        <div id="rate_game" className="h-32 overflow-hidden">
            <div id="rate_game" className="bg-white w-72 h-24 rounded-lg text-center py-4 ">
                <h1 id="rate_game_title" className="text-sm font-semibold text-darkIndigo">How Would You Rate This Game?</h1>
                <div id="span_line" className="flex justify-between px-16 pt-3">
                    <span 
                        className={`text-xl cursor-pointer opacity-40 ${wasteOfTime || isUserRated === 'waste_of_time' ? 'opacity-100' : ''}`} 
                        onMouseEnter={() => setWasteOfTime(true)}
                        onMouseLeave={() => setWasteOfTime(false)}
                        onClick={() => rate('waste_of_time')}
                        >😫
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 ${nuh || isUserRated === 'nuh' ? 'opacity-100' : ''}`} 
                        onMouseEnter={() => setNuh(true)}
                        onMouseLeave={() => setNuh(false)}
                        onClick={() => rate('nuh')}
                        >🙁
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 ${good || isUserRated === 'good' ? 'opacity-100' : ''}`} 
                        onMouseEnter={() => setGood(true)}
                        onMouseLeave={() => setGood(false)}
                        onClick={() => rate('good')}
                        >😐
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 ${must || isUserRated === 'must' ? 'opacity-100' : ''}`} 
                        onMouseEnter={() => setMust(true)}
                        onMouseLeave={() => setMust(false)}
                        onClick={() => rate('must')}
                        >😍
                    </span>
                </div>
            </div>
            <div id="rating_label" className="w-72">
                {wasteOfTime ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'26px'}} id="waste_of_time">
                        <p className="text-sm font-semibold text-darkIndigo rating_label_text">waste of time</p>
                    </div>
                    :null
                }
                {nuh ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'102px'}} id="nuh">
                        <p className="text-sm font-semibold text-darkIndigo rating_label_text">nuh</p>
                    </div>
                    :null
                }
                {good ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'141px'}} id="good">
                        <p className="text-sm font-semibold text-darkIndigo rating_label_text">good</p>
                    </div>
                    :null
                }
                {must ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'186px'}} id="must">
                        <p className="text-sm font-semibold text-darkIndigo rating_label_text">must</p>
                    </div>
                    :null
                }
            </div>
        </div>
    )
}