import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Star, Info } from "lucide-react";
import { HorizontalScrollList } from "@/components/HorizontalScrollList";

// UI 타입
type UiMovie = {
  id: string | number;
  title: string;
  poster: string;
  backdropPath: string; // ← 여기 추가
  year: number;
  genres: string[];
  rating: number;
  description?: string;
  releaseDate?: string | null;
};

const genreMap: Record<number, string> = {
  28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디",
  80: "범죄", 99: "다큐멘터리", 18: "드라마", 10751: "가족",
  14: "판타지", 36: "역사", 27: "공포", 10402: "음악",
  9648: "미스터리", 10749: "로맨스", 878: "SF", 10770: "TV 영화",
  53: "스릴러", 10752: "전쟁", 37: "서부",
};

const genreEnToKr: Record<string, string> = {
  "Action": "액션", "Adventure": "모험", "Animation": "애니메이션",
  "Comedy": "코미디", "Crime": "범죄", "Documentary": "다큐멘터리",
  "Drama": "드라마", "Family": "가족", "Fantasy": "판타지",
  "History": "역사", "Horror": "공포", "Music": "음악",
  "Mystery": "미스터리", "Romance": "로맨스", "Science Fiction": "SF",
  "TV Movie": "TV 영화", "Thriller": "스릴러", "War": "전쟁",
  "Western": "서부",
};

