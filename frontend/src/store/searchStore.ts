import { create } from "zustand";

interface SearchState {
  displayCount: number;
  setDisplayCount: (count: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  displayCount: 8,
  setDisplayCount: (count) => set({ displayCount: count }),
}));
