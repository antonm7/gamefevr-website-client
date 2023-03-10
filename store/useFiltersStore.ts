import create from 'zustand'

interface State {
  yearRange: number[]
  genres: number[]
  consoles: number[]
  setYearRange: (yearRange: number[]) => void
  setGenres: (genres: number[]) => void
  setConsoles: (consoles: number[]) => void
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
      return { genres }
    }),
  setConsoles: (consoles) =>
    set(() => {
      return { consoles }
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
