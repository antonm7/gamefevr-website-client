import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LoginAnimation from '../../components/animations/Login'
import SmallLoader from '../../components/common/SmallLoader'
import YellowButton from '../../components/common/YellowButton'
import StyledInput from '../../components/Register/StyledInput'

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const signin = async () => {
    setError('')
    setLoading(true)
    try {
      const data: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (data?.status !== 200) {
        throw new Error()
      } else {
        if (data?.error) {
          return setError(data.error.slice(6, 50))
        } else {
          router.push('/')
        }
      }
    } catch (e) {
      setError('Login Failed, Try Again')
    }
    setLoading(false)
  }

  return (
    <main className="flex h-screen bg-white">
      <div style={{ zIndex: 2 }} className="px-32 pt-16">
        <Image src={'/images/dLogo.svg'} height={32} width={130} alt="Logo" />
        <p className="text-darkIndigo font-black text-5xl overflow-hidden pt-32 pb-4">
          Log In
        </p>
        <p className="text-darkIndigo opacity-60 font-normal text-base">
          Welcome Back!
          <br />
          Please login to your account
        </p>
        <div className="pt-9 w-80">
          <StyledInput
            title="Email"
            placeholder="Enter your email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="pt-6">
            <StyledInput
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
        </div>
      </div>
      <LoginAnimation />
    </main>
  )
}
export default Login
