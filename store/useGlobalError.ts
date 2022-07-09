import create from 'zustand'

export const useGlobalError = create((set:any) => ({
    isVisible: false,
    setIsVisible:(value:boolean) => set(() => ({isVisible:value}))
}))