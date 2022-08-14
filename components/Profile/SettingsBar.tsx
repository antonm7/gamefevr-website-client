import React, { useEffect, useState } from 'react'
import SettingsInput from './SettingsInput'
import YellowButton from '../common/YellowButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Client_User } from '../../types/schema'
import { useGlobalError } from '../../store'
import axios from 'axios'

interface Props {
  user: Client_User
  isOpened: boolean
  close: () => void
}

export default function SettingsBar(props: Props) {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const changeGlobalErrorVisibility = useGlobalError(
    (state) => state.setIsVisible
  )
  const changeText = useGlobalError((state) => state.setText)

  const saveChanges = async () => {
    //user tries to change password
    if (oldPassword !== '' || newPassword !== '') {
      if (oldPassword === '') {
        changeText('Old password is required')
        changeGlobalErrorVisibility(true)
        return
      } else if (newPassword === '') {
        changeGlobalErrorVisibility(true)
        changeText('New password is required')
        return
      }
    }
    try {
      //user tries to change email
      if (email !== props.user.email) {
        console.log('email changed')
      }
      //user tries to change username
      if (username !== props.user.username) {
        const req = await axios.post('/api/user/settings/changeUsername', {
          userId: props.user._id,
          username,
        })
        if (!req.data.error) {
          alert('Username changed')
        } else {
          changeText(req.data.error)
          changeGlobalErrorVisibility(true)
        }
      }
      //user tries to change password
      if (oldPassword !== '' || newPassword !== '') {
        if (oldPassword === newPassword) {
          changeGlobalErrorVisibility(true)
          changeText('New password must be different from old password')
          return
        }
      }
    } catch (e) {
      changeGlobalErrorVisibility(true)
    }
  }

  useEffect(() => {
    setUsername(props.user.username)
    setEmail(props.user.email)
  }, [props.user])

  const checkActive = () => {
    if (
      username === props.user.username &&
      email === props.user.email &&
      oldPassword === '' &&
      newPassword === ''
    ) {
      return false
    }
    return true
  }

  return (
    <div
      id="settings_bar"
      className={`h-full fixed z-10 bg-darkIndigo right-0 rounded-2xl p-16 ${
        props.isOpened ? 'opened' : ''
      }`}
      style={{ width: '28rem' }}
    >
      <FontAwesomeIcon
        onClick={() => props.close()}
        icon={faXmark}
        className="absolute cursor-pointer"
        style={{ height: 22, color: '#c7c7c7', right: 35, top: 42 }}
      />
      <h1 className="text-white font-semibold text-2xl">Account Settings</h1>
      <div id="settings_bar_inner_container" className="pt-4 pb-12">
        <SettingsInput
          value={username}
          label="Username"
          placeholder="Enter Your Username"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          type="text"
        />
        <SettingsInput
          value={email}
          label="Email"
          placeholder="Enter Your Email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          type="email"
        />
        <SettingsInput
          value={oldPassword}
          label="Current Password"
          placeholder="Enter Your Current Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOldPassword(e.target.value)
          }
          type="password"
        />
        <SettingsInput
          value={newPassword}
          label="Confirm Password"
          placeholder="Confirm Your Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
          type="password"
        />
      </div>
      <div id="settings_bar_bottom" style={{ marginBottom: '6rem' }}>
        <YellowButton
          active={checkActive()}
          title="Save Changes"
          onClick={() => saveChanges()}
        />
      </div>
    </div>
  )
}
