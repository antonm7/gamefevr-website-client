import create from 'zustand'

interface State {
  yearRange: number[]
  genres: string | number[]
  consoles: number[]
  setYearRange: (yearRange: number[]) => void
  setGenres: (genres: number[]) => void
  setConsoles: (consoles: number[]) => void
  clearFilters: () => void
}

export const useFiltersStore = create<State>((set) => ({
  yearRange: [1990, 2022],
  genres: [],
  consoles: [],
  setYearRange: (years) =>
    set(() => {
      if (!years || years.length !== 2) {
        return { yearRange: [1990, 2022] }
      }
      return { yearRange: [...years] }
    }),
  setGenres: (genres) =>
    set(() => {
      if (typeof genres === 'string') {
        return { genres: [parseInt(genres)] }
      } else {
        let loopedArr: number[] = []
        for (const key in genres) {
          loopedArr = [...loopedArr, genres[key]]
        }
        return { genres: loopedArr }
      }
    }),
  setConsoles: (consoles) =>
    set(() => {
      if (typeof consoles === 'string') {
        return { consoles: [parseInt(consoles)] }
      } else {
        let loopedArr: number[] = []
        for (const key in consoles) {
          loopedArr = [...loopedArr, consoles[key]]
        }
        return { consoles: loopedArr }
      }
    }),
  clearFilters: () =>
    set(() => {
      return {
        yearRange: [1990, 2022],
        genres: [],
        consoles: [],
      }
    }),
}))
