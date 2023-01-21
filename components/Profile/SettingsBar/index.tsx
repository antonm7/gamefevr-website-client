import React, { useEffect, useState } from 'react'
import SettingsInput from '../SettingsInput'
import YellowButton from '../../common/YellowButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

interface Props {
  user: {
    username: string
    email: string
  }
  isOpened: boolean
  onUsernameChange: (name: string) => void
  close: () => void
}


export default function SettingsBar({ user, isOpened, close, onUsernameChange }: Props) {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')



  const saveChanges = async (): Promise<void> => {
    //user tries to change password
    if (oldPassword !== '' || newPassword !== '') {
      if (oldPassword === '') {
        PubSub.publish('OPEN_ALERT', {
          type: 'error',
          msg: 'Old password is required'
        })
        return
      } else if (newPassword === '') {
        PubSub.publish('OPEN_ALERT', {
          type: 'error',
          msg: 'New password is required'
        })
        return
      }
      try {
        const req = await axios.post('/api/user/settings/changePassword', {
          email,
          oldPassword,
          newPassword
        })
        if (!req.data.error) {
          PubSub.publish('OPEN_ALERT', {
            type: 'success',
            msg: 'Password has changed'
          })
        } else {
          PubSub.publish('OPEN_ALERT', {
            type: 'error',
            msg: req.data.error
          })
        }
      } catch (e) {
        PubSub.publish('OPEN_ALERT', {
          type: 'error',
          msg: 'Unexpected Error'
        })
      }

    }
    try {
      //user tries to change username
      if (username !== user.username) {
        const req = await axios.post('/api/user/settings/changeUsername', {
          email: user.email,
          username
        })
        if (!req.data.error) {
          onUsernameChange(username)
          PubSub.publish('OPEN_ALERT', {
            type: 'success',
            msg: 'Username has changed'
          })
        } else {
          PubSub.publish('OPEN_ALERT', {
            type: 'error',
            msg: req.data.error
          })
        }
      }
      //user tries to change password
      if (oldPassword !== '' || newPassword !== '') {
        if (oldPassword === newPassword) {
          PubSub.publish('OPEN_ALERT', {
            type: 'error',
            msg: 'New password must be different from old password'
          })
          return
        }
      }
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: ''
      })

    }
  }

  useEffect(() => {
    setUsername(user.username)
    setEmail(user.email)
  }, [user])

  const checkActive = (): boolean => {
    if (
      username === user.username &&
      email === user.email &&
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
      className={`absolute bottom-0 z-10 bg-darkIndigo right-0 rounded-2xl p-16 ${isOpened ? 'opened' : ''
        }`}
      style={{
        width: '28rem',
        height: '87vh',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <FontAwesomeIcon
        onClick={() => close()}
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
          label="New Password"
          placeholder="Enter Your New Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
          type="password"
        />
      </div>
      <div id="settings_bar_bottom">
        <YellowButton
          active={checkActive()}
          title="Save Changes"
          onClick={() => saveChanges()}
        />
      </div>
    </div>
  )
}