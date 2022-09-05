import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import '../styles/responsive.css'
import '../styles/animation.css'
import { setCookie } from 'cookies-next'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Progress from '../components/progress/Progress'
import { useGlobalError, useProgressStore } from '../store'
import GlobalError from '../components/common/GlobalError/Index'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const setIsAnimating = useProgressStore((state) => state.setIsAnimating)
  const isAnimating = useProgressStore((state) => state.isAnimating)
  const isVisible = useGlobalError((state) => state.isVisible)
  const type = useGlobalError((state) => state.type)
  const router = useRouter()

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
      // console.log('changeddedede', router.query)
      // filtersStore.setConsoles(
      //   router.query.consoles ? router.query.consoles : []
      // )
      // filtersStore.setGenres(router.query.genres ? router.query.genres : [])
      // filtersStore.setYearRange(
      //   router.query.yearRange ? router.query.yearRange : []
      // )
      // changeGameName(router.query.search ? router.query.search : '')
    }
  }, [router.query])

  return (
    <>
      <GlobalError type={type} isVisible={isVisible} />
      <Progress isAnimating={isAnimating} />
      <SessionProvider session={session}>
        <div className="bg-main-blue">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}

export default MyApp
