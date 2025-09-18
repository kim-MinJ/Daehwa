  // src/pages/MovieDetailPage.tsx
  import { useMemo } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { ArrowLeft } from "lucide-react";
  import { MovieDetailCard } from "@/components/MovieDetailCard";
  import { MovieCarousel } from "@/components/MovieCarousel";

  import { useMoviePage, genreMap, CastPerson } from "@/hooks/useMoviePage";
  import { useAuth } from "@/hooks/useAuth";
  import type { Movie as UIMovie } from "@/types/movie";

  const img500 = (path?: string) =>
    path ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w500${path}`) : "/placeholder/poster.png";
  const img185 = (path?: string) =>
    path ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w185${path}`) : "/placeholder/avatar.png";

  export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();
    const movieId = Number(id);
    const navigate = useNavigate();
    const { token } = useAuth();

    const { loading, error, movie, credits, similar } = useMoviePage(movieId);

    const year = useMemo(() => (movie?.release_date ? String(movie.release_date).slice(0, 4) : undefined), [movie]);

    const genres = useMemo<string[]>(
      () =>
        movie?.genres
          ? movie.genres
              .map((g: { name?: string }) => g.name)
              .filter((name): name is string => !!name)
              .map((name: string) => genreMap[name] || name)
          : [],
      [movie]
    );

    const director = useMemo(() => {
      const crew = credits?.crew ?? [];
      return crew.find((p) => p.job === "Director" || p.job === "감독")?.name ?? "";
    }, [credits]);

    const castTop = useMemo(
  () =>
    (credits?.cast ?? [])
      .slice(0, 8)
      .map((c: CastPerson) => ({
        id: c.id || `${c.name?.replace(/\s+/g, "_")}-${c.character ?? ""}`,
        name: c.name,
        character: c.character ?? "",
        photo: img185(c.profile_path),
      }))
      .filter((c) => !!c.name),
  [credits]
);

    const cardProps = useMemo(() => {
      const vote10 = Number(movie?.vote_average ?? 0);
      const userRating10 = Math.max(0, Math.min(10, Math.round(vote10 * 10) / 10));
      return {
        title: movie?.title ?? "",
        year: year ?? "정보 없음",
        rating: "15세 이상 관람가",
        genre: genres,
        director,
        cast: castTop.map((c) => c.name),
        description: movie?.overview || "줄거리 정보가 없습니다.",
        posterUrl: img500(movie?.poster_path),
        userRating: userRating10,
        movieIdx: movie?.id ?? movieId,
        token,
      };
    }, [movie, year, genres, castTop, director, token, movieId]);
    
const similarUi: UIMovie[] = useMemo(() => {
  const list = Array.isArray(similar) ? similar : [];
  return list.map((m: any) => {
    const genreList = Array.isArray(m?.genres)
      ? m.genres
          .map((g: any) => g.name)
          .filter((name: string): name is string => !!name)
          .map((name: string) => genreMap[name] || name)
      : ["기타"];

    return {
      id: String(m?.id ?? m?.movieIdx ?? ""),
      title: m?.title ?? "",
      titleEn: m?.original_title ?? "",
      year: m?.release_date ? Number(m.release_date.slice(0, 4)) : 0,
      genre: genreList.join(" / "),
      rating: parseFloat(Number(m?.vote_average ?? 0).toFixed(1)), // ✅ 소수점 한 자리
      poster: img500(m?.poster_path),
      director: m?.director ?? "정보 없음",
      cast: Array.isArray(m?.cast) ? m.cast.map((c: any) => c.name) : [],
      plot: m?.overview ?? "",
      duration: m?.runtime ?? 0,
      country: m?.country ?? "정보 없음",
      releaseDate: m?.release_date ?? "",
    };
  });
}, [similar]);

    const onSimilarClick = (m: UIMovie) => {
      if (m.id) navigate(`/movies/${m.id}`);
    };

    if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 text-gray-600">불러오는 중…</div>;
    if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 text-red-600">에러: {error}</div>;
    if (!movie) return <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24">영화를 찾을 수 없습니다.</div>;

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100">
                <MovieDetailCard {...cardProps} />
              </section>

              {!!castTop.length && (
                <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 출연진</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {castTop.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <div className="text-gray-900 text-sm font-medium line-clamp-1">{p.name}</div>
                          {p.character && (
                            <div className="text-gray-500 text-xs line-clamp-1">{p.character}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {similarUi.length > 0 && (
                <div className="mt-6">
                  <MovieCarousel
                    title="비슷한 키워드 영화"
                    movies={similarUi}
                    onMovieClick={onSimilarClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
