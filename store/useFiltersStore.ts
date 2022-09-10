import create from 'zustand'

interface State {
  yearRange: number[]
  genres: string[]
  consoles: string[]
  setYearRange: (yearRange: number[]) => void
  setGenres: (genres: string[]) => void
  setConsoles: (consoles: string[]) => void
  clearFilters: () => void
}

export const useFiltersStore = create<State>((set) => ({
  yearRange: [1990, 2023],
  genres: [],
  consoles: [],
  setYearRange: (years) =>
    set(() => {
      if (!years || years.length !== 2) {
        return { yearRange: [1990, 2023] }
      }
      return { yearRange: [...years] }
    }),
  setGenres: (genres) =>
    set(() => {
      return { genres: [...genres] }
    }),
  setConsoles: (consoles) =>
    set(() => {
      return { consoles: [...consoles] }
    }),
  clearFilters: () =>
    set(() => {
      return {
        yearRange: [1990, 2023],
        genres: [],
        consoles: [],
      }
    }),
}))
