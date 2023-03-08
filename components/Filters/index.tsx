
import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useFiltersStore, useStore } from '../../store'
import YellowButton from '../common/YellowButton'
import { setCookie } from 'cookies-next'
import RangeContainer from './RangeContainer'
import Consoles from './Consoles'
import Genres from './Genres'
import styles from './index.module.scss'

export default function Filters() {
  const [yearRange, changeYearRange] = useState<number[]>([1990, 2023])
  const [selectedGenres, changeSelectedGenres] = useState<number[]>([])
  const [selectedConsoles, changeSelectedConsoles] = useState<number[]>([])
  const store = useStore()
  const filtersStore = useFiltersStore()

  const reset = (): void => {
    changeSelectedConsoles([])
    changeSelectedGenres([])
    changeYearRange([1990, 2023])
    filtersStore.setConsoles([])
    filtersStore.setGenres([])
    filtersStore.setYearRange([1990, 2023])
  }

  const search = (): void => {
    setCookie('prevRoute', '/')
    filtersStore.setConsoles(selectedConsoles)
    filtersStore.setGenres(selectedGenres)
    filtersStore.setYearRange(yearRange)
    store.changeFilterVisibility(false)
  }

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      e.key === 'Escape' ? store.changeFilterVisibility(false) : null
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  useEffect(() => {
    changeYearRange(filtersStore.yearRange)
    changeSelectedGenres(filtersStore.genres)
    changeSelectedConsoles(filtersStore.consoles)
  }, [])

  const MemoizedRangeContainer = useMemo(() => {
    return <RangeContainer updateYearRange={(val: number[]) => changeYearRange(val)} />
  }, [])

  const MemoizedConsoles = useMemo(() => {
    return <Consoles updateSelectedConsoles={(value: number[]) => changeSelectedConsoles(value)} />
  }, [])

  const MemoizedGenres = useMemo(() => {
    return <Genres updateSelectedGenres={(value: number[]) => changeSelectedGenres(value)} />
  }, [])

  return (
    <div id={styles.filters_wrapper} className="fixed z-40 rounded-lg py-6 px-24 w-5/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div id={styles.filters_bg}></div>
      <FontAwesomeIcon
        icon={faXmark}
        className="h-8 float-right cursor-pointer absolute right-8"
        onClick={() => store.changeFilterVisibility(false)}
      />
      <div>
        <h1 className='text-black font-bold text-4xl text-center pb-9'>Genres</h1>
        {MemoizedGenres}
      </div>
      <div className='flex pt-20' id={styles.second_row_container}>
        <div className={`${styles.white_box} w-2/4 mr-7`}>
          <h1 className='text-black font-bold text-4xl text-center pb-9'>Consoles</h1>
          {MemoizedConsoles}
        </div>
        <div className={`${styles.white_box} w-2/4 mr-7`} id={styles.release_box}>
          <h1 className="text-4xl font-semibold text-center pb-9">
            Release Date
          </h1>
          {MemoizedRangeContainer}
        </div>
      </div>
      <div className="flex flex-col items-center pt-10 h-auto overflow-hidden">
        <div className='w-44'>
          <YellowButton
            active={true}
            onClick={() => search()}
            title={'Apply'}
          />
        </div>
        <h1
          onClick={() => reset()}
          className="text-sm pt-2 underline inline-block cursor-pointer opacity-70 hover:opacity-100"
        >
          reset filters
        </h1>
      </div>
    </div>
  )
}
