import '../styles/index.css'
import '../styles/global.scss'
import '../styles/responsive.scss'
import '../styles/animation.scss'
import 'tailwindcss/tailwind.css'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Progress from '../components/progress/Progress'
import {
  useFiltersStore,
  useProgressStore,
  useStore,
} from '../store'
import GlobalError from '../components/common/GlobalError/Index'
import Menu from '../components/Menu'

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const changeGameName = useStore(state => state.changeGameName)
  const filtersStore = useFiltersStore(state => state)
  const setIsAnimating = useProgressStore(state => state.setIsAnimating)
  const isAnimating = useProgressStore(state => state.isAnimating)
  const menuVisibility = useStore(state => state.menuVisibility)
  const router: any = useRouter()

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

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  const getUpdatedState = (paramName: string, defaultValue: any): any => {
    if (!router.query[paramName]) {
      return defaultValue;
    } else if (Array.isArray(router.query[paramName])) {
      return router.query[paramName];
    } else {
      return [router.query[paramName]];
    }
  };

  useEffect(() => {
    if (router.pathname === '/search') {
      const updatedConsoles = getUpdatedState('consoles', []);
      filtersStore.setConsoles(updatedConsoles);

      const updatedGenres = getUpdatedState('genres', []);
      filtersStore.setGenres(updatedGenres);

      const updatedYears = getUpdatedState('yearRange', [1990, 2023]);
      filtersStore.setYearRange(updatedYears);

      changeGameName(router.query.search ? router.query.search : '');
    }
  }, [router.query]);

  return (
    <>
      <GlobalError />
      <Progress isAnimating={isAnimating} />
      <SessionProvider session={session}>
        {menuVisibility ? <Menu /> : null}
        <div className={`bg-main-blue ${router.pathname == '/' ? 'h-full' : 'h-full'} min-h-full`}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}

export default MyApp
