import axios from 'axios'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { useState } from 'react'
import SmallLoader from '../../components/common/SmallLoader'
import YellowButton from '../../components/common/YellowButton'
import SearchLayout from '../../components/layout'
import StyledInput from '../../components/Register/StyledInput'
import clientPromise from '../../lib/functions/mongodb'

const resetPassword: NextPage = () => {
  const [password, setPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')

  const [loading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [completed, setCompleted] = useState<boolean>(false)

  const router = useRouter()

  const changeMethod = async () => {
    if (completed) return
    try {
      const passw = /^[A-Za-z]\w{7,16}$/
      if (!password.match(passw)) return setError('Please enter valid password')

      if (password !== newPassword) return setError('Confirm password is not the same')

      const req = await axios.post('/api/user/settings/confirmResetPassword', {
        newPassword,
        link: router.query.link,
      })
      if (req.status !== 200) {
        throw new Error()
      } else {
        if (req.data.error) {
          setError(req.data.error)
        } else {
          setTimeout(() => {
            router.push('/register/login')
          }, 1500)
          setError('')
          setCompleted(true)
        }
      }
    } catch (e) {
      setError('Unexpected error, please try again')
    }
  }

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="game_page">
        <StyledInput
          titleColor="white"
          title="New Password"
          placeholder="Enter your new password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mt-6">
          <StyledInput
            titleColor="white"
            title="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="styled-input w-80 pt-6">
          {loading ? (
            <SmallLoader xCentered={true} />
          ) : !completed ? (
            <YellowButton
              onClick={() => changeMethod()}
              title={'Change Password'}
            />
          ) : (
            <YellowButton
              complete={true}
              onClick={() => null}
              completeTitle={'Password Has Changed'}
              title={'Password Has Changed'}
            />
          )}
        </div>
        <p className="text-xl pt-2 font-semibold text-red-600">{error}</p>
      </main>
    </SearchLayout>
  )
}

export async function getServerSideProps(context: any) {
  let db = null
  try {
    const client = await clientPromise
    db = client.db()
  } catch (e) {
    console.log('error', e)
    return {
      props: {
        error: 'Unexpected Error, try again',
        ok: false,
      },
    }
  }

  try {
    const is_user_exists = await db
      .collection('users')
      .findOne({ forgot_password_link: context.params.link })
    if (!is_user_exists) {
      throw new Error('Oops, the link has expired')
    } else {
      return {
        props: {
          error: null,
          ok: true,
        },
      }
    }
  } catch (e) {
    console.log(e)

    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
      props: {},
    }
  }
}

export default resetPassword
