import { ObjectId } from 'bson'
import create from 'zustand'

interface State {
  isVisible: boolean
  text: string
  type: 'error' | 'warning' | 'request' | 'success' | undefined
  answer: 'yes' | 'no' | undefined
  id: ObjectId | null
  setAnswer: (value: 'yes' | 'no' | undefined) => void
  setId: (value: ObjectId) => void
  setType: (text: 'error' | 'warning' | 'request' | 'success' | undefined) => void
  setText: (text: string) => void
  setIsVisible: (isVisible: boolean) => void
  closeRequest: () => void
}

export const useGlobalError = create<State>((set) => ({
  isVisible: false,
  text: '',
  type: undefined,
  answer: undefined,
  id: null,
  setId: (value) => set(() => ({ id: value })),
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
      id: null
    })),
}))