const getPosterUrl = (path: string | undefined, size: string = "w500") => {
  if (!path || path.trim() === "") return "/fallback.png";
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`;
};

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-gray-600 text-lg">로딩중...</span>
      </div>
    </div>
  );
}

function MainPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [popular40, setPopular40] = useState<UiMovie[]>([]);
  const [weeklyTop10, setWeeklyTop10] = useState<UiMovie[]>([]);
  const [personalizedTop3, setPersonalizedTop3] = useState<UiMovie[]>([]);
  const [latest, setLatest] = useState<UiMovie[]>([]);
  const [reviewEvent3, setReviewEvent3] = useState<UiMovie[]>([]);
  const [oldPopular, setOldPopular] = useState<UiMovie[]>([]);
  const [featured, setFeatured] = useState<UiMovie | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onMovieClick = (m: UiMovie) => navigate(`/movies/${m.id}`);

  // 인기 영화 & 최신 영화 & 맞춤 추천
  useEffect(() => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const fetchPopular = async () => {
      setLoading(true); setErr(null);
      try {
        const res = await axios.get("/api/movies/popular", {
          headers: authHeader,
          params: { count: 40 },
        });
        const movies: UiMovie[] = res.data.map((m: any) => ({
          id: m.movieIdx,
          title: m.title ?? "제목 없음",
          poster: m.posterPath  ?? "",
          backdropPath: m.backdropPath ?? "",
          year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
          genres: m.genres?.length
            ? m.genres.map((g: string) => genreEnToKr[g] ?? "기타")
            : m.genreIds?.length
              ? m.genreIds.map((id: number) => genreMap[id] ?? "기타")
              : ["기타"],
          rating: m.voteAverage ?? 0,
          description: m.overview ?? "",
          releaseDate: m.releaseDate ?? null,
        }));
        setPopular40(movies);
        setWeeklyTop10(movies.slice(0, 10));

        // featured: 인기 40개 중 상위 20개에서 랜덤
        if (movies.length > 0) {
          const top20 = movies.slice(0, 20);
          const randomIndex = Math.floor(Math.random() * top20.length);
          setFeatured(top20[randomIndex]);
        }

        // 최신 영화 6개월 기준
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const latestMovies = movies.filter(m => m.releaseDate && new Date(m.releaseDate) >= sixMonthsAgo);
        setLatest([...latestMovies].sort(() => Math.random() - 0.5).slice(0, 10));

        // 맞춤 추천 / 리뷰 이벤트
        const shuffled = [...movies].sort(() => Math.random() - 0.5);
        setPersonalizedTop3(shuffled.slice(0, 3));
        setReviewEvent3(shuffled.slice(3, 6));

      } catch (error) {
        console.error("영화 로딩 실패:", error);
        setErr("영화를 불러오는데 실패했습니다.");
      } finally { setLoading(false); }
    };
    fetchPopular();
  }, [token]);

  // 추억의 영화
  useEffect(() => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const fetchOldPopular = async () => {
      try {
        const res = await axios.get("/api/movies/oldpopular", {
          headers: authHeader,
          params: { count: 40 },
        });
        const movies: UiMovie[] = res.data.map((m: any) => ({
          id: m.movieIdx,
          title: m.title ?? "제목 없음",
          poster: m.posterPath ?? "",
          year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
          genres: m.genres?.length
            ? m.genres.map((g: string) => genreEnToKr[g] ?? "기타")
            : m.genreIds?.length
              ? m.genreIds.map((id: number) => genreMap[id] ?? "기타")
              : ["기타"],
          rating: m.voteAverage ?? 0,
          description: m.overview ?? "",
          releaseDate: m.releaseDate ?? null,
        }));
        setOldPopular([...movies].sort(() => Math.random() - 0.5).slice(0, 10));
      } catch (error) {
        console.error("추억의 영화 로딩 실패:", error);
      }
    };
    fetchOldPopular();
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {loading && <LoadingSpinner />}

        {!loading && (
          <>
            {featured && (
              <div
                className="relative h-[85vh] mb-8 cursor-pointer"
                onClick={() => onMovieClick(featured)}
              >
                <ImageWithFallback
                  // src={getPosterUrl(featured.poster, "w500")}  // 포스터로
                  src={getPosterUrl(featured.backdropPath, "original")} // 이거로하면 배경화면
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-8 lg:pb-16">
                    <div className="max-w-lg text-white">
                      <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">{featured.title}</h1>
                      {featured.description && (
                        <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6">
                          {featured.description.slice(0, 200)}...
                        </p>
                      )}
                      <div className="flex items-center gap-4 mb-8 text-white/80">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="text-lg font-semibold">{featured.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{featured.year}년</span>
                        <span>•</span>
                        <span>{featured.genres?.join(", ") ?? "기타"}</span>
                      </div>
                      <div className="flex justify-start">
                        <Button className="bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg">
                          <Info className="h-6 w-6 mr-3" />
                          상세 정보
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <section className="max-w-7xl mx-auto px-8 lg:px-16 pt-[100px] space-y-[100px] pb-16">

              {/* 맞춤 추천 TOP3 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    당신만을 위한 추천
                    <span className="text-sm text-gray-700 font-normal ml-3">
                      사소하지만 널 위해 준비해봤어...받아...줄래...?
                    </span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                <HorizontalScrollList>
                  {personalizedTop3.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer flex-shrink-0 relative"
                      onClick={() => onMovieClick(movie)}
                    >
                      <div className="w-80 aspect-[16/9] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                        <ImageWithFallback
                          src={getPosterUrl(movie.poster, "original")}
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
                              <span>•</span>
                              <span>{movie.genres?.join(", ") ?? "기타"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </HorizontalScrollList>
              </div>

              {/* 최신 영화 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    최신 영화
                    <span className="text-sm text-gray-700 font-normal ml-3">이거? 지금 볼만한데? 도전? ㄱ?</span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                <HorizontalScrollList>
                  {latest.map((movie, index) => (
                    <div key={`${movie.id}-${index}`} className="group cursor-pointer flex-shrink-0" onClick={() => onMovieClick(movie)}>
                      <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                        <ImageWithFallback src={getPosterUrl(movie.poster, "w500")} alt={movie.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-600 text-white text-xs">NEW</Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded-md flex flex-col">
                          <div className="font-semibold text-sm line-clamp-1">{movie.title}</div>
                          <div className="flex items-center gap-1 text-xs mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{movie.year}년</span>
                          </div>
                          <div className="mt-1 text-xs">{movie.genres?.join(", ") ?? "기타"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </HorizontalScrollList>
              </div>

              {/* weeklyTop10 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    이번주 인기 순위
                    <span className="text-sm text-gray-700 font-normal ml-3">지금 이거 놓치면 후회합니다?</span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                <HorizontalScrollList>
                  {weeklyTop10.map((movie, index) => (
                    <div key={`${movie.id}-${index}`} className="group cursor-pointer flex-shrink-0 relative" onClick={() => onMovieClick(movie)}>
                      <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                        <ImageWithFallback src={getPosterUrl(movie.poster, "w500")} alt={movie.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{index+1}</div>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded-md flex flex-col">
                          <h4 className="font-semibold text-sm line-clamp-2">{movie.title}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{movie.year}년</span>
                          </div>
                          <div className="mt-1 text-xs">{movie.genres?.join(", ") ?? "기타"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </HorizontalScrollList>
              </div>

              {/* 추억의 영화 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    추억의 영화
                    <span className="text-sm text-gray-700 font-normal ml-3">
                      옛날 그 감성, 그 기분 지금 다시 느껴보시는건 어떨까요?
                    </span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                <HorizontalScrollList>
                  {oldPopular.map((movie, index) => (
                    <div key={`${movie.id}-${index}`} className="group cursor-pointer flex-shrink-0" onClick={() => onMovieClick(movie)}>
                      <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                        <ImageWithFallback src={getPosterUrl(movie.poster, "w500")} alt={movie.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded-md flex flex-col">
                          <h4 className="font-semibold text-sm line-clamp-2">{movie.title}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{movie.year}년</span>
                          </div>
                          <div className="mt-1 text-xs">{movie.genres?.join(", ") ?? "기타"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </HorizontalScrollList>
              </div>

            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default MainPage;
