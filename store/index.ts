import create from "zustand";

export const useStore = create((set:any) => ({
    isFilterOn:<boolean>false,
    games:<any>[],
    addGames:(games:any[]) => set((state:any) => ({ games:[...state.games,...games]})),
    changeFilterVisibility:(value:boolean) => set(() => ({isFilterOn:value}))
}))