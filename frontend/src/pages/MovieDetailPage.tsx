// src/pages/MovieDetailPage.tsx
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import { MovieDetailCard } from "@/components/MovieDetailCard";
import { MovieTrailerSection } from "@/components/MovieTrailerSection";
import { MovieOSTSection } from "@/components/MovieOSTSection";
import { MovieCarousel } from "@/components/MovieCarousel";

import { useMoviePage, genreMap, CastPerson } from "@/hooks/useMoviePage";
import type { Movie as UIMovie } from "@/types/movie";

const img500 = (path?: string) =>
  path ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w500${path}`) : "/placeholder/poster.png";
const img185 = (path?: string) =>
  path ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w185${path}`) : "/placeholder/avatar.png";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const { loading, error, movie, credits, similar, trailers } = useMoviePage(movieId);

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
          id: c.id ?? Number(`${c.name?.replace(/\s+/g, "_")}-${c.character ?? ""}`),
          name: c.name,
          character: c.character ?? "",
          photo: img185(c.profile_path),
        }))
        .filter((c) => c.name),
    [credits]
  );

  const cardProps = useMemo(() => {
    const vote10 = Number(movie?.vote_average ?? 0);
    const userRating5 = Math.max(0, Math.min(5, Math.round((vote10 / 2) * 10) / 10));
    return {
      title: movie?.title ?? "",
      year: year ?? "정보 없음",
      rating: "15세 이상 관람가",
      genre: genres,
      director,
      cast: castTop.map((c) => c.name),
      description: movie?.overview || "줄거리 정보가 없습니다.",
      posterUrl: img500(movie?.poster_path),
      userRating: userRating5,
    };
  }, [movie, year, genres, castTop, director]);

  const trailerItems = useMemo(() => {
    const list = Array.isArray(trailers) ? trailers : [];
    return list
      .filter((v: any) => v?.site === "YouTube" && v?.key)
      .map((v: any, i: number) => ({
        id: v.id ?? i,
        title: v.name ?? "영상",
        type: v.type ?? "영상",
        duration: v.duration ? `${v.duration}` : " ",
        views: "",
        thumbnail: `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`,
        quality: "HD",
      }));
  }, [trailers]);

  const similarUi: UIMovie[] = useMemo(() => {
    const list = Array.isArray(similar) ? similar : [];
    return list.map((m: any) => ({
      id: String(m?.id ?? m?.movieIdx ?? ""),
      title: m?.title ?? "",
      poster: img500(m?.poster_path),
      year: m?.release_date ? Number(String(m.release_date).slice(0, 4)) : 0,
      genre: Array.isArray(m?.genres) && m.genres[0]?.name ? m.genres[0].name : "기타",
      rating: Number(m?.vote_average ?? 0),
      description: m?.overview ?? "",
    }));
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MovieTrailerSection trailers={trailerItems} />
              <MovieOSTSection />
            </div>

            {similarUi.length > 0 && (
              <div className="mt-0">
                <MovieCarousel
                  title="비슷한 키워드 영화"
                  movies={similarUi}
                  onMovieClick={onSimilarClick}
                />
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            {!!similarUi.length && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-4">관련 기사</h3>
                <div className="space-y-4">
                  {similarUi.slice(0, 4).map((m, i) => (
                    <div
                      key={`${m.id}-${i}-news`}
                      className="flex gap-3 cursor-pointer"
                      onClick={() => onSimilarClick(m)}
                      title={`${m.title} 관련 소식`}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <ImageWithFallback
                          src={m.poster}
                          alt={m.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-800 line-clamp-2">
                          {m.title} 관련 소식
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {m.year || "-"} · 영화/연예
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4 w-full text-gray-600 hover:text-black">
                  더 많은 기사 보기
                </Button>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
