import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import SmallSearchInput from './common/SmallSearchInput'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useWindowSize from '../lib/functions/hooks/useWindowSize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const router = useRouter()
  const session = useSession()
  const [auth, setAuth] = useState<boolean>(false)
  const [width] = useWindowSize()

  useEffect(() => {
    if (session.status === 'authenticated') {
      setAuth(true)
    } else {
      setAuth(false)
    }
  }, [session.status])

  const DynamicSession = () => {
    if (auth) {
      if (router.pathname === '/profile/[id]') {
        return (
          <div
            style={{ width: 130, cursor: 'pointer' }}
            className="hover:bg-[#38b6cc] rounded-lg"
          >
            <div
              onClick={() => signOut()}
              style={{ borderWidth: 0.5, borderColor: '#38b6cc' }}
              className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
            >
              <p
                style={{ lineHeight: '2.75rem' }}
                className="text-white font-regular text-sm text-center cursor-pointer"
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
          >
            <Link href={`/profile/${session?.data?.user?.userId}`}>
              <div
                style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
                className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
              >
                <p
                  style={{ lineHeight: '2.75rem' }}
                  className="text-white font-regular text-sm text-center cursor-pointer"
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
        >
          <Link href="/register/login">
            <div
              style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
              className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
            >
              <p
                style={{ lineHeight: '2.75rem' }}
                className="text-white font-regular text-sm text-center cursor-pointer"
              >
                Register
              </p>
            </div>
          </Link>
        </div>
      )
    }
  }

  if (router.route === '/') {
    return (
      <div className="absolute h-20 w-full z-30 px-20">
        <div
          className="h-full w-full flex justify-between pt-4 px-20 items-center"
          id="navbar"
        >
          <div style={{ marginTop: 7 }}>
            <Image
              src={'/images/Logo.svg'}
              height={32}
              width={130}
              alt="Logo"
            />
          </div>
          <div className="flex pt-0">
            <Link href="/">
              <p
                className={`text-white font-semibold cursor-pointer text-sm ${
                  router.pathname === '/' ? 'active-link ' : ''
                }`}
              >
                Home
              </p>
            </Link>
            <Link href="/">
              <p
                className={`text-white mx-8 font-semibold cursor-pointer text-sm ${
                  router.pathname === '/explore' ? 'active-link ' : ''
                }`}
              >
                Explore
              </p>
            </Link>
            <Link href="/">
              <p
                className={`text-white font-semibold cursor-pointer text-sm ${
                  router.pathname === '/reviews' ? 'active-link ' : ''
                }`}
              >
                Reviews
              </p>
            </Link>
          </div>
          <DynamicSession />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={` ${
          width > 1024 ? 'h-20' : 'h-50'
        } w-full  z-30 overflow-hidden`}
      >
        {width > 1024 ? (
          <div
            className="h-full w-full flex justify-between pt-4 px-40 items-center"
            id="navbar"
          >
            <div className="flex items-center">
              <div style={{ marginTop: 7 }}>
                <Image
                  src={'/images/Logo.svg'}
                  height={32}
                  width={130}
                  alt="Logo"
                />
              </div>
              <div id="navbar_links_wrapper" className="flex pl-16">
                <Link href="/">
                  <p
                    className={`text-white font-semibold cursor-pointer text-sm ${
                      router.pathname === '/' ? 'active-link ' : ''
                    }`}
                  >
                    Home
                  </p>
                </Link>
                <Link href="/">
                  <p
                    className={`text-white mx-8 font-semibold cursor-pointer text-sm ${
                      router.pathname === '/search' ? 'active-link ' : ''
                    }`}
                  >
                    Explore
                  </p>
                </Link>
                <Link href="/">
                  <p
                    className={`text-white font-semibold cursor-pointer text-sm ${
                      router.pathname === '/reviews' ? 'active-link ' : ''
                    }`}
                  >
                    Reviews
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div id="small_search_input_wrapper" className="mr-10">
                <SmallSearchInput />
              </div>
              <DynamicSession />
            </div>
          </div>
        ) : width > 640 ? (
          <div className="h-full w-full flex flex-col pt-4 px-20" id="navbar">
            <div className="flex items-center justify-between overflow-hidden">
              <div style={{ marginTop: 7 }}>
                <Image
                  src={'/images/Logo.svg'}
                  height={32}
                  width={130}
                  alt="Logo"
                />
              </div>
              <div id="navbar_links_wrapper" className="flex pl-16">
                <Link href="/">
                  <p
                    className={`text-white font-semibold cursor-pointer text-sm ${
                      router.pathname === '/' ? 'active-link ' : ''
                    }`}
                  >
                    Home
                  </p>
                </Link>
                <Link href="/">
                  <p
                    className={`text-white mx-8 font-semibold cursor-pointer text-sm ${
                      router.pathname === '/search' ? 'active-link ' : ''
                    }`}
                  >
                    Explore
                  </p>
                </Link>
                <Link href="/">
                  <p
                    className={`text-white font-semibold cursor-pointer text-sm ${
                      router.pathname === '/reviews' ? 'active-link ' : ''
                    }`}
                  >
                    Reviews
                  </p>
                </Link>
              </div>
              <DynamicSession />
            </div>
            <div className="flex items-center overflow-hidden h-50">
              <div id="small_search_input_wrapper">
                <SmallSearchInput />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col pt-4 px-20" id="navbar">
            <div className="flex items-center justify-between overflow-hidden h-11">
              <div style={{ marginTop: 7 }}>
                <Image
                  src={'/images/Logo.svg'}
                  height={32}
                  width={130}
                  alt="Logo"
                />
              </div>
              <FontAwesomeIcon
                icon={faBars}
                className="h-5 text-white cursor-pointer"
              />
            </div>
            <div className="flex items-center overflow-hidden h-50">
              <div id="small_search_input_wrapper">
                <SmallSearchInput />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
