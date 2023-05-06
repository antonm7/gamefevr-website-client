import create from 'zustand'
import { ShortGame } from '../types'

interface State {
  isFilterOn: boolean
  menuVisibility: boolean
  games: ShortGame[]
  page: number
  gameName: string
  count: number
  reload: boolean
  activateReload: (value: boolean) => void
  addGames: (games: ShortGame[]) => void
  clearGames: () => void
  addPage: () => void
  clearPage: () => void
  changeFilterVisibility: (isFilterOn: boolean) => void
  changeMenuVisibility: (menuVisibility: boolean) => void
  changeGameName: (gameName: any) => void
  setCount: (count: number) => void
}

export const useStore = create<State>((set) => ({
  isFilterOn: <boolean>false,
  menuVisibility: <boolean>false,
  games: <ShortGame[]>[],
  page: <number>1,
  gameName: <string>'',
  count: <number>0,
  reload: false,
  activateReload: (value: boolean) => set((state) => {
    if (value) {
      return { reload: value, page: 1, games: [] }
    } else {
      return { reload: value, page: state.page, games: state.games }
    }
  }),
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
  changeMenuVisibility: (value: boolean) =>
    set(() => ({ menuVisibility: value })),
  changeGameName: (value: string) => set(() => ({ gameName: value })),
  setCount: (value: number) => set(() => ({ count: value })),
}))

export * from './useProgressStore'
export * from './useFiltersStore'
