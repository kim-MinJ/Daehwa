// src/pages/MoviePage.tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useFavorites } from "@/hooks/useFavorites";
import { useMoviePage } from "@/hooks/useMoviePage";
import { useRatings } from "@/hooks/useRatings";
import { imgUrl } from "@/lib/api";
import { Navigate, useParams } from "react-router-dom";

import { MovieDetailCard } from "@/components/MovieDetailCard";
import { MovieOSTSection } from "@/components/MovieOSTSection";
import { MovieTrailerSection } from "@/components/MovieTrailerSection";

import { RelatedArticlesSidebar } from "@/components/RelatedArticlesSidebar";
import { SimilarMoviesSection } from "@/components/SimilarMoviesSection";

type Props = { defaultId?: number };

export default function MoviePage({ defaultId }: Props) {
  const params = useParams();
  const idFromRoute = params.id ? Number(params.id) : undefined;
  const movieId = idFromRoute ?? defaultId;

  const { isFavorite, toggle } = useFavorites();
  const ratings = useRatings();

  // 기본 이동(엔드게임) — 필요시 원하는 기본 id로 바꿔도 됨
  if (!movieId) return <Navigate to="/movies/299534" replace />;

  const { loading, error, movie, credits, similar, trailers } = useMoviePage(movieId);

  const director = credits?.crew?.find((p: any) => p.job === "Director")?.name;
  const cast = (credits?.cast ?? []).slice(0, 5).map((c: any) => c.name);
  const runtime = movie?.runtime ? `${movie.runtime}분` : undefined;
  const poster = imgUrl(movie?.poster_path, "w500");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {loading && <div className="p-6">불러오는 중...</div>}
          {error && <div className="p-6 text-red-500">에러: {error}</div>}

          {!loading && !error && movie && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 본문 3칸 */}
              <div className="lg:col-span-3 space-y-8">
                {/* 상세 카드 */}
                <section>
                  <MovieDetailCard
                    title={movie.title}
                    year={(movie.release_date ?? "").slice(0, 4)}
                    rating={movie.adult ? "청불" : "전체/12/15"}
                    genre={(movie.genres ?? []).map((g: any) => g.name)}
                    director={director}
                    cast={cast}
                    runtime={runtime}
                    description={movie.overview}
                    posterUrl={poster}

                    // TMDB 10점 → 5점 환산
                    userRating={(movie.vote_average ?? 0) / 2}

                    // 찜 기능
                    movieId={movie.id}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={() => toggle(movie.id)}
                  />
                </section>

                {/* OST 섹션(필요 시 실제 트랙 주입) */}
                <section>
                  <MovieOSTSection tracks={[]} />
                </section>

                {/* 예고편 섹션 */}
                <section>
                  <MovieTrailerSection
                    trailers={(trailers ?? [])
                      .filter((t: any) => t.type === "Trailer" && t.site === "YouTube")
                      .map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        url: `https://www.youtube.com/watch?v=${t.key}`,
                        thumbnail: `https://img.youtube.com/vi/${t.key}/0.jpg`,
                      }))}
                  />
                </section>

                {/* 비슷한 영화 */}
                <section>
                  <SimilarMoviesSection
                    movies={(similar ?? []).map((m: any) => ({
                      id: m.id,
                      title: m.title,
                      posterUrl: imgUrl(m.poster_path, "w300"),
                      rating: m.vote_average ? m.vote_average / 2 : 0,
                      year: (m.release_date ?? "").slice(0, 4),
                    }))}
                  />
                </section>
              </div>

              {/* 사이드 1칸 */}
              <div className="lg:col-span-1">
                <RelatedArticlesSidebar
                  articles={[
                    { id: 1, title: "엔드게임 비하인드", url: "https://example.com", source: "예시", date: "2019-05-01" },
                    { id: 2, title: "MCU 페이즈 3 총정리", url: "https://example.com", source: "예시", date: "2019-04-28" },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
