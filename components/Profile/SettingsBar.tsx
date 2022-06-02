import { useState } from "react";
import SettingsInput from "./SettingsInput";
import YellowButton from '../common/YellowButton'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
    isOpened: boolean,
    method: () => void
}

export default function SettingsBar(props:Props) {
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const saveChanges = () => {
        
    }

    return (
        <div 
            id="settings_bar" 
            className={`h-full fixed z-10 bg-darkIndigo right-0 rounded-2xl p-16 ${props.isOpened ? 'opened' : ''}`}
            onClick={() => props.method()}
            style={{width:'28rem'}}>
            <FontAwesomeIcon icon={faXmark} className="absolute cursor-pointer" style={{height:22,color:'#c7c7c7',right:35,top:42}}/>
            <h1 className="text-white font-semibold text-2xl">Account Settings</h1>
            <div className="pt-4 pb-12">
                <SettingsInput label="Username" placeholder="Enter Your Username" onChange={(e:any) => setUsername(e.target.value)} type="text"/>
                <SettingsInput label="Email" placeholder="Enter Your Email" onChange={(e:any) => setEmail(e.target.value)} type="email"/>
                <SettingsInput label="Current Password" placeholder="Enter Your Current Password" onChange={(e:any) => setPassword(e.target.value)} type="password"/>
                <SettingsInput label="Confirm Password" placeholder="Confirm Your Password" onChange={(e:any) => setConfirmPassword(e.target.value)} type="password"/>
            </div>
            <div style={{marginBottom:'6rem'}}>
                <YellowButton  title="Save Changes" onClick={() => saveChanges()} />
            </div>
        </div>       
    )
}