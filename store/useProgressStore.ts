import create from 'zustand'

interface State {
  isAnimating: boolean
  setIsAnimating: (isAnimating: boolean) => void
}

export const useProgressStore = create<State>((set) => ({
  isAnimating: false,
  setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}))
