import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { wretchAction } from "../../../lib/functions/fetchLogic"
import styles from './index.module.scss'

export default function HypeUser() {
    const router = useRouter()
    const userId = router.query.id
    const session = useSession()
    const [isHyped, setIsHyped] = useState<boolean>(false)

    const navigateAuth = () => {
        if (session.status !== 'authenticated') {
            return router.push(`/register/login?back=${router.asPath}`)
        }
        hypeUserMethod()
    }

    const hypeUserMethod = async (): Promise<void> => {
        try {
            await wretchAction('/api/user/action/hype', {
                gets_hype: userId,
                sends_hype: session.data?.user.userId
            })
            setIsHyped(true)
            PubSub.publish('OPEN_ALERT', {
                type: 'success',
                msg: `You hyped the user!`
            })
        } catch (e) {
            PubSub.publish('OPEN_ALERT', {
                type: 'error',
                msg: `oops, could'nt hype the user...`
            })
        }
    }

    if (isHyped) return null

    return (
        <div onClick={() => navigateAuth()} id={styles.hype_user_wrapper}>
            <div className="h-8 w-8 flex flex-col justify-center items-center overflow-hidden rounded-full mr-4" style={{ border: "1px solid #38b6cc" }}>
                <FontAwesomeIcon icon={faArrowUp} className="font-semibold text-cool-blue cursor-pointer h-4" />
            </div>
        </div >
    )
}