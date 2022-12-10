import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useGlobalError } from "../../../store"

export default function HypeUser() {
    const router = useRouter()
    const userId = router.query.id
    const session = useSession()
    const [isHyped, setIsHyped] = useState<boolean>(false)
    const globalErrorState = useGlobalError(state => state)

    const navigateAuth = () => {
        if (session.status !== 'authenticated') {
            return router.push(`/register/login?back=${router.asPath}`)
        }
        hypeUserMethod()
    }

    const hypeUserMethod = async (): Promise<void> => {
        try {
            const req = await axios.post('/api/user/action/hype', {
                gets_hype: userId,
                sends_hype: session.data?.user.userId
            })
            if (req.status !== 201 && req.status !== 200) {
                throw new Error()
            } else {
                setIsHyped(true)
                globalErrorState.setType('success')
                globalErrorState.setText(`You hyped the user!`)
                globalErrorState.setIsVisible(true)
            }
        } catch (e) {
            globalErrorState.setType('error')
            globalErrorState.setText(`oops, could'nt hype the user...`)
            globalErrorState.setIsVisible(true)
        }
    }

    if (isHyped) return null

    return (
        <div onClick={() => navigateAuth()}>
            <div className="h-8 w-8 flex flex-col justify-center items-center overflow-hidden rounded-full" style={{ border: "1px solid #38b6cc" }}>
                <FontAwesomeIcon icon={faArrowUp} className="font-semibold text-cool-blue cursor-pointer h-4" />
            </div>
        </div >
    )
}