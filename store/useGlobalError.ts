import create from 'zustand'

interface State {
  isVisible: boolean
  text: string
  setText: (text: string) => void
  setIsVisible: (isVisible: boolean) => void
}

export const useGlobalError = create<State>((set) => ({
  isVisible: false,
  text: '',
  setText: (text) => set(() => ({ text })),
  setIsVisible: (value) => set(() => ({ isVisible: value })),
}))
