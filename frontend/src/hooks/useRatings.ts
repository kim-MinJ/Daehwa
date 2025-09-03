// src/hooks/useRatings.ts
import { useEffect, useMemo, useState } from "react";

const KEY = "daehwa:ratings"; // { [movieId]: 1~5 }

type Ratings = Record<number, number>;

function read(): Ratings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Ratings : {};
  } catch { return {}; }
}
function write(data: Ratings) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function useRatings() {
  const [data, setData] = useState<Ratings>({});

  useEffect(() => { setData(read()); }, []);

  const get = (id?: number) => (id ? data[id] : undefined);
  const set = (id?: number, value?: number) => {
    if (!id || !value) return;
    setData(prev => {
      const next = { ...prev, [id]: value };
      write(next);
      return next;
    });
  };
  const remove = (id?: number) => {
    if (!id) return;
    setData(prev => {
      const next = { ...prev };
      delete next[id];
      write(next);
      return next;
    });
  };

  return useMemo(() => ({ get, set, remove }), [data]);
}
