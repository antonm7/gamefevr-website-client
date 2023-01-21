import { faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import IndicateHype from "../../Profile/IndicateHype"
import HypeUser from "../HypeUser"

type Props = {
    visited: boolean,
    username: string
    hype: string
    changeVisibleSettings: (value: boolean) => void
    isHyped: boolean
}

export default function ProfileHeader({ isHyped, visited, username, hype, changeVisibleSettings }: Props) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-wrap-reverse">
                {!isHyped && visited ? <HypeUser /> : null}
                <h1 className="flex text-white font-bold whitespace-pre-wrap text-4xl">
                    {visited ? `Welcome to ${username}` : `Welcome ${username}`}
                </h1>
                {visited ? <div className="flex items-center">
                    <IndicateHype hype={hype} />
                </div> : <IndicateHype hype={hype} />}
            </div>
            <div>
                {visited ? null : <div
                    className="flex items-center"
                    onClick={() => changeVisibleSettings(true)}
                >
                    <FontAwesomeIcon
                        icon={faGear}
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