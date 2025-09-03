// src/hooks/useFavorites.ts
import { useEffect, useMemo, useState } from "react";

const KEY = "daehwa:favorites"; // localStorage key

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}
function write(ids: number[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
}

export function useFavorites() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => { setIds(read()); }, []);
  const isFavorite = (id?: number) => !!id && ids.includes(id);

  const add = (id?: number) => {
    if (!id) return;
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      write(next);
      return next;
    });
  };

  const remove = (id?: number) => {
    if (!id) return;
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      write(next);
      return next;
    });
  };

  const toggle = (id?: number) => (isFavorite(id) ? remove(id) : add(id));

  return useMemo(() => ({ ids, isFavorite, add, remove, toggle }), [ids]);
}
