// src/pages/DetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Movie, Credits, Trailer } from "@/types/movie";
import { useMovieStore } from "@/store/movieStore";
import { useCreditsStore } from "@/store/creditsStore";
import { useTrailersStore } from "@/store/trailersStore";
import { DetailCardWrapper } from "@/components/detailPage/DetailCardWrapper";
import { TrailerList } from "@/components/detailPage/TrailerList";

export default function DetailPage() {
  const { id } = useParams<{ id?: string }>();
  const movieId = id ? Number(id) : null;
  const navigate = useNavigate();

  const movieStore = useMovieStore();
  const creditsStore = useCreditsStore();
  const trailersStore = useTrailersStore();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits>({ cast: [], crew: [] });
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // JWT 토큰 (예: localStorage)
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!movieId || isNaN(movieId)) {
      setError("유효하지 않은 영화 ID입니다.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const movieAbort = new AbortController();
    const creditsAbort = new AbortController();
    const trailersAbort = new AbortController();

    const fetchData = async () => {
      try {
        // 1️⃣ Movie
        const movieData =
          movieStore.movies.find((m) => m.movieIdx === movieId) ??
          (await movieStore.getMovieFromDB(movieId));

        if (isMounted && movieData) setMovie(movieData);
        setLoading(false);

        // API fallback
        void (async () => {
          try {
            const res = await fetch(`/api/movie/${movieId}`, { signal: movieAbort.signal });
            if (!res.ok) return;
            const data: Movie = await res.json();
            if (isMounted) setMovie(data);
          } catch (err: any) {
            if (err.name !== "AbortError") console.warn("Movie fetch 실패:", err);
          }
        })();

        // 2️⃣ Credits
        const cachedCredits =
          creditsStore.creditsMap[movieId] ?? (await creditsStore.fetchCredits(movieId)) ?? null;
        if (isMounted && cachedCredits) setCredits(cachedCredits);

        void (async () => {
          try {
            const res = await fetch(`/api/movies/${movieId}/credits`, { signal: creditsAbort.signal });
            if (!res.ok) return;
            const data: Credits = await res.json();
            if (isMounted) setCredits(data);
            creditsStore.setCredits(movieId, data);
          } catch (err: any) {
            if (err.name !== "AbortError") console.warn("Credits fetch 실패:", err);
          }
        })();

        // 3️⃣ Trailers
        const cachedTrailers =
          trailersStore.trailersMap[movieId] ?? (await trailersStore.fetchTrailers(movieId)) ?? null;
        if (isMounted && cachedTrailers) setTrailers(cachedTrailers);

        void (async () => {
          try {
            const res = await fetch(`/api/movie/${movieId}/videos`, { signal: trailersAbort.signal });
            if (!res.ok) return;
            const data: Trailer[] = await res.json();
            if (isMounted) setTrailers(data);
            trailersStore.setTrailers(movieId, data);
          } catch (err: any) {
            if (err.name !== "AbortError") console.warn("Trailers fetch 실패:", err);
          }
        })();
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      movieAbort.abort();
      creditsAbort.abort();
      trailersAbort.abort();
    };
  }, [movieId]);

  if (error) return <div className="text-red-600 py-24 text-center">에러: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">뒤로가기</span>
        </button>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : movie ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <DetailCardWrapper movie={movie} credits={credits} movieIdx={movie.movieIdx} token={token} />
            </div>
            <aside className="lg:col-span-8">
              <TrailerList trailers={trailers} />
            </aside>
          </div>
        ) : (
          <div className="py-24 text-center">영화를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
