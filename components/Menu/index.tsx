import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './Menu.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useStore } from '../../store'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export default function Menu() {
  const router = useRouter()
  const session = useSession()
  const [auth, setAuth] = useState<boolean>(false)

  const changeMenuVisibility = useStore((store) => store.changeMenuVisibility)

  useEffect(() => {
    if (session.status === 'authenticated') {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [session.status])

  const DynamicSession = () => {
    if (auth) {
      if (router.pathname === '/profile/[id]' && JSON.stringify(router.query.id) == JSON.stringify(session.data?.user.userId)) {
        return (
          <div
            style={{ width: 130, cursor: 'pointer' }}
            className="hover:bg-[#38b6cc] rounded-lg"
            onClick={() => changeMenuVisibility(false)}
          >
            <div
              onClick={() => signOut()}
              style={{ borderWidth: 0.5, borderColor: '#38b6cc' }}
              className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
            >
              <p
                style={{ lineHeight: '2.75rem' }}
                className="text-white font-regular text-xs text-center cursor-pointer"
              >
                Logout
              </p>
            </div>
          </div>
        )
      } else {
        return (
          <div
            style={{ width: 130, cursor: 'pointer' }}
            className="hover:bg-[#ef626d] rounded-lg"
            onClick={() => changeMenuVisibility(false)}
          >
            <Link href={`/profile/${session?.data?.user?.userId}`}>
              <div
                style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
                className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
              >
                <p
                  style={{ lineHeight: '2.75rem' }}
                  className="text-white font-regular text-xs text-center cursor-pointer"
                >
                  Profile
                </p>
              </div>
            </Link>
          </div>
        )
      }
    } else {
      return (
        <div
          style={{ width: 130, cursor: 'pointer' }}
          className="hover:bg-[#ef626d] rounded-lg"
          onClick={() => changeMenuVisibility(false)}
        >
          <Link href="/register/login">
            <div
              style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
              className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
            >
              <p
                style={{ lineHeight: '2.75rem' }}
                className="text-white font-regular text-xs text-center cursor-pointer"
              >
                Register
              </p>
            </div>
          </Link>
        </div>
      )
    }
  }
  return (
    <div id={styles.menu}>
      <div className="flex flex-col items-center pt-12">
        <FontAwesomeIcon
          icon={faXmark as IconProp}
          id={styles.icon}
          onClick={() => changeMenuVisibility(false)}
        />
        <div>
          <Image src={'/images/logo-dark.webp'} height={60} width={200} alt="Logo" />
        </div>
        <div className="flex flex-col pt-0 pb-4">
          <Link href="/">
            <p
              id={styles.link}
              className={`text-white font-semibold cursor-pointer text-lg ${router.pathname === '/' ? 'active-link ' : ''
                }`}
              onClick={() => changeMenuVisibility(false)}
            >
              Home
            </p>
          </Link>
          <p
            id={styles.link}
            className={`opacity-50 text-white font-semibold cursor-pointer text-lg ${router.pathname === '/reviews' ? 'active-link ' : ''
              }`}
          >
            Reviews - Comming Soon
          </p>
        </div>
        <DynamicSession />
      </div>
    </div>
  )
}
