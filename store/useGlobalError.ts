import create from 'zustand'

interface State {
  isVisible: boolean
  text: string
  type: 'error' | 'warning' | 'request' | undefined
  answer: 'yes' | 'no' | undefined
  setAnswer: (value: 'yes' | 'no' | undefined) => void
  setType: (text: 'error' | 'warning' | 'request' | undefined) => void
  setText: (text: string) => void
  setIsVisible: (isVisible: boolean) => void
  closeRequest: () => void
}

export const useGlobalError = create<State>((set) => ({
  isVisible: false,
  text: '',
  type: undefined,
  answer: undefined,
  setAnswer: (value) => set(() => ({ answer: value })),
  setText: (text) => set(() => ({ text })),
  setIsVisible: (value) => set(() => ({ isVisible: value })),
  setType: (value) => set(() => ({ type: value })),
  closeRequest: () =>
    set(() => ({
      isVisible: false,
      text: '',
      type: undefined,
      answer: undefined,
    })),
}))
