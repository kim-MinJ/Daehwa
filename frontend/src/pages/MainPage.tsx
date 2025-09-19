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

  popularity?: number;   // TMDB 등에 흔히 존재
  voteCount?: number;    // 없으면 rating로 대체
};
const normalizeFeeling = (feeling: string): string => {
  const base = feeling.trim();

  const synonymMap: Record<string, string> = {
    "슬프다": "슬픔",
    "슬퍼요": "우울함",

    "기쁘다": "기쁨",
    "기뻐요": "기쁨",

    "편안하다": "편안함",

    "흥분된다": "흥분됨",

    


    "짜릿하다": "짜릿함",
    "짜릿함": "짜릿함",

    "즐겁다": "즐거움",
    "즐거움": "즐거움",

    "설렌다": "설렘",
    "설렘": "설렘",



    "심심하다": "심심함",
    "심심함": "심심함",

    "놀랐다": "놀람",
    "놀람": "놀람",

    "화난다":"화남"


  };

  return synonymMap[base] || base; // 매핑 없으면 원래 단어 그대로
};


const FEELING_TO_GENRES: Record<string, string[]> = {
  "편안하다": ["드라마", "가족", "음악", "다큐멘터리"],
  "흥분된다": ["액션", "모험", "SF", "서부", "스릴러"],
  "슬프다": ["드라마", "로맨스", "다큐멘터리", "전쟁", "역사"],
  "기쁘다": ["코미디", "가족", "음악", "애니메이션"],
  "감동이다": ["드라마", "가족", "음악", "다큐멘터리"],
  "긴장된다": ["스릴러", "미스터리", "공포", "범죄"],
  "놀랐다": ["스릴러", "공포", "미스터리", "SF"],
  "짜릿하다": ["액션", "스릴러", "범죄", "SF"],
  "피곤하다": ["다큐멘터리", "역사", "드라마"],   // 가벼운 게 아니라 차분한 쪽으로
  "즐겁다": ["코미디", "가족", "애니메이션", "모험"],
  "설렌다": ["로맨스", "코미디", "애니메이션", "가족"],
  "생각난다": ["다큐멘터리", "드라마", "역사"],
  "심심하다": ["코미디", "애니메이션", "모험", "가족"],
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

function MovieCard({
  movie,
  onClick,
  badge,
}: {
  movie: UiMovie;
  onClick: (m: UiMovie) => void;
  badge?: React.ReactNode;
}) {
  return (
    <div
      className="group cursor-pointer flex-shrink-0 relative"
      onClick={() => onClick(movie)}
    >
      <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
        <ImageWithFallback
          src={getPosterUrl(movie.poster, "w500")}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {badge ? <div className="absolute top-2 right-2">{badge}</div> : null}
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded-md flex flex-col">
          <div className="font-semibold text-sm line-clamp-1">{movie.title}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{movie.year}년</span>
          </div>
          <div className="mt-1 text-[11px] opacity-90">
            {movie.genres?.join(", ") ?? "기타"}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔸 로딩 스켈레톤 (가로 스크롤과 동일한 카드 크기)
function CardSkeleton() {
  return (
    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden">
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

function MainPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [weeklyTop10, setWeeklyTop10] = useState<UiMovie[]>([]);
  const [latest, setLatest] = useState<UiMovie[]>([]);
  const [oldPopular, setOldPopular] = useState<UiMovie[]>([]);
  const [featured, setFeatured] = useState<UiMovie | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // 🔹 감정 섹션 상태
  const [feelings, setFeelings] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [feelingMovies, setFeelingMovies] = useState<UiMovie[]>([]);
  const [feelingLoading, setFeelingLoading] = useState<boolean>(false);

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
          genres: m.genres?.length ? m.genres : ["기타"],
          rating: m.voteAverage ?? 0,
          description: m.overview ?? "",
          releaseDate: m.releaseDate ?? null,
        }));
        setPopular40(movies);
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
const byPopularity = (a: UiMovie, b: UiMovie) => {
  const ap = a.popularity ?? a.voteCount ?? a.rating ?? 0;
  const bp = b.popularity ?? b.voteCount ?? b.rating ?? 0;
  if (bp !== ap) return bp - ap;
  return (b.year ?? 0) - (a.year ?? 0);
};
  // 🔹 감정 키워드 로드 (/api/feelings/all)
  useEffect(() => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get("/api/feelings/all", { headers: authHeader })
      .then(res => {
        const raw: string[] = res.data || [];
        const normalized = raw.map(normalizeFeeling);
        const unique = Array.from(new Set(normalized)); // 중복 제거
        setFeelings(unique);
      })
      .catch(err => {
        console.error("감정 키워드 로딩 실패:", err);
        setFeelings(["편안함", "흥분", "슬픔"]); // 최소 fallback도 명사형
      });
  }, [token]);

  // 🔹 감정 클릭 → 같은 영역에 영화 10개 표시
  const handleFeelingClick = async (feeling: string) => {
  console.log("[Feeling] click:", feeling);  // 디버깅 로그
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // 1) 우선 UI 전환
  setSelectedFeeling(feeling);
  setFeelingLoading(true);

  try {
    // 2) 서버 요청(성공 시 그대로 사용)
    const res = await axios.get("/api/feelings", {
      headers: authHeader,
      params: { feelingType: feeling, count: 10 },
    });

    const movies: UiMovie[] = (res.data || []).map((m: any) => ({
      id: m.movieIdx,
      title: m.title ?? "제목 없음",
      poster: m.posterPath ?? "",
      backdropPath: m.backdropPath ?? "",
      year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
      genres: m.genres?.length ? m.genres : ["기타"],
      rating: m.voteAverage ?? 0,
      description: m.overview ?? "",
      releaseDate: m.releaseDate ?? null,
    }));

    if (movies.length > 0) {
      setFeelingMovies(movies.slice(0, 10));
      return; // 성공했으면 끝
    }

    // 3) 서버 결과가 비었으면 fallback 사용
    throw new Error("empty-result");
  } catch (error) {
    console.warn("감정 추천 API 실패 또는 빈 결과 → 프론트 fallback 사용", error);

    // 🔸 프론트 Fallback: 인기/최신/추억 pool에서 감정-장르 매핑으로 필터
    const poolMap = new Map<string | number, UiMovie>();
    [...popular40, ...latest, ...oldPopular].forEach((m) => {
      if (!poolMap.has(m.id)) poolMap.set(m.id, m);
    });
    const pool = Array.from(poolMap.values());

    const targetGenres = FEELING_TO_GENRES[feeling] || [];
    let derived = pool.filter((m) => m.genres?.some((g) => targetGenres.includes(g)));

    if (derived.length < 10) {
      // 부족하면 전체에서 평점/연도 기준 보충
      const rest = pool.filter((m) => !derived.some((d) => d.id === m.id));
      derived = [...derived, ...rest];
    }

    // 정렬(평점, 연도)
    derived.sort((a, b) => {
      const r = (b.rating ?? 0) - (a.rating ?? 0);
      if (r !== 0) return r;
      return (b.year ?? 0) - (a.year ?? 0);
    });

    setFeelingMovies(derived.slice(0, 10));

    // ✅ 중요: 더 이상 selectedFeeling을 되돌리지 않음(사라지는 문제 방지)
  } finally {
    setFeelingLoading(false);
  }
};
const toUiMovie = (m: any): UiMovie => ({
  id: m.movieIdx,
  title: m.title ?? "제목 없음",
  poster: m.posterPath ?? "",
  backdropPath: m.backdropPath ?? "",
  year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
  genres: m.genres?.length ? m.genres : ["기타"],
  rating: m.voteAverage ?? 0,
  releaseDate: m.releaseDate ?? null,
  description: m.overview ?? "",

  // 🔸 인기 정렬용 필드 매핑
  popularity: m.popularity ?? m.popScore ?? undefined,
  voteCount: m.voteCount ?? m.votes ?? undefined,
});
  // 추억의 영화
  useEffect(() => {
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
          genres: m.genres?.length ? m.genres : ["기타"],
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
                  // src={getPosterUrl(featured.poster, "w500")}
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

              {/* 🔹 감정 선택 섹션: 같은 영역 전환 */}
              <div>
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
      당신만을 위한 추천
      <span className="text-sm text-gray-700 font-normal ml-3">
        기분을 선택하면 바로 추천해드려요
      </span>
    </h2>

    {selectedFeeling && (
      <Button
        variant="outline"
        className="text-sm"
        onClick={() => {
          setSelectedFeeling(null);
          setFeelingMovies([]);
        }}
      >
        다른 기분 선택하기
      </Button>
    )}
  </div>
  <div className="w-full h-px bg-gray-200 mb-6" />

  {/* 버튼 선택 전: 기존 흰색 버튼 유지 */}
  {!selectedFeeling && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {feelings.map((feeling) => (
      <button
        key={feeling}
        type="button"
        onClick={() => handleFeelingClick(feeling)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleFeelingClick(feeling)}
        className="group w-full rounded-2xl border border-gray-200 bg-white px-6 py-5 md:px-7 md:py-6
                   shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.98]
                   transition focus:outline-none focus:ring-2 focus:ring-blue-500/30
                   flex items-center justify-center gap-3"
      >
        <span className="text-2xl md:text-3xl">🎬</span>
        <span className="text-base md:text-lg font-semibold text-gray-900">{feeling}</span>
      </button>
    ))}
  </div>
)}

  {/* 선택 후: 같은 자리에서 최신 영화 카드와 동일 UI로 10개 */}
  {selectedFeeling && (
    <>
      {feelingLoading ? (
        <HorizontalScrollList>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <CardSkeleton />
            </div>
          ))}
        </HorizontalScrollList>
      ) : (
        <HorizontalScrollList>
          {feelingMovies.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </HorizontalScrollList>
      )}
    </>
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