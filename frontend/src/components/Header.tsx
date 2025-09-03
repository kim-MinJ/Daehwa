import { useState } from "react";
import { searchMovies } from "@/services/movies";

export function Header({ onPick }: { onPick?: (id: number) => void }) {
  const [q, setQ] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const results = await searchMovies(q.trim());
    if (results.length && onPick) onPick(results[0].id); // 첫 결과 선택
  }

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto p-4 flex items-center gap-3">
        <div className="font-semibold">Daehwa</div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="영화 검색"
            className="px-3 py-2 rounded-md bg-input-background"
          />
          <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground">검색</button>
        </form>
      </div>
    </header>
  );
}
