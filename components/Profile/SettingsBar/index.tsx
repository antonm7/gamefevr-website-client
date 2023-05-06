import React, { useEffect, useState } from 'react'
import SettingsInput from '../SettingsInput'
import YellowButton from '../../common/YellowButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.scss'
import { wretchAction } from '../../../lib/functions/fetchLogic'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

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
        const changePasswordAction: any = await wretchAction('/api/user/settings/changePassword', {
          email,
          oldPassword,
          newPassword
        })
        const resError: { error: string | boolean } = changePasswordAction.error
        if (!resError) {
          PubSub.publish('OPEN_ALERT', {
            type: 'success',
            msg: 'Password has changed'
          })
        } else {
          PubSub.publish('OPEN_ALERT', {
            type: 'error',
            msg: resError
          })
        }
      } catch (e) {
        PubSub.publish('OPEN_ALERT', {
          type: 'error',
          msg: 'Unexpected Error'
        })
      }
    }

    //user tries to change username
    try {
      if (username !== user.username) {
        const changeUsernameAction: any = await wretchAction('/api/user/settings/changeUsername', {
          email: user.email,
          username
        })
        const resError: { error: string | boolean } = changeUsernameAction.error
        if (!resError) {
          onUsernameChange(username)
          PubSub.publish('OPEN_ALERT', {
            type: 'success',
            msg: 'Username has changed'
          })
        } else {
          PubSub.publish('OPEN_ALERT', {
            type: 'error',
            msg: resError
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
      id={styles.settings_bar_wrapper}
      className={`
      absolute bottom-0 z-10 bg-darkIndigo 
      right-0 rounded-2xl p-16 ${isOpened ? styles.opened : ''}`}
    >
      <FontAwesomeIcon
        onClick={() => close()}
        icon={faXmark as IconProp}
        className="absolute cursor-pointer"
        style={{ height: 22, color: '#c7c7c7', right: 35, top: 42 }}
      />
      <h1 className="text-white font-semibold text-2xl">Account Settings</h1>
      <div className="pt-4 pb-12">
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
      <YellowButton
        active={checkActive()}
        title="Save Changes"
        onClick={() => saveChanges()}
      />
    </div>
  )
}
