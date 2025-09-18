// src/store/trailersStore.ts
import { create } from "zustand";
import { Trailer } from "@/types/movie";
import { DB } from "@/utils/indexedDB";

interface TrailersState {
  trailersMap: Record<number, Trailer[] | null>;
  isBackgroundFetched: boolean;
  isBackgroundFetching: boolean;

  setTrailers: (movieId: number, trailers: Trailer[] | null) => void;
  fetchTrailers: (movieId: number) => Promise<Trailer[] | null>;
  fetchAllBackground: (movieIds: number[]) => void;
  stopBackgroundFetch: () => void;
}

let bgAbortController: AbortController | null = null;

export const useTrailersStore = create<TrailersState>((set, get) => {
  const fetchFromAPI = async (movieId: number, signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/movie/${movieId}/videos`, { signal });
      if (res.status === 404) {
        get().setTrailers(movieId, null);
        return;
      }
      if (!res.ok) return;

      const data: Trailer[] = await res.json();
      get().setTrailers(movieId, data); // ✅ UI 즉시 반영
      await DB.trailers.save(movieId, data); // DB 업데이트
    } catch (err: any) {
      if (err.name === "AbortError") console.log(`Trailers fetch 중단 (movieId=${movieId})`);
      else console.warn("Trailers fetch 실패:", err);
    }
  };

  return {
    trailersMap: {},
    isBackgroundFetched: false,
    isBackgroundFetching: false,

    setTrailers: (movieId, trailers) =>
      set((state) => ({ trailersMap: { ...state.trailersMap, [movieId]: trailers } })),

    fetchTrailers: async (movieId) => {
      if (movieId in get().trailersMap) return get().trailersMap[movieId];

      const cached = (await DB.trailers.get(movieId)) ?? null;
      get().setTrailers(movieId, cached);

      void fetchFromAPI(movieId);

      return cached;
    },

    fetchAllBackground: (movieIds) => {
      if (get().isBackgroundFetched || get().isBackgroundFetching) return;
      set({ isBackgroundFetching: true });
      bgAbortController = new AbortController();
      const signal = bgAbortController.signal;

      (async () => {
        for (const id of movieIds) {
          if (signal.aborted) break;
          if (id in get().trailersMap) continue;

          const cached = (await DB.trailers.get(id)) ?? null;
          get().setTrailers(id, cached);

          await fetchFromAPI(id, signal);
        }
        set({ isBackgroundFetched: true, isBackgroundFetching: false });
        bgAbortController = null;
        console.log("Trailers 백그라운드 fetch 완료!");
      })();
    },

    stopBackgroundFetch: () => {
      if (bgAbortController) {
        bgAbortController.abort();
        bgAbortController = null;
        set({ isBackgroundFetching: false });
        console.log("Trailers 백그라운드 fetch 중단됨");
      }
    },
  };
});
