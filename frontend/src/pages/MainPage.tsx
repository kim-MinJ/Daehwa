// src/pages/MainPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { fetchMovies } from "../data/movies";
import type { Movie as ApiMovie } from "../types/movie";
import { ChevronRight, Info, MessageSquare, Star } from "lucide-react";

// UI 타입
type UiMovie = {
  id: string | number;
  title: string;
  poster: string;
  year: number;
  genre: string;
  rating: number;
  runtime: number;
  description?: string;
};

// API → UI 매핑
const mapApiToUi = (m: ApiMovie): UiMovie => ({
  id: (m as any).movieIdx ?? (m as any).id ?? "",
  title: m.title,
  poster: (m as any).posterPath ?? (m as any).posterUrl ?? "",
  year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : ((m as any).year ?? 0),
  genre: Array.isArray(m.genre) && (m.genre as any[]).length ? (m.genre as any[])[0] : ((m as any).genre ?? "기타"),
  rating:
    typeof (m as any).voteAverage === "number"
      ? (m as any).voteAverage
      : ((m as any).rating ?? 0),
  runtime: (m as any).runtime ?? 0,
  description: (m as any).overview ?? (m as any).description,
});

// ID 중복 제거
const uniqueById = (movies: UiMovie[]): UiMovie[] => {
  const seen = new Set<string | number>();
  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
};

function MainPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // ---- 상태 정의 (필수) ----
  const [latest, setLatest] = useState<UiMovie[]>([]);
  const [topRated, setTopRated] = useState<UiMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // ---- 데이터 로딩 ----
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    
    (async () => {
      try {
        const [latestResp, ratingResp] = await Promise.all([
          // token 없어도 호출 가능하도록 두되, 있으면 헤더에 쓰는 구현은 services/movies 내부에 있다고 가정
          fetchMovies({ q: "", page: 1, sort: "latest" } as any, token as any),
          fetchMovies({ q: "", page: 1, sort: "rating" } as any, token as any),
        ]);

        if (!alive) return;
        const latestList: ApiMovie[] = (latestResp as any)?.content ?? [];
        const ratingList: ApiMovie[] = (ratingResp as any)?.content ?? [];

        setLatest(uniqueById(latestList.map(mapApiToUi)));
        setTopRated(uniqueById(ratingList.map(mapApiToUi)));
      } catch (e) {
        if (!alive) return;
        console.error("메인 데이터 로딩 실패:", e);
        // 공개 페이지이므로 에러를 강하게 띄우지 않고 빈 섹션만 보이게 처리
        setErr(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  // ---- 파생 데이터 ----
  const featured = useMemo(() => topRated[0] ?? latest[0], [topRated, latest]);
  const personalizedTop3 = useMemo(() => topRated.slice(0, 3), [topRated]);
  const latest6 = useMemo(() => latest.slice(0, 6), [latest]);
  const weeklyTop5 = useMemo(() => topRated.slice(0, 5), [topRated]);
  const reviewEvent3 = useMemo(() => latest.slice(6, 9), [latest]);

  // ---- 네비게이션 핸들러 ----
  const toRanking = () => navigate("/ranking");
  const toMovies = () => navigate("/movies");
  const onMovieClick = (m: UiMovie) => navigate(`/movies/${m.id}`);

  // ---- 로딩 화면 ----
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          currentPage="home"
          onNavigation={(p) => navigate(`/${p}`)}
          onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
        />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-24 text-gray-600">
          불러오는 중…
        </div>
        <Footer />
      </div>
    );
  }

  // ---- 실제 화면 ----
  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage="home"
        onNavigation={(page) => navigate(`/${page}`)}
        onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
      />

      <main className="relative">
        {/* 히어로 섹션 */}
        {featured && (
          <div className="relative h-[85vh] mb-8">
            <div className="absolute inset-0 cursor-pointer" onClick={() => onMovieClick(featured)}>
              <ImageWithFallback
                src={`https://image.tmdb.org/t/p/original${featured.poster}`}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full">
              <div className="max-w-7xl mx-auto px-8 lg:px-16 relative pb-8 lg:pb-16">
                <div className="max-w-lg">
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {featured.title}
                  </h1>
                  {featured.description && (
                    <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6">
                      {featured.description.slice(0, 200)}...
                    </p>
                  )}
                  <div className="flex items-center gap-4 mb-8 text-white/80">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">
                        {typeof featured.rating === "number" ? featured.rating.toFixed(1) : featured.rating}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{featured.year}년</span>
                    <span>•</span>
                    <span>{featured.runtime}분</span>
                    <span>•</span>
                    <span>{featured.genre}</span>
                  </div>
                  <div className="flex justify-start">
                    <Button
                      className="bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg"
                      onClick={() => onMovieClick(featured)}
                    >
                      <Info className="h-6 w-6 mr-3" />
                      상세 정보
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 섹션들 */}
        <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-[100px] space-y-[100px] pb-16">
          {/* 맞춤 추천 TOP3 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">당신만을 위한 추천</h2>
              <Button variant="ghost" className="text-gray-600 hover:text-black font-medium" onClick={toRanking}>
                전체 보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {personalizedTop3.map((movie, index) => (
                <div key={movie.id} className="group cursor-pointer flex-shrink-0 relative" onClick={() => onMovieClick(movie)}>
                  <div className="w-80 aspect-[16/9] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w780${movie.poster}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? "bg-red-600" : index === 1 ? "bg-orange-600" : "bg-yellow-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <Badge className="bg-white/20 text-white hover:bg-white/20 text-xs">맞춤 추천</Badge>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{movie.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{movie.year}년</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 최신 영화 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">최신 영화</h2>
              <Button variant="ghost" className="text-gray-600 hover:text-black font-medium" onClick={toMovies}>
                더보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {latest6.map((movie) => (
                <div key={movie.id} className="group cursor-pointer flex-shrink-0" onClick={() => onMovieClick(movie)}>
                  <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-600 text-white text-xs">NEW</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{movie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 이번주 인기 순위 TOP5 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">이번주 인기 순위</h2>
              <Button variant="ghost" className="text-gray-600 hover:text-black font-medium" onClick={toRanking}>
                전체 순위 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {weeklyTop5.map((movie, index) => (
                <div key={movie.id} className="group cursor-pointer flex-shrink-0 relative" onClick={() => onMovieClick(movie)}>
                  <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{movie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 리뷰 이벤트 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">리뷰 이벤트</h2>
              <Badge className="bg-purple-600 text-white hover:bg-purple-600">진행중</Badge>
            </div>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <div className="bg-gray-100 rounded-xl p-6">
              <p className="text-gray-700 mb-6">영화 리뷰를 작성하고 특별한 혜택을 받아보세요!</p>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {reviewEvent3.map((movie) => (
                  <div key={movie.id} className="group cursor-pointer flex-shrink-0" onClick={() => onMovieClick(movie)}>
                    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      <ImageWithFallback
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                          <div className="flex items-center gap-1 text-white/80 text-xs mb-2">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            리뷰 작성
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainPage;
