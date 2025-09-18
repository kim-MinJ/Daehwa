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

  useEffect(() => {
    if (!movieId || isNaN(movieId)) {
      setError("유효하지 않은 영화 ID입니다.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        // ----------------------------
        // 1️⃣ Movie: 메모리 → DB → UI 즉시 반영
        // ----------------------------
        let movieData = movieStore.movies.find(m => m.movieIdx === movieId) ?? null;
        if (!movieData) movieData = await movieStore.getMovieFromDB(movieId);

        if (isMounted) {
          setMovie(movieData);
          setLoading(false);
        }

        // ----------------------------
        // 2️⃣ Movie: 백그라운드 API fetch
        // ----------------------------
        void (async () => {
          try {
            const res = await fetch(`/api/movie/${movieId}`);
            if (!res.ok) return;
            const data: Movie = await res.json();
            if (isMounted) setMovie(data); // store는 덮어쓰기 금지
          } catch (err) {
            console.warn("Movie API fetch 실패:", err);
          }
        })();

        // ----------------------------
        // 3️⃣ Credits & Trailers: store에서 즉시 반영
        // ----------------------------
        const cachedCredits =
          creditsStore.creditsMap[movieId] ??
          (await creditsStore.fetchCredits(movieId)) ??
          { cast: [], crew: [] };
        if (isMounted) setCredits(cachedCredits);

        const cachedTrailers =
          trailersStore.trailersMap[movieId] ??
          (await trailersStore.fetchTrailers(movieId)) ??
          [];
        if (isMounted) setTrailers(cachedTrailers);

      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (error)
    return <div className="text-red-600 py-24 text-center">에러: {error}</div>;

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
              <DetailCardWrapper movie={movie} credits={credits} />
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
