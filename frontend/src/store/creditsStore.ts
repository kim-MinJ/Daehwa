// src/store/creditsStore.ts
import { create } from "zustand";
import { Credits } from "@/types/movie";
import { DB } from "@/utils/indexedDB";

interface CreditsState {
  creditsMap: Record<number, Credits | null>;
  isBackgroundFetched: boolean;
  isBackgroundFetching: boolean;

  setCredits: (movieId: number, credits: Credits | null) => void;
  fetchCredits: (movieId: number) => Promise<Credits | null>;
  fetchAllBackground: (movieIds: number[]) => void;
  stopBackgroundFetch: () => void;
}

let bgAbortController: AbortController | null = null;

export const useCreditsStore = create<CreditsState>((set, get) => {
  const updateCredits = async (movieId: number, signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/movies/${movieId}/credits`, { signal });
      if (res.status === 404) {
        get().setCredits(movieId, null);
        return;
      }
      if (!res.ok) return;

      const data: Credits = await res.json();
      get().setCredits(movieId, data);
      await DB.credits.save(movieId, data);
    } catch (err: any) {
      if (err.name === "AbortError") console.log(`Credits fetch 중단 (movieId=${movieId})`);
      else console.warn(`Credits fetch 실패 (movieId=${movieId}):`, err);
    }
  };

  return {
    creditsMap: {},
    isBackgroundFetched: false,
    isBackgroundFetching: false,

    setCredits: (movieId, credits) =>
      set((state) => ({ creditsMap: { ...state.creditsMap, [movieId]: credits } })),

    fetchCredits: async (movieId) => {
      if (movieId in get().creditsMap) return get().creditsMap[movieId];
      const cached = (await DB.credits.get(movieId)) ?? null;
      get().setCredits(movieId, cached);
      void updateCredits(movieId);
      return cached;
    },

    fetchAllBackground: async (movieIds) => {
      if (get().isBackgroundFetched || get().isBackgroundFetching) return;
      set({ isBackgroundFetching: true });
      bgAbortController = new AbortController();
      const signal = bgAbortController.signal;

      (async () => {
        for (const id of movieIds) {
          if (signal.aborted) break;
          if (id in get().creditsMap) continue;

          const cached = (await DB.credits.get(id)) ?? null;
          get().setCredits(id, cached);
          await updateCredits(id, signal);
        }
        set({ isBackgroundFetched: true, isBackgroundFetching: false });
        bgAbortController = null;
        console.log("Credits 백그라운드 fetch 완료!");
      })();
    },

    stopBackgroundFetch: () => {
      if (bgAbortController) {
        bgAbortController.abort();
        bgAbortController = null;
        set({ isBackgroundFetching: false });
        console.log("Credits 백그라운드 fetch 중단됨");
      }
    },
  };
});
