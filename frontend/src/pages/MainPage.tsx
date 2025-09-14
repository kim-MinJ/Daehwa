// src/pages/MainPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Star, Info, ChevronRight, MessageSquare } from "lucide-react";

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

// 포스터 URL 처리
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

  const [loading, setLoading] = useState<boolean>(true);
  const [popular40, setPopular40] = useState<UiMovie[]>([]);
  const [weeklyTop10, setWeeklyTop10] = useState<UiMovie[]>([]);
  const [personalizedTop3, setPersonalizedTop3] = useState<UiMovie[]>([]);
  const [latest6, setLatest6] = useState<UiMovie[]>([]);
  const [reviewEvent3, setReviewEvent3] = useState<UiMovie[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const onMovieClick = (m: UiMovie) => navigate(`/movies/${m.id}`);
  const toRanking = () => navigate("/ranking");
  const toMovies = () => navigate("/movies");

  useEffect(() => {
    if (!token) return;

    const authHeader = { Authorization: `Bearer ${token}` };

    const fetchPopular = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await axios.get("http://localhost:8080/api/movies/popular", {
          headers: authHeader,
          params: { count: 40 },
        });
        // 백엔드 데이터 UiMovie로 매핑
        const movies: UiMovie[] = res.data.map((m: any) => ({
          id: m.movieIdx,
          title: m.title ?? "제목 없음",
          poster: m.posterPath ?? "",
          year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
          genre: m.genre ?? "기타",
          rating: m.voteAverage ?? 0,
          runtime: m.runtime ?? 0,
          description: m.overview ?? "",
        }));

        setPopular40(movies);
        setWeeklyTop10(movies.slice(0, 10));

        // 랜덤 섞기
        const shuffled = [...movies].sort(() => Math.random() - 0.5);
        setPersonalizedTop3(shuffled.slice(0, 3));
        setLatest6(shuffled.slice(0, 6));
        setReviewEvent3(shuffled.slice(3, 6));
      } catch (error) {
        console.error("영화 로딩 실패:", error);
        setErr("영화를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [token]);
  
// featured 선택 (랜덤)
const featured = useMemo(() => {
  if (weeklyTop10.length === 0) return personalizedTop3[0] ?? latest6[0];
  const randomIndex = Math.floor(Math.random() * weeklyTop10.length);
  return weeklyTop10[randomIndex];
}, [weeklyTop10, personalizedTop3, latest6]);

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 히어로 섹션 */}
{featured && (
  <div className="relative h-[85vh] mb-8 cursor-pointer" onClick={() => onMovieClick(featured)}>
    {/* 배경 이미지 */}
    <ImageWithFallback
      src={getPosterUrl(featured.poster, "w500")}
      alt={featured.title}
      className="w-full h-full object-cover"
    />
    {/* 그라데이션 */}
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

    {/* 텍스트 영역 (클릭 이벤트는 부모 div에서 처리) */}
    <div className="absolute bottom-0 left-0 w-full">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-8 lg:pb-16">
        <div className="max-w-lg text-white">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
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
              <span className="text-lg font-semibold">{featured.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{featured.year}년</span>
            <span>•</span>
            <span>{featured.runtime}분</span>
            <span>•</span>
            <span>{featured.genre}</span>
          </div>
          <div className="flex justify-start">
            {/* 상세 정보 버튼도 부모 클릭 이벤트 활용 */}
            <Button
              className="bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg"
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

            <section className="max-w-7xl mx-auto px-8 lg:px-16 pt-[100px] space-y-[100px] pb-16">
              {/* 맞춤 추천 TOP3 */}
              <div>
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
                          src={getPosterUrl(movie.poster, "w780")}
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
              </div>

              {/* 최신 영화 */}
              <div>
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
                          src={getPosterUrl(movie.poster, "w500")}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-600 text-white text-xs">NEW</Badge>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded-md">
                          <div className="font-semibold line-clamp-1">{movie.title}</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이번주 인기 TOP5 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-600">이번주 인기 순위</h2>
                  <Button variant="ghost" className="text-gray-600 hover:text-black font-medium" onClick={toRanking}>
                    전체 순위 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                  {weeklyTop10.slice(0, 10).map((movie, index) => (
  <div key={movie.id} className="group cursor-pointer flex-shrink-0 relative" onClick={() => onMovieClick(movie)}>
    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
      <ImageWithFallback
        src={getPosterUrl(movie.poster, "w500")}
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
              </div>

              {/* 리뷰 이벤트 */}
              <div>
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
                            src={getPosterUrl(movie.poster, "w500")}
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
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default MainPage;
