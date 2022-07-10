import create from 'zustand'

export const useGlobalError = create((set:any) => ({
    isVisible: false,
    text:'',
    setText: (text:string) => set(() => ({ text })),
    setIsVisible:(value:boolean) => set(() => ({isVisible:value}))
}))