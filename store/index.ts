import create from 'zustand'
import { ShortGame } from '../types'

interface State {
  isFilterOn: boolean
  games: ShortGame[]
  page: number
  gameName: string
  count: number
  addGames: (games: ShortGame[]) => void
  clearGames: () => void
  addPage: () => void
  clearPage: () => void
  changeFilterVisibility: (isFilterOn: boolean) => void
  changeGameName: (gameName: string) => void
  setCount: (count: number) => void
}

export const useStore = create<State>((set) => ({
  isFilterOn: <boolean>false,
  games: <ShortGame[]>[],
  page: <number>1,
  gameName: <string>'',
  count: <number>0,
  addGames: (arr: ShortGame[]) =>
    set((state) => {
      return { games: [...state.games, ...arr] }
    }),
  clearGames: () =>
    set(() => {
      return { games: [] }
    }),
  addPage: () => set((state) => ({ page: (state.page += 1) })),
  clearPage: () => set(() => ({ page: 1 })),
  changeFilterVisibility: (value: boolean) =>
    set(() => ({ isFilterOn: value })),
  changeGameName: (value: string) => set(() => ({ gameName: value })),
  setCount: (value: number) => set(() => ({ count: value })),
}))

export * from './useProgressStore'
export * from './useGlobalError'
export * from './useFiltersStore'
