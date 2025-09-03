import { useMoviePage } from "@/hooks/useMoviePage";
import { imgUrl } from "@/lib/api";

import { Header } from "./components/Header";
import { MovieDetailCard } from "./components/MovieDetailCard";
import { RelatedArticlesSidebar } from "./components/RelatedArticlesSidebar";
import { MovieOSTSection } from "./components/MovieOSTSection";
import { MovieTrailerSection } from "./components/MovieTrailerSection";
import { SimilarMoviesSection } from "./components/SimilarMoviesSection";

export default function App() {
  // 어벤져스: 엔드게임(299534) 예시
  const movieId = 299534;
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
              <div className="lg:col-span-3 space-y-8">
                {/* 영화 상세 */}
                <section>
                  <MovieDetailCard
                    title={movie.title}
                    year={(movie.release_date ?? "").slice(0, 4)}
                    rating={(movie.adult ? "청소년 관람불가" : "전체/12/15/등급 정보 미제공")}
                    genre={(movie.genres ?? []).map((g: any) => g.name)}
                    director={director}
                    cast={cast}
                    runtime={runtime}
                    description={movie.overview}
                    posterUrl={poster}
                    userRating={movie.vote_average ? Number(movie.vote_average / 2).toFixed ? Number((movie.vote_average / 2).toFixed(1)) : movie.vote_average/2 : 0}
                  />
                </section>

                {/* OST - (TMDB엔 OST가 없어 더미/향후 Spotify 등 연동) */}
                <section>
                  <MovieOSTSection tracks={[]} />
                </section>

                {/* 예고편 */}
                <section>
                  <MovieTrailerSection
                    trailers={trailers.map((t: any) => ({
                      id: t.id,
                      name: t.name,
                      // YouTube watch url
                      url: `https://www.youtube.com/watch?v=${t.key}`,
                      thumbnail: `https://img.youtube.com/vi/${t.key}/0.jpg`,
                    }))}
                  />
                </section>

                {/* 비슷한 영화 */}
                <section>
                  <SimilarMoviesSection
                    movies={similar.map((m: any) => ({
                      id: m.id,
                      title: m.title,
                      posterUrl: imgUrl(m.poster_path, "w300"),
                      rating: m.vote_average ? (m.vote_average / 2) : 0,
                      year: (m.release_date ?? "").slice(0, 4),
                    }))}
                  />
                </section>
              </div>

              {/* 우측 사이드바 (기사 섹션은 예시 더미) */}
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
    </div>
  );
}
