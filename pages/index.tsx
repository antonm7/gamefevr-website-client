import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Car from '../components/animations/Car'
import ResponsiveAnimations from '../components/animations/ResponsiveAnimations'
import SearchButton from '../components/common/SearchButton'
import SearchInput from '../components/common/SearchInput'
import Filters from '../components/Filters'
import Navbar from '../components/Navbar'
import useWindowSize from '../lib/functions/hooks/useWindowSize'
import { useFiltersStore, useStore } from '../store'
import styles from './index.module.scss'

const Home: NextPage = () => {
  const router = useRouter()
  const store = useStore()
  const filtersStore = useFiltersStore()
  const [width] = useWindowSize()

  const navigate = () => {
    if (store.gameName.length > 0) {
      router.push({
        pathname: '/search',
        query: {
          search: store.gameName,
          genres: filtersStore.genres,
          consoles: filtersStore.consoles,
          yearRange:
            filtersStore.yearRange[0] === 1990 &&
              filtersStore.yearRange[1] === 2023
              ? []
              : filtersStore.yearRange,
        },
      })
    } else {
      router.push({
        pathname: '/search',
        query: {
          genres: filtersStore.genres,
          consoles: filtersStore.consoles,
          yearRange:
            filtersStore.yearRange[0] === 1990 &&
              filtersStore.yearRange[1] === 2023
              ? []
              : filtersStore.yearRange,
        },
      })
    }
    store.changeGameName('')
  }

  return (
    <>
      <Head>
        <title>GameFevr</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id={styles.container} className="flex flex-col">
        <main className="min-h-screen w-screen flex flex-col relative">
          {store.isFilterOn ? <Filters /> : null}
          <Navbar />
          <div className="max-w-full w-full flex flex-col overflow-hidden" style={{ minHeight: '5rem' }}>
            <div className="z-10 bg-transparent h-full overflow-hidden pt-12">
              <h1 id={styles.titles_container} className="text-white 
                font-black text-7xl overflow-hidden	pt-20
                text-center">
                Search The Best <br />
                <span className="text-cool-blue">Game For You</span>
              </h1>
              <div className="flex flex-col items-center justify-between">
                <div
                  className="flex pt-8 justify-center" id={styles.search_input_wrapper}>
                  <SearchInput />
                  <div id={styles.search_button_wrapper} className="w-24 h-16 rounded-lg ml-4">
                    <SearchButton onClick={() => navigate()} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden" style={{ minHeight: '20rem' }}>
            {width > 640 ? null : <ResponsiveAnimations />}
            {width > 640 ? <Car /> : null}
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
