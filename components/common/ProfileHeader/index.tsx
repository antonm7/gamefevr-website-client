import { faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import IndicateHype from "../../Profile/IndicateHype"
import HypeUser from "../HypeUser"
import styles from './index.module.scss'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

type Props = {
    visited: boolean,
    username: string
    hype: string
    changeVisibleSettings: (value: boolean) => void
    isHyped: boolean
}

export default function ProfileHeader({
    isHyped,
    visited,
    username,
    hype,
    changeVisibleSettings
}: Props) {
    return (
        <div className="flex justify-between items-center" id={styles.profile_header_wrapper}>
            <div className="flex flex-wrap-reverse items-center" id={styles.profile_header_name_line}>
                <h1 className="flex items-center text-white overflow-hidden font-bold whitespace-pre-wrap text-4xl" id={styles.profile_header_title}>
                    {!isHyped && visited ? <HypeUser /> : null}
                    {visited ? `Welcome to ${username}` : `Welcome ${username}`}
                </h1>
                {visited ? <div className="flex items-center">
                    <IndicateHype hype={hype} />
                </div> : <IndicateHype hype={hype} />}
            </div>
            <div id={styles.account_settings_div_wrapper}>
                {visited ? null : <div
                    className="flex items-center"
                    onClick={() => changeVisibleSettings(true)}
                >
                    <FontAwesomeIcon
                        icon={faGear as IconProp}
                        className="h-4 pr-2 cursor-pointer"
                        style={{ color: '#616e7e' }}
                    />
                    <p
                        className="text-large font-semibold cursor-pointer"
                        style={{ color: '#616e7e' }}
                    >
                        Account Settings
                    </p>
                </div>}
            </div>
        </div>
    )
}