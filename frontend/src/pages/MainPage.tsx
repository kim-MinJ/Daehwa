import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Star, Info } from "lucide-react";
import { HorizontalScrollList } from "@/components/HorizontalScrollList";

const genreEnToKr: Record<string, string> = {
  "Action": "액션",
  "Adventure": "모험",
  "Animation": "애니메이션",
  "Comedy": "코미디",
  "Crime": "범죄",
  "Documentary": "다큐멘터리",
  "Drama": "드라마",
  "Family": "가족",
  "Fantasy": "판타지",
  "History": "역사",
  "Horror": "공포",
  "Music": "음악",
  "Mystery": "미스터리",
  "Romance": "로맨스",
  "Science Fiction": "SF",
  "TV Movie": "TV 영화",
  "Thriller": "스릴러",
  "War": "전쟁",
  "Western": "서부",
};

type UiMovie = {
  id: string | number;
  title: string;
  poster: string;
  backdropPath: string;
  year: number;
  genres: string[];
  rating: number;
  description?: string;
  releaseDate?: string | null;
};

const getPosterUrl = (path: string | undefined, size: string = "w500") => {
  if (!path || path.trim() === "") return "/fallback.png";
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`;
};

const convertGenresToKr = (genresEn: string[]): string[] =>
  genresEn.map(g => genreEnToKr[g] ?? "기타");

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

const mapApiMovieBasic = (m: any): UiMovie => ({
  id: m.movieIdx,
  title: m.title ?? "제목 없음",
  poster: m.posterPath ?? "",
  backdropPath: m.backdropPath ?? "",
  year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
  genres: [],
  rating: m.voteAverage ?? 0,
  description: m.overview ?? "",
  releaseDate: m.releaseDate ?? null,
});

function MainPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [weeklyTop10, setWeeklyTop10] = useState<UiMovie[]>([]);
  const [latest, setLatest] = useState<UiMovie[]>([]);
  const [oldPopular, setOldPopular] = useState<UiMovie[]>([]);
  const [featured, setFeatured] = useState<UiMovie | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [feelingMovies, setFeelingMovies] = useState<UiMovie[]>([]);

  const onMovieClick = (m: UiMovie) => navigate(`/movies/${m.id}`);

  const fetchMoviesWithGenres = async (url: string, params?: any) => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(url, { headers: authHeader, params });
    const moviesBasic: UiMovie[] = res.data.map(mapApiMovieBasic);

    const moviesWithGenres = await Promise.all(
      moviesBasic.map(async (m) => {
        try {
          const genreRes = await axios.get(`/api/movies/${m.id}/genres`, { headers: authHeader });
          const genresKr = convertGenresToKr(genreRes.data ?? []);
          return { ...m, genres: genresKr };
        } catch {
          return { ...m, genres: ["기타"] };
        }
      })
    );

    return moviesWithGenres;
  };

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const movies = await fetchMoviesWithGenres("/api/movies/popular", { count: 40 });
        setWeeklyTop10(movies.slice(0, 10));

        if (movies.length > 0) {
          const top20 = movies.slice(0, 20);
          const randomIndex = Math.floor(Math.random() * top20.length);
          setFeatured(top20[randomIndex]);
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const latestMovies = movies.filter(m => m.releaseDate && new Date(m.releaseDate) >= sixMonthsAgo);
        setLatest([...latestMovies].sort(() => Math.random() - 0.5).slice(0, 20));

      } catch (error) {
        console.error("영화 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [token]);

  const handleFeelingClick = async (feeling: string) => {
    if (!token) return;
    try {
      setSelectedFeeling(feeling);
      setLoading(true);
      const movies = await fetchMoviesWithGenres("/api/feeling", { feelingType: feeling });
      setFeelingMovies(movies);
    } catch (error) {
      console.error("감정 추천 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOldPopular = async () => {
      try {
        const movies = await fetchMoviesWithGenres("/api/movies/oldpopular", { count: 40 });
        setOldPopular([...movies].sort(() => Math.random() - 0.5).slice(0, 12));
      } catch (error) {
        console.error("추억의 영화 로딩 실패:", error);
      }
    };
    fetchOldPopular();
  }, [token]);

  // 공통 카드 컴포넌트
  const MovieCard = ({ movie, badgeText }: { movie: UiMovie, badgeText?: string }) => (
  <div className="group cursor-pointer flex-shrink-0 relative w-48">
    <div className="aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
      <ImageWithFallback src={getPosterUrl(movie.poster, "w500")} alt={movie.title} className="w-full h-full object-cover" />
      {badgeText && (
        <div className="absolute top-2 left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">{badgeText}</div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 rounded-md text-white text-xs">
        <div className="font-semibold text-sm line-clamp-1">{movie.title}</div>
        <div className="flex items-center gap-1 mt-1 text-xs">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span>{movie.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{movie.year}년</span>
        </div>
        <div className="mt-1">{movie.genres.join(", ")}</div>
      </div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {loading && <LoadingSpinner />}
        {!loading && (
          <>
            {/* Featured */}
            {featured && (
              <div
                className="relative h-[85vh] mb-8 cursor-pointer"
                onClick={() => onMovieClick(featured)}
              >
                <ImageWithFallback
                  src={getPosterUrl(featured.backdropPath, "original")}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-8 lg:pb-16">
                    <div className="max-w-lg text-white">
                      <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">{featured.title}</h1>
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
                        <span>{featured.genres?.join(", ")}</span>
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
              {/* 맞춤 추천 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    당신만을 위한 추천
                    <span className="text-sm text-gray-700 font-normal ml-3">사소하지만 널 위해 준비해봤어...받아...줄래...?</span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                {!selectedFeeling && (
                  <div className="flex gap-4 mb-4">
                    <Button onClick={() => handleFeelingClick("편안함")}>편안함</Button>
                    <Button onClick={() => handleFeelingClick("흥분")}>흥분</Button>
                    <Button onClick={() => handleFeelingClick("슬픔")}>슬픔</Button>
                  </div>
                )}
                {selectedFeeling && feelingMovies.length > 0 && (
                  <HorizontalScrollList>
  {selectedFeeling && feelingMovies.map((movie) => (
    <MovieCard key={movie.id} movie={movie} />
  ))}
</HorizontalScrollList>
                )}
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
  {latest.map((movie) => (
    <MovieCard key={movie.id} movie={movie} />
  ))}
</HorizontalScrollList>
              </div>

              {/* 이번주 인기 */}
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
    <MovieCard key={movie.id} movie={movie} badgeText={`${index+1}`} />
  ))}
</HorizontalScrollList>
              </div>

              {/* 추억의 영화 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
                    추억의 영화
                    <span className="text-sm text-gray-700 font-normal ml-3">옛날 그 감성, 그 기분 지금 다시 느껴보시는건 어떨까요?</span>
                  </h2>
                </div>
                <div className="w-full h-px bg-gray-200 mb-6" />
                
<HorizontalScrollList>
  {oldPopular.map((movie) => (
    <MovieCard key={movie.id} movie={movie} />
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