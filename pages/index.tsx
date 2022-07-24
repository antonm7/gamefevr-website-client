import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Car from '../components/animations/Car'
import SearchButton from '../components/common/SearchButton'
import SearchInput from '../components/common/SearchInput'
import Filters from '../components/Filters'
import Navbar from '../components/Navbar'
import { useFiltersStore, useStore } from '../store'

const Home: NextPage = () => {
  const router = useRouter()
  const store = useStore()
  const filtersStore = useFiltersStore()

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
            filtersStore.yearRange[1] === 2022
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
            filtersStore.yearRange[1] === 2022
              ? []
              : filtersStore.yearRange,
        },
      })
    }
    store.changeGameName('')
  }

  return (
    <div>
      <Head>
        <title>GameFevr</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700;900&display=swap" rel="stylesheet" /> */}
      </Head>
      <div className="flex flex-col">
        <main id="home" className="h-screen w-screen flex relative">
          {store.isFilterOn ? <Filters /> : null}
          <Navbar />
          <div className="w-full flex flex-col">
            <div className="z-10 bg-transparent h-full">
              <h1 className="text-white font-black text-7xl overflow-hidden	pt-40 text-center">
                Search The Best
                <br /> Game For You
              </h1>
              <div className="flex flex-col items-center">
                <div className="flex pt-8 justify-center">
                  <SearchInput />
                  <div className="w-24 h-16 rounded-lg ml-4">
                    <SearchButton onClick={() => navigate()} />
                  </div>
                </div>
              </div>
            </div>
            <Car />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
