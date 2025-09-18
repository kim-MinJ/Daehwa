import { openDB, IDBPDatabase } from "idb";
import { Movie, Credits, Trailer } from "@/types/movie";

const DB_NAME = "MovieDB";
const DB_VERSION = 8;

let dbInstance: IDBPDatabase<any> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("movies")) {
        db.createObjectStore("movies", { keyPath: "movieIdx" });
      }
      if (!db.objectStoreNames.contains("credits")) {
        db.createObjectStore("credits", { keyPath: "movieIdx" });
      }
      if (!db.objectStoreNames.contains("trailers")) {
        db.createObjectStore("trailers", { keyPath: "movieIdx" });
      }
      console.log("✅ IndexedDB 업그레이드 완료: movies / credits / trailers 생성");
    },
  });

  return dbInstance;
}

export const DB = {
  movies: {
    save: async (movies: Movie[]) => {
      const db = await getDB();
      const tx = db.transaction("movies", "readwrite");
      const store = tx.objectStore("movies");
      movies.forEach((m) => store.put(m));
      await tx.done;
    },
    getAll: async (): Promise<Movie[]> => {
      const db = await getDB();
      return db.getAll("movies");
    },
  },

  credits: {
    save: async (movieIdx: number, credits: Credits) => {
      const db = await getDB();
      const tx = db.transaction("credits", "readwrite");
      const store = tx.objectStore("credits");
      await store.put({ movieIdx, ...credits });
      await tx.done;
    },
    get: async (movieIdx: number): Promise<Credits | null> => {
      const db = await getDB();
      const data = await db.get("credits", movieIdx);
      return data ? { cast: data.cast || [], crew: data.crew || [] } : null;
    },
  },

  trailers: {
    save: async (movieIdx: number, trailers: Trailer[]) => {
      const db = await getDB();
      const tx = db.transaction("trailers", "readwrite");
      const store = tx.objectStore("trailers");
      await store.put({ movieIdx, trailers });
      await tx.done;
    },
    get: async (movieIdx: number): Promise<Trailer[]> => {
      const db = await getDB();
      const data = await db.get("trailers", movieIdx);
      return data?.trailers || [];
    },
  },
};
