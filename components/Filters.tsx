import { genres, parentConsoles } from '../lib/staticData'
import { ElementDescription } from '../types'
import SelectBox from './common/SelectBox'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useFiltersStore, useStore } from '../store'
import YellowButton from './common/YellowButton'
import { setCookie } from 'cookies-next'

export default function Filters() {
  const [yearRange, changeYearRange] = useState<number[]>([1990, 2023])
  const [selectedGenres, changeSelectedGenres] = useState<string[]>([])
  const [selectedConsoles, changeSelectedConsoles] = useState<string[]>([])
  const store = useStore()
  const filtersStore = useFiltersStore()

  const updateGenres = (index: string): void => {
    if (selectedGenres.includes(index)) {
      //removes
      changeSelectedGenres(selectedGenres.filter((genre) => genre !== index))
    } else {
      //adds
      changeSelectedGenres([...selectedGenres, index])
    }
  }

  const updatedConsoles = (index: string): void => {
    if (selectedConsoles.includes(index)) {
      //removes
      changeSelectedConsoles(selectedConsoles.filter((i) => i !== index))
    } else {
      //adds
      console.log('thats the index', index)
      changeSelectedConsoles((old) => [...old, index])
    }
  }

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
  //close filters on esc keypress
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      e.key === '27' ? store.changeFilterVisibility(false) : null
    }
    document.addEventListener('keydown', keyDownHandler)
    // clean up
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  useEffect(() => {
    changeYearRange(filtersStore.yearRange)
    changeSelectedGenres(filtersStore.genres)
    changeSelectedConsoles(filtersStore.consoles)
  }, [])

  return (
    <div
      id="filters"
      className="fixed z-40 rounded-lg p-6 w-4/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div id="filters-bg"></div>
      <FontAwesomeIcon
        icon={faXmark}
        className="h-8 float-right cursor-pointer"
        onClick={() => store.changeFilterVisibility(false)}
      />
      <h1 className="text-3xl truncate font-semibold text-center">Genres</h1>
      <div className="px-6">
        <div className="bg-white p-4 w-5/6 mt-6 mx-auto rounded-md filters-column-shadow">
          <div className="flex h-auto items-center justify-center flex-row flex-wrap">
            {genres.map((genre: ElementDescription, index: number) => {
              return (
                <SelectBox
                  isSelected={selectedGenres.includes(JSON.stringify(genre.id))}
                  onClick={() => updateGenres(JSON.stringify(genre.id))}
                  key={index}
                  title={genre.name}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div id="filters_lower_line" className="flex justify-between w-5/6">
          <div id="filters_consoles_wrapper" className="py-6 w-2/4 px-6">
            <h1 className="text-3xl truncate font-semibold text-center">
              Consoles
            </h1>
            <div className="bg-white p-4 mt-6 mx-auto h-auto rounded-md filters-column-shadow">
              <div className="flex h-auto items-center justify-center flex-row flex-wrap ">
                {parentConsoles.map(
                  (console: ElementDescription, index: number) => (
                    <SelectBox
                      isSelected={selectedConsoles.includes(
                        JSON.stringify(console.id)
                      )}
                      coolBlue={true}
                      onClick={() =>
                        updatedConsoles(JSON.stringify(console.id))
                      }
                      key={JSON.stringify(index)}
                      title={console.name}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div id="filters_release_wrapper" className="w-2/4 ml-12 p-6">
            <h1 className="text-3xl truncate font-semibold text-center ">
              Release Date
            </h1>
            <div className="bg-white h-52 flex flex-col items-center justify-center rounded-md filters-column-shadow mt-6">
              <div className="flex flex-row justify-between pb-8 w-5/6">
                <div
                  className="w-16 h-10 border flex items-center justify-center rounded-lg"
                  style={{ border: '1px solid #c9c9c9' }}
                >
                  <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                    {yearRange[0]}
                  </p>
                </div>
                <div
                  className="w-16 h-10 border flex items-center justify-center rounded-lg"
                  style={{ border: '1px solid #c9c9c9' }}
                >
                  <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                    {yearRange[1]}
                  </p>
                </div>
              </div>
              <Range
                trackStyle={[{ backgroundColor: '#dd5054' }]}
                activeDotStyle={{
                  backgroundColor: '#dd5054 ',
                  outline: 'none',
                }}
                handleStyle={[
                  {
                    backgroundColor: 'white',
                    borderColor: '#dd5054',
                    outline: 'none',
                  },
                  { backgroundColor: 'white', borderColor: '#dd5054' },
                ]}
                style={{ width: '83%' }}
                min={1990}
                max={2023}
                value={yearRange}
                onChange={changeYearRange}
              />
            </div>
          </div>
        </div>
        <div className="text-center h-auto overflow-hidden w-44  mt-12">
          <YellowButton
            active={true}
            onClick={() => search()}
            title={'Apply'}
          />
          <h1
            onClick={() => reset()}
            className="text-sm pt-2 underline inline-block cursor-pointer opacity-70 hover:opacity-100"
          >
            reset filters
          </h1>
        </div>
      </div>
    </div>
  )
}
