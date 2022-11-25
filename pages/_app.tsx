import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import '../styles/responsive.css'
import '../styles/animation.css'
import { setCookie } from 'cookies-next'
import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Progress from '../components/progress/Progress'
import {
  useFiltersStore,
  useGlobalError,
  useProgressStore,
  useStore,
} from '../store'
import GlobalError from '../components/common/GlobalError/Index'
import Menu from '../components/Menu'

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const changeGameName = useStore((state) => state.changeGameName)
  const filtersStore = useFiltersStore((state) => state)
  const setIsAnimating = useProgressStore((state) => state.setIsAnimating)
  const isAnimating = useProgressStore((state) => state.isAnimating)
  const isVisible = useGlobalError((state) => state.isVisible)
  const menuVisibility = useStore((state) => state.menuVisibility)
  const type = useGlobalError((state) => state.type)
  const router: any = useRouter()

  const [globalErrorVisibility, setGlobalErrorVisibilit] =
    useState<boolean>(false)

  useEffect(() => {
    const handleStart = () => {
      setIsAnimating(true)
    }

    const handleStop = () => {
      setIsAnimating(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    setCookie('prevRoute', router.pathname)

    //follow any changes to the query, and update the store
    //because the filters component takes data from the store and not the query
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  useEffect(() => {
    if (router.pathname === '/search') {
      //updateing consoles
      const updatedConsoles = (): string[] => {
        if (!router.query.consoles) {
          return []
        } else if (typeof router.query.consoles === 'string') {
          return [router.query.consoles]
        } else {
          return router.query.consoles
        }
      }
      filtersStore.setConsoles(updatedConsoles())

      //updating genres
      const updatedGenres = (): string[] => {
        if (!router.query.genres) {
          return []
        } else if (typeof router.query.genres === 'string') {
          return [router.query.genres]
        } else {
          return router.query.genres
        }
      }
      filtersStore.setGenres(updatedGenres())

      //updating years
      const updatedYears = (): number[] => {
        if (router.query.yearRange && !Array.isArray(router.query.yearRange)) {
          return [1990, 2023]
        }
        if (!router.query.yearRange || router.query.yearRange.length !== 2) {
          return [1990, 2023]
        } else {
          return router.query.yearRange
        }
      }
      filtersStore.setYearRange(updatedYears())

      changeGameName(router.query.search ? router.query.search : '')
    }
  }, [router.query])

  useEffect(() => {
    setGlobalErrorVisibilit(isVisible)
  }, [isVisible])

  return (
    <>
      <GlobalError propsType={type} isVisible={globalErrorVisibility} />
      <Progress isAnimating={isAnimating} />
      <SessionProvider session={session}>
        {menuVisibility ? <Menu /> : null}
        <div className="bg-main-blue h-screen">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}

export default MyApp
