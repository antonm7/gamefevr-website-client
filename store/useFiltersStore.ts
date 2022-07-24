import create from 'zustand'

export const useFiltersStore = create((set: any) => ({
  yearRange: [1990, 2022],
  genres: [],
  consoles: [],
  setYearRange: (years: number[]) =>
    set(() => {
      if (!years || years.length !== 2) {
        return { yearRange: [1990, 2022] }
      }
      return { yearRange: [...years] }
    }),
  setGenres: (genres: number[]) =>
    set((state: any) => {
      if (typeof genres === 'string') {
        return { genres: [parseInt(genres)] }
      } else {
        let loopedArr: number[] = []
        for (const key in genres) {
          loopedArr = [genres[key]]
        }
        return { genres: loopedArr }
      }
    }),
  setConsoles: (consoles: number[]) =>
    set((state: any) => {
      if (typeof consoles === 'string') {
        return { consoles: [parseInt(consoles)] }
      } else {
        let loopedArr: number[] = []
        for (const key in consoles) {
          loopedArr = [...loopedArr, consoles[key]]
          loopedArr.push(consoles[key])
        }
        return { consoles: loopedArr }
      }
    }),
}))
