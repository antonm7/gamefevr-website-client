import { useState } from "react"

export default function RateGame(){
    const [wasteOfTime,setWasteOfTime] = useState<boolean>(false)
    const [nuh,setNuh] = useState<boolean>(false)
    const [good,setGood] = useState<boolean>(false)
    const [must,setMust] = useState<boolean>(false)

    const rate = (rank:string) => {
        
    }

    return (
        <div className="overflow-hidden">
            <div className="bg-white w-72 h-24 rounded-lg text-center py-4 ">
                <h1 className="text-sm font-semibold text-darkIndigo">How Would You Rate This Game?</h1>
                <div className="flex justify-between px-16 pt-3">
                    <span 
                        className={`text-xl cursor-pointer opacity-40 hover:opacity-100`} 
                        onMouseEnter={() => setWasteOfTime(true)}
                        onMouseLeave={() => setWasteOfTime(false)}
                        onClick={() => rate('waste of time')}
                        >😫
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 hover:opacity-100`} 
                        onMouseEnter={() => setNuh(true)}
                        onMouseLeave={() => setNuh(false)}
                        onClick={() => rate('nuh')}
                        >🙁
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 hover:opacity-100`} 
                        onMouseEnter={() => setGood(true)}
                        onMouseLeave={() => setGood(false)}
                        onClick={() => rate('good')}
                        >😐
                    </span>
                    <span 
                        className={`text-xl cursor-pointer opacity-40 hover:opacity-100`} 
                        onMouseEnter={() => setMust(true)}
                        onMouseLeave={() => setMust(false)}
                        onClick={() => rate('must')}
                        >😍
                    </span>
                </div>
            </div>
            <div className="absolute">
                {wasteOfTime ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'26px'}}>
                        <p className="text-sm font-semibold text-darkIndigo">waste of time</p>
                    </div>
                    :null
                }
                {nuh ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'102px'}}>
                        <p className="text-sm font-semibold text-darkIndigo">nuh</p>
                    </div>
                    :null
                }
                {good ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'141px'}}>
                        <p className="text-sm font-semibold text-darkIndigo">good</p>
                    </div>
                    :null
                }
                {must ? 
                    <div className="bg-white w-22 p-2 pt-1 rating-text text-center" style={{marginLeft:'186px'}}>
                        <p className="text-sm font-semibold text-darkIndigo">must</p>
                    </div>
                    :null
                }
            </div>
        </div>
    )
}