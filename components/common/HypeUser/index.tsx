import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"



export default function HypeUser() {
    const router = useRouter()
    const userId = router.query.id
    const [isHyped, setIsHyped] = useState<boolean>(false)

    const is_already_hyped: () => Promise<void> = async () => {
        try {
            const req = await axios.get(`/api/user/get/isHyped?userId=${userId}`)
            if (req.status === 200) {
                if (req.data.error) throw new Error(req.data.error)
                if (req.data.isHyped) {
                    setIsHyped(true)
                } else {
                    setIsHyped(false)
                }
            } else {
                throw new Error()
            }
        } catch (e) {
            console.log('error getting hyped', e)
            setIsHyped(false)
        }
    }

    useEffect(() => {
        is_already_hyped()
    }, [])

    if (isHyped) return null

    return (
        <div className={`pl-4 cursor-pointer`}>
            <div className="h-12 flex flex-col justify-center items-center  mr-4">
                <FontAwesomeIcon icon={faArrowUp} className="font-semibold text-specialYellow" />
                <p className='text-specialYellow font-medium select-none'>hype</p>
            </div>
        </div >
    )
}