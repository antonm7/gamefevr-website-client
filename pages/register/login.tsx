import axios from 'axios'
import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LoginAnimation from '../../components/animations/Login'
import OnlyLogo from '../../components/common/OnlyLogo'
import SmallLoader from '../../components/common/SmallLoader'
import YellowButton from '../../components/common/YellowButton'
import StyledInput from '../../components/Register/StyledInput'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [forgotEmail, setForgotEmail] = useState<string>('')
  const [forgotError, setForgotError] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)
  const [forgotPassword, setForgotPassword] = useState<boolean>(false)
  const [width] = useWindowSize()
  const router = useRouter()

  const signin = async (): Promise<void> => {
    setError('')
    setLoading(true)
    try {
      const data: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (data.status !== 200) {
        throw new Error()
      } else {
        if (data.error) {
          setError(data.error.slice(6, 50))
        } else {
          router.push('/')
        }
      }
    } catch (e) {
      setError('Login Failed, Try Again')
    }
    setLoading(false)
  }

  const sendForgotPasswordEmail = async (): Promise<void> => {
    const validateEmail = (email: string): boolean => {
      const re =
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }

    try {
      if (!validateEmail(forgotEmail)) {
        throw new Error('Please Enter Valid Email')
      } else {
        const req = await axios.post(
          '/api/user/settings/sendForgotPasswordEmail',
          {
            body: {
              email: forgotEmail,
            },
          }
        )

        if (req.status === 404) {
          throw new Error('No User Found With The Email')
        } else {
          if (req.status !== 200) {
            throw new Error('Unexpected Error, Try Again')
          } else {
            alert('Please Check Your Email')
          }
        }
      }
    } catch (e: any) {
      setLoading(false)
      setForgotError(e)
    }
  }

  return (
    <main className="flex h-screen bg-white">
      <div style={{ zIndex: 2 }} className="px-32 pt-16 register-container">
        {width >= 800 ? (
          <Image src={'/images/dLogo.svg'} height={32} width={130} alt="Logo" />
        ) : (
          <div className="relative overflow-hidden">
            <OnlyLogo size={width >= 500 ? 'xl' : width >= 360 ? 'lg' : 'sm'} />
          </div>
        )}
        <p className="register-title text-darkIndigo font-black text-5xl overflow-hidden pt-32 pb-4">
          Log In
        </p>
        <p className="register-welcome text-darkIndigo opacity-60 font-normal text-base">
          Welcome Back!
          <br />
          Please login to your account
        </p>
        <div className="pt-9 w-80 styled-input">
          {forgotPassword ? (
            <>
              <StyledInput
                title="Email"
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <div className="pt-6">
                {loading ? (
                  <SmallLoader xCentered={true} />
                ) : (
                  <YellowButton
                    onClick={() => sendForgotPasswordEmail()}
                    title="Send Email"
                  />
                )}
              </div>
              <p
                style={{ color: '#38b6cc' }}
                className="inline-block cursor-pointer pl-1 font-semibold text-base pt-2"
                onClick={() => setForgotPassword(false)}
              >
                back to login
              </p>
              <p className="text-xl pt-2 font-semibold text-red-600">
                {forgotError}
              </p>
            </>
          ) : (
            <>
              <StyledInput
                title="Email"
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pt-6">
                <StyledInput
                  onClick={() => setForgotPassword(true)}
                  forgot={true}
                  title="Password"
                  placeholder="Enter password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="pt-12">
                {loading ? (
                  <SmallLoader xCentered={true} />
                ) : (
                  <YellowButton onClick={signin} title="Login" />
                )}
              </div>
              <div className="text-darkIndigo font-semibold text-base pt-4 flex items-center">
                Don't have an account?
                <Link href={'/register/signup'}>
                  <p
                    style={{ color: '#38b6cc' }}
                    className="cursor-pointer pl-1 font-semibold text-base"
                  >
                    Sign Up
                  </p>
                </Link>
              </div>
              <p className="text-xl pt-2 font-semibold text-red-600">{error}</p>
            </>
          )}
        </div>
      </div>
      <LoginAnimation />
    </main>
  )
}
export default Login
