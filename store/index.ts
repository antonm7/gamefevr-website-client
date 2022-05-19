import create from "zustand";

export const useStore = create((set:any) => ({
    isFilterOn:<boolean>false,
    games:<any>[],
    page:<number>1,
    addGames:(games:any[]) => set((state:any) => ({ games:[...state.games,...games]})),
    changeFilterVisibility:(value:boolean) => set(() => ({isFilterOn:value})),
    changePage:(value:number) => set(() => ({page:value}))
}))