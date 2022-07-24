import create from "zustand";

export const useStore = create((set: any) => ({
  isFilterOn: <boolean>false,
  games: <any[]>[],
  page: <number>1,
  gameName: <string>"",
  addGames: (arr: any[]) =>
    set((state: any) => ({ games: [...state.games, ...arr] })),
  clearGames: () => set(() => ({ games: [] })),
  addPage: () => set((state: any) => ({ page: (state.page += 1) })),
  clearPage: () => set(() => ({ page: 1 })),
  changeFilterVisibility: (value: boolean) =>
    set(() => ({ isFilterOn: value })),
  changeGameName: (value: string) => set(() => ({ gameName: value })),
}));

export * from "./useProgressStore";
export * from "./useGlobalError";
