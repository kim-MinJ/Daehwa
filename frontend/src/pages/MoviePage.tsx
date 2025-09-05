// src/pages/MoviePage.tsx
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMoviePage } from "@/hooks/useMoviePage";
import { useFavorites } from "@/hooks/useFavorites";
import { useRatings } from "@/hooks/useRatings";
import { imgUrl } from "@/lib/api";

import { MovieDetailCard } from "@/components/MovieDetailCard";
import { RelatedArticlesSidebar } from "@/components/RelatedArticlesSidebar";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Film,
  Play,
  ArrowLeft,
  Music2,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useRef } from "react";

type Props = { defaultId?: number };

export default function MoviePage({ defaultId }: Props) {
  const navigate = useNavigate();
  const params = useParams();
  const idFromRoute = params.id ? Number(params.id) : undefined;
  const movieId = idFromRoute ?? defaultId;

  const { isFavorite, toggle } = useFavorites();
  const ratings = useRatings();

  if (!movieId) return <Navigate to="/movies/299534" replace />;

  const { loading, error, movie, credits, similar, trailers } = useMoviePage(movieId);

  const director = credits?.crew?.find((p: any) => p.job === "Director")?.name;
  const cast = (credits?.cast ?? []).slice(0, 5).map((c: any) => c.name);
  const runtime = movie?.runtime ? `${movie.runtime}분` : undefined;
  const poster = imgUrl(movie?.poster_path, "w500");

  // [MOD] 관람등급 텍스트 간단 변환(실데이터 없을 때 기본값)
  const ageText = movie?.adult ? "청소년 관람불가" : "15세 이상 관람가"; // [MOD]

  // 비슷한 키워드 추천
  const similarMovies = (similar ?? []).map((m: any) => ({
    id: m.id,
    title: m.title,
    posterUrl: imgUrl(m.poster_path, "w300"),
    rating: m.vote_average ? m.vote_average / 2 : 0,
    year: (m.release_date ?? "").slice(0, 4),
  }));
  const simRef = useRef<HTMLDivElement>(null);
  const scrollByPx = (px: number) =>
    simRef.current?.scrollBy({ left: px, behavior: "smooth" });

  const handleShare = () => {
    const url = window.location.href;
    if ((navigator as any).share) {
      (navigator as any).share({ title: movie?.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => alert("링크를 복사했어요."));
    }
  };
  const handleRate = () => alert("평가하기 기능은 준비 중입니다.");

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 to-gray-100
+              before:content-[''] before:absolute before:inset-0 before:-z-10
+              before:bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(0,0,0,0.06),transparent_65%)]">
      <Header />

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </button>

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
                    // rating={movie.adult ? "청불" : "전체/12/15"} // 사용 안 함
                    genre={(movie.genres ?? []).map((g: any) => g.name)}
                    director={director}
                    cast={cast}
                    runtime={runtime}
                    description={movie.overview}
                    posterUrl={poster}
                    userRating={(movie.vote_average ?? 0) / 2}
                    voteCount={movie.vote_count}      // [MOD]
                    ageText={ageText}                  // [MOD]
                    movieId={movie.id}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={() => toggle(movie.id)}
                    onShare={handleShare}
                    onRate={handleRate}
                  />
                </section>

                {/* 주요 출연진 (가로 스크롤) */}
                <section>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">주요 출연진</h3>
                    <div className="flex gap-6 overflow-x-auto pb-2">
                      {(credits?.cast ?? []).slice(0, 12).map((c: any) => {
                        const avatar = c.profile_path ? imgUrl(c.profile_path, "w185") : undefined;
                        return (
                          <div key={c.cast_id ?? c.credit_id} className="min-w-[88px]">
                            <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/5 shadow-sm mx-auto mb-2 bg-gray-100">
                              {avatar ? (
                                <ImageWithFallback
                                  src={avatar}
                                  alt={c.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">
                                  N/A
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium line-clamp-1">{c.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{c.character}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* OST 섹션 */}
                <section>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Music2 className="h-5 w-5 text-pink-600" />
                      <h3 className="text-lg font-bold">OST</h3>
                    </div>

                    {/* 실제 데이터가 없으면 안내 */}
                    <div className="text-sm text-muted-foreground">
                      트랙 정보가 없습니다.
                    </div>
                  </div>
                </section>

                {/* 예고편 & 영상 */}
                <section>
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Film className="h-6 w-6 text-red-600" />
                      <h2 className="text-2xl font-bold text-gray-900">예고편 & 영상</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(trailers ?? [])
                        .filter((t: any) => t.type === "Trailer" && t.site === "YouTube")
                        .map((t: any) => {
                          const url = `https://www.youtube.com/watch?v=${t.key}`;
                          const thumb = `https://img.youtube.com/vi/${t.key}/0.jpg`;
                          return (
                            <a
                              key={t.id}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="group cursor-pointer"
                            >
                              <div className="aspect-video rounded-lg overflow-hidden relative mb-3">
                                <ImageWithFallback
                                  src={thumb}
                                  alt={t.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-12 h-12 bg-white/90 rounded-full grid place-items-center">
                                    <Play className="h-6 w-6 text-gray-800 ml-1" />
                                  </div>
                                </div>
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">{t.name}</h4>
                            </a>
                          );
                        })}
                    </div>
                  </div>
                </section>

                {/* 비슷한 키워드 영화 추천 */}
                <section>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">비슷한 키워드 영화 추천</h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="prev"
                          onClick={() => scrollByPx(-600)}
                          className="w-8 h-8 rounded-full border grid place-items-center hover:bg-muted"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="next"
                          onClick={() => scrollByPx(600)}
                          className="w-8 h-8 rounded-full border grid place-items-center hover:bg-muted"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={simRef}
                      className="flex gap-6 overflow-x-auto pb-2 scroll-smooth"
                    >
                      {similarMovies.map((m) => (
                        <a
                          key={m.id}
                          href={`/movies/${m.id}`}
                          className="min-w-[230px] max-w-[230px] bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition"
                        >
                          <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100">
                            {m.posterUrl ? (
                              <ImageWithFallback
                                src={m.posterUrl}
                                alt={m.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-medium line-clamp-1">{m.title}</div>
                            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{m.year || "-"}</span>
                              <span className="inline-flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current text-yellow-400" />
                                {(m.rating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
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
