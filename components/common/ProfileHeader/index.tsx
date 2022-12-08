import { faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import IndicateHype from "../../Profile/IndicateHype"
import HypeUser from "../HypeUser"

type Props = {
    visited: boolean,
    username: string
    hype: string
    changeVisibleSettings: (value: boolean) => void
}

export default function ProfileHeader({ visited, username, hype, changeVisibleSettings }: Props) {
    console.log(visited)
    return (
        <div
            id="profile_page_welcome"
            className="flex justify-between items-center"
        >
            <div className="flex items-center" id="profile_indicate_wrapper">
                <h1 id="welcome_title" className="text-white font-bold whitespace-pre-wrap text-4xl">
                    {visited ? `Welcome to ${username}` : `Welcome ${username}`}
                </h1>
                {visited ? <div className="flex items-center">
                    <IndicateHype hype={hype} />
                    <HypeUser />
                </div> : <IndicateHype hype={hype} />}


            </div>
            {visited ? null : <div
                id="account_settings_wrapper_titles"
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
    )
}