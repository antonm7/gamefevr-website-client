import create from "zustand";

export const useStore = create((set:any) => ({
    isFilterOn:<boolean>false,
    changeFilterVisibility:(value:boolean) => set(() => ({isFilterOn:value}))
}))