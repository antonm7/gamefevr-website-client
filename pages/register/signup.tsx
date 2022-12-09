import axios from 'axios'
import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import SignupAnimation from '../../components/animations/Signup'
import OnlyLogo from '../../components/common/OnlyLogo'
import SmallLoader from '../../components/common/SmallLoader'
import YellowButton from '../../components/common/YellowButton'
import StyledInput from '../../components/Register/StyledInput'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

const Signup: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const [width] = useWindowSize()

  const signup = async (): Promise<void> => {
    setError('')
    setLoading(true)
    try {
      const { data, status } = await axios.post('/api/auth/signup', {
        email,
        password,
        username,
      })
      if (status !== 201 && status !== 200) {
        throw new Error()
      } else {
        if (data.error) {
          setError(data.error)
        } else {
          const signInData: any = await signIn('credentials', {
            redirect: false,
            email,
            password,
          })
          if (signInData?.status !== 200) {
            throw new Error()
          } else {
            if (signInData?.error) {
              return setError(signInData.error.slice(6, 50))
            } else {
              if (router.query.back) {
                router.push(`${router.query.back}`)
              } else {
                router.push('/')
              }
            }
          }
        }
      }
    } catch (e) {
      setError('Unexpected Error')
    }
    setLoading(false)
  }

  return (
    <main className="flex h-full bg-white">
      <div
        id="signup-container"
        style={{ zIndex: 2 }}
        className="px-32 pt-16 register-container pb-12 overflow-hidden"
      >
        {width >= 800 ? (
          <Image src={'/images/dLogo.svg'} height={32} width={130} alt="Logo" />
        ) : (
          <div className="relative overflow-hidden" id="login_onlyLogo">
            <OnlyLogo size={width >= 500 ? 'xl' : width >= 360 ? 'lg' : 'sm'} />
          </div>
        )}
        <p
          id="signup-title"
          className="register-title text-darkIndigo font-black text-5xl overflow-hidden pt-12 pb-4"
        >
          Sign Up
        </p>
        <p className="register-welcome text-darkIndigo opacity-60 font-normal text-base">
          Welcome!
          <br />
          Please create your account
        </p>
        <div className="pt-9 w-80 styled-input" id="signup-inputs-wrapper">
          <StyledInput
            title="Username"
            placeholder="Enter your username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="pt-6">
            <StyledInput
              title="Email"
              placeholder="Enter your email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pt-6">
            <StyledInput
              forgot={false}
              title="Password"
              placeholder="Enter password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-12" id="signup-inputs-wrapper">
            {loading ? (
              <SmallLoader xCentered={true} />
            ) : (
              <YellowButton onClick={signup} title="Login" />
            )}
          </div>
          <div className="text-darkIndigo font-semibold text-base pt-4 flex items-center">
            Already have an account?
            <Link href={`/register/login?back=${router.query.back}`}>
              <p
                style={{ color: '#38b6cc' }}
                className="cursor-pointer pl-1 font-semibold text-base"
              >
                Log In
              </p>
            </Link>
          </div>
          <p className="text-xl pt-2 font-semibold text-red-600">{error}</p>
        </div>
      </div>
      <SignupAnimation />
    </main>
  )
}
export default Signup
