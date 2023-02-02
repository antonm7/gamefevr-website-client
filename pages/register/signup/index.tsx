import axios from 'axios'
import { NextPage } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import SignupAnimation from '../../../components/animations/Signup'
import OnlyLogo from '../../../components/common/OnlyLogo'
import SmallLoader from '../../../components/common/SmallLoader'
import YellowButton from '../../../components/common/YellowButton'
import StyledInput from '../../../components/Register/StyledInput'
import styles from './index.module.scss'

const Signup: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [succsess, setSuccsess] = useState<string>('')
  const router = useRouter()

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
              setSuccsess('Succesfully created account!')
              if (router.query.back) {
                router.push(`${router.query.back}`)
              } else {
                console.log('ree')
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
    <main className="y-10 flex h-full bg-white responsive_wrapper">
      <div
        style={{ zIndex: 2 }}
        className="pt-16 pb-12 overflow-hidden"
        id={styles.login_container}
      >
        <OnlyLogo />
        <p className="text-darkIndigo font-black text-5xl overflow-hidden pt-32 pb-4" id={styles.login_title}>
          Sign Up
        </p>
        <p className=" text-darkIndigo opacity-60 font-normal text-base">
          Welcome!
          <br />
          Please create your account
        </p>
        <div className="pt-9 w-80" id={styles.login_inputs_container}>
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
            <Link href={router.query.back ? `/register/login?back=${router.query.back}` : '/register/login'}>
              <p
                style={{ color: '#38b6cc' }}
                className="cursor-pointer pl-1 font-semibold text-base"
              >
                Log In
              </p>
            </Link>
          </div>
          <p className="text-xl pt-2 font-semibold text-red-600">{error}</p>
          <p className="text-xl pt-2 font-semibold text-green-600">{succsess}</p>
        </div>
      </div>
      <SignupAnimation />
    </main>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {
      }
    }
  }
}

export default Signup
