import { useEffect, useState } from "react";
import { fetchMovie, fetchCredits, fetchSimilar, fetchVideos } from "@/services/movies";

export function useMoviePage(movieId: number) {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [m, c, s, v] = await Promise.all([
          fetchMovie(movieId),
          fetchCredits(movieId),
          fetchSimilar(movieId),
          fetchVideos(movieId),
        ]);
        if (!alive) return;
        setMovie(m);
        setCredits(c);
        setSimilar(s);
        setTrailers(v.filter((x: any) => x.type === "Trailer" && x.site === "YouTube"));
      } catch (e: any) {
        setError(e?.message ?? "데이터 로드 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [movieId]);

  return { loading, error, movie, credits, similar, trailers };
}
