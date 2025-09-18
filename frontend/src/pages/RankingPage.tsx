import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  TrendingUp,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Star,
  Crown,
  Medal,
  Filter,
} from "lucide-react";

export interface Movie {
  id: number;
  movieIdx: string; // 추가
  tmdbMovieId: string;
  title: string;
  poster: string;
  year: string;
  genres: string[];
  genre: string;
  rating: number;
  runtime: number;
  description: string;
  director: string;
  rank: number;
  voteCount: number;
}

type Page = "home" | "movies" | "ranking" | "reviews" | "movie-detail";

const genreMap: { [key: number]: string } = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

const genreTranslation: { [key: string]: string } = {
  "액션": "Action",
  "모험": "Adventure",
  "애니메이션": "Animation",
  "코미디": "Comedy",
  "범죄": "Crime",
  "다큐멘터리": "Documentary",
  "드라마": "Drama",
  "가족": "Family",
  "판타지": "Fantasy",
  "역사": "History",
  "공포": "Horror",
  "음악": "Music",
  "미스터리": "Mystery",
  "로맨스": "Romance",
  "SF": "Science Fiction",
  "TV 영화": "TV Movie",
  "스릴러": "Thriller",
  "전쟁": "War",
  "서부": "Western",
};

interface RankingPageProps {
  onMovieClick?: (movie: Movie) => void;
  onNavigation?: (page: Page) => void;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600">로딩중...</span>
    </div>
  );
}

export default function RankingPage({
  onMovieClick,
  onNavigation,
}: RankingPageProps) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [topMovie, setTopMovie] = useState<Movie | null>(null);
  const [secondMovie, setSecondMovie] = useState<Movie | null>(null);
  const [selectedVote, setSelectedVote] = useState<"first" | "second" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState("액션");
  const [genreCurrentSlide, setGenreCurrentSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const moviesPerSlide = 4;
  const [votePercentages, setVotePercentages] = useState({ top: 0, second: 0 });

  const TMDB_API_KEY = "302b783e860b19b6822ef0a445e7ae53";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  const getCachedPoster = (title: string): string | null => {
    return localStorage.getItem(`poster_${title}`);
  };

  const setCachedPoster = (title: string, posterUrl: string) => {
    localStorage.setItem(`poster_${title}`, posterUrl);
  };

  const fetchPosterFromTMDB = async (title: string, year?: string) => {
    const cached = getCachedPoster(title);
    if (cached) return cached;

    try {
      const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          language: "ko-KR",
          include_adult: false,
          year: year || undefined,
        },
      });

      if (res.data.results && res.data.results.length > 0) {
        const posterUrl = `${TMDB_IMAGE_BASE}${res.data.results[0].poster_path}`;
        setCachedPoster(title, posterUrl);
        return posterUrl;
      }
    } catch (err) {
      console.error("TMDB 포스터 가져오기 실패:", err);
    }

    return "/fallback.png";
  };

  const handleMovieClick = (movie: Movie) => {
    if (!movie) return;
    navigate(`/movies/${movie.id}`, { state: { movie } });
  };

  
useEffect(() => {
  const topVotes = topMovie?.voteCount || 0;
  const secondVotes = secondMovie?.voteCount || 0;
  const total = topVotes + secondVotes;
  setVotePercentages({
    top: total > 0 ? Math.round((topVotes / total) * 100) : 0,
    second: total > 0 ? 100 - Math.round((topVotes / total) * 100) : 0,
  });
}, [topMovie, secondMovie]);
  

  // 백엔드 데이터 로드
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/movies/trending");
        console.log("API 응답:", res.data);

        if (!res.data || res.data.length < 2) {
          setTopMovie(null);
          setSecondMovie(null);
          setMovies([]);
          return;
        }

        const movieRes: Movie[] = res.data.map((m: any, idx: number) => ({
  id: Number(m.movieIdx || m.tmdbMovieId), // number로 변환
  movieIdx: m.movieIdx?.toString() || "",
  tmdbMovieId: m.tmdbMovieId,
  title: m.title,
  poster: m.posterPath ? `https://image.tmdb.org/t/p/w500${m.posterPath}` : "/fallback.png",
  year: m.year?.slice(0, 4) || "N/A",
  genres: m.genres || [],
  genre: m.genres?.[0] || "",
  rating: m.rating || 0,
  runtime: m.runtime || 0,
  description: m.overview || "",
  director: m.director || "알 수 없음",
  voteCount: m.voteCount || 0,
  rank: idx + 1,
}));

        console.log("정리된 영화 배열:", movieRes);
        setMovies(movieRes);
setTopMovie(movieRes[0] || null);
setSecondMovie(movieRes[1] || null);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setTopMovie(null);  
        setSecondMovie(null);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  const topMovieVotes = topMovie?.voteCount || 0;
  const secondMovieVotes = secondMovie?.voteCount || 0;
  const totalVotes = topMovieVotes + secondMovieVotes;
  const topMoviePercentage =
    totalVotes > 0 ? Math.round((topMovieVotes / totalVotes) * 100) : 0;
  const secondMoviePercentage = totalVotes > 0 ? 100 - topMoviePercentage : 0;

// 로그인된 유저 정보 가져오기
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

const handleVote = async (choice: "first" | "second") => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    alert("로그인 후 투표할 수 있습니다.");
    return;
  }

  try {
    const movieId = choice === "first" ? topMovie?.id : secondMovie?.id;
    if (!movieId) return;

    await axios.post("http://localhost:8080/api/movies/vote", null, {
      params: {
        movieId: Number(movieId),
        userId: currentUser.userId,   // ✅ 로그인된 유저 ID 사용
      },
    });

    setSelectedVote(choice);
    setHasVoted(true);

    if (choice === "first" && topMovie) {
      const updatedTop = { ...topMovie, voteCount: (topMovie.voteCount || 0) + 1 };
      setTopMovie(updatedTop);
    } else if (choice === "second" && secondMovie) {
      const updatedSecond = { ...secondMovie, voteCount: (secondMovie.voteCount || 0) + 1 };
      setSecondMovie(updatedSecond);
    }
  } catch (err: any) {
    console.error("투표 실패:", err.response?.data || err.message);
    alert(err.response?.data?.error || "투표에 실패했습니다.");
  }
};


  const boxOfficeMovies = movies.slice(0, 10);
  const totalSlides = Math.ceil(Math.max(boxOfficeMovies.length, 1) / moviesPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const getCurrentSlideMovies = () => {
    const start = currentSlide * moviesPerSlide;
    return boxOfficeMovies.slice(start, start + moviesPerSlide);
  };

  const getMoviesByGenre = (genre: string) => {
    const englishGenre = genreTranslation[genre] || genre;
    return movies
      .filter((movie) => movie.genres?.includes(englishGenre))
      .sort((a, b) => b.rating - a.rating);
  };

  const genreMovies = getMoviesByGenre(selectedGenre);
  const genreTotalSlides = Math.ceil(Math.max(genreMovies.length, 1) / moviesPerSlide);
  const nextGenreSlide = () =>
    setGenreCurrentSlide((prev) => (prev + 1) % genreTotalSlides);
  const prevGenreSlide = () =>
    setGenreCurrentSlide((prev) => (prev - 1 + genreTotalSlides) % genreTotalSlides);
  const getCurrentGenreSlideMovies = () => {
    const start = genreCurrentSlide * moviesPerSlide;
    return genreMovies.slice(start, start + moviesPerSlide);
  };
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setGenreCurrentSlide(0);
  };

  const genreAvg =
    genreMovies.length > 0
      ? genreMovies.reduce((sum, m) => sum + m.rating, 0) / genreMovies.length
      : 0;
  const genreCount = genreMovies.length;
  const genreBest = genreMovies.length > 0 ? genreMovies[0].rating : 0;

  return (
    <div className="min-h-screen bg-white">
      <div style={{ backgroundColor: "#E4E4E4" }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-black">영화 랭킹</h1>
          </div>
          <p className="text-black/70 mt-2">실시간 업데이트되는 영화 순위를 확인하세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        {/* VS 섹션 */}
        <div className="mb-12">
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/30">
            {!topMovie || !secondMovie ? (
              <div className="text-center py-16 text-gray-500 font-semibold">
                현재 투표중인 영화가 없습니다
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">최고 평점 대결</h2>
                  <p className="text-gray-600 text-lg">이번 주 최고 평점 영화들의 투표 현황</p>
                  {hasVoted && (
  <div className="w-40 bg-gray-700 rounded-full h-4 mb-2">
    <div
      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-300"
      style={{ width: `${votePercentages.top}%` }}
    />
  </div>
)}
                </div>

                <div className="flex items-center justify-center gap-12">
                  {/* 1위 영화 */}
                  <div className="text-center flex flex-col items-center">
                    <div className="group cursor-pointer" onClick={() => handleMovieClick(topMovie)}>
                      <div className="relative mb-4">
                        <div className="w-48 h-64 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                          <ImageWithFallback src={topMovie.poster} alt={topMovie.title} className="w-full h-full object-cover"/>
                        </div>
                        <div className="absolute -top-3 -left-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="w-48 h-28 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-500 transition-colors line-clamp-2 break-words">
                            {topMovie.title}
                          </h3>
                          <p className="text-gray-600 mb-2 text-sm truncate">{topMovie.director}</p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-xl text-gray-800">{topMovie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-48 mt-4">
                      {!hasVoted ? (
                        <Button onClick={() => handleVote("first")} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold w-full">
                          이 영화에 투표
                        </Button>
                      ) : (
                        <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                          <div className="font-bold text-xl mb-1" style={{ color: "#000000" }}>
                            {topMoviePercentage}%
                          </div>
                          <div className="text-sm" style={{ color: "#000000" }}>
                            {topMovieVotes.toLocaleString()}표
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-2xl mb-3">
                      <span className="text-white font-bold text-2xl">VS</span>
                    </div>
                    <p className="text-gray-600 mb-3">대결</p>
                    {hasVoted && (
                      <>
                        <div className="w-40 bg-gray-700 rounded-full h-4 mb-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${topMoviePercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">실시간 투표</p>
                      </>
                    )}
                  </div>

                  {/* 2위 영화 */}
                  <div className="text-center flex flex-col items-center">
                    <div className="group cursor-pointer" onClick={() => handleMovieClick(secondMovie)}>
                      <div className="relative mb-4">
                        <div className="w-48 h-64 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                          <ImageWithFallback src={secondMovie.poster} alt={secondMovie.title} className="w-full h-full object-cover"/>
                        </div>
                        <div className="absolute -top-3 -left-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                            <Medal className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="w-48 h-28 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 break-words">
                            {secondMovie.title}
                          </h3>
                          <p className="text-gray-600 mb-2 text-sm truncate">{secondMovie.director}</p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-xl text-gray-800">{secondMovie.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-48 mt-4">
                      {!hasVoted ? (
                        <Button onClick={() => handleVote("second")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full">
                          이 영화에 투표
                        </Button>
                      ) : (
                        <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                          <div className="font-bold text-xl mb-1" style={{ color: "#000000" }}>
                            {secondMoviePercentage}%
                          </div>
                          <div className="text-sm" style={{ color: "#000000" }}>
                            {secondMovieVotes.toLocaleString()}표
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

            {/* 투표 참여 안내 */}
            <div className="mt-8 text-center">
              {!hasVoted ? (
                <div className="bg-blue-600/20 rounded-xl p-4 inline-block border border-blue-500/30">
                  <p className="text-blue-600">
                    🗳️ <span className="font-semibold">어떤 영화가 더 좋았나요? 투표해주세요!</span>
                  </p>
                </div>
              ) : (
                <div className="bg-green-600/20 rounded-xl p-4 inline-block border border-green-500/30">
                  <p className="text-green-600">
                    ✅ <span className="font-semibold">투표가 완료되었습니다!</span>
                  </p>
                  <p className="text-green-500 text-sm mt-1">투표는 매주 월요일 초기화됩니다</p>
                </div>
              )}
            </div>


        {/* === 박스오피스 TOP 10 === */}
        <div className="mb-12">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-7 w-7 text-white" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">박스오피스 TOP 10</h3>
                    <p className="text-red-100">별점 합계 기준</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalSlides <= 1}
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <span className="text-white/70 text-sm px-2">
                    {currentSlide + 1} / {totalSlides}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalSlides <= 1}
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getCurrentSlideMovies().map((movie) => (
                  <div
                    key={movie.id}
                    className="group cursor-pointer bg-white/80 rounded-lg p-4 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-sm border border-gray-300"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="absolute -top-2 -left-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg ${
                            movie.rank === 1
                              ? "bg-yellow-500"
                              : movie.rank === 2
                              ? "bg-gray-400"
                              : movie.rank === 3
                              ? "bg-orange-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {movie.rank}
                        </div>
                      </div>

                      {movie.rank && movie.rank <= 3 && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                            {movie.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                            {movie.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                            {movie.rank === 3 && <Trophy className="h-5 w-5 text-orange-500" />}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{movie.director}</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-800">{movie.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === 장르별 베스트 === */}
        <div className="mb-12">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="h-7 w-7 text-white" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">장르별 베스트</h3>
                    <p className="text-purple-100">선택한 장르의 최고 평점 영화들</p>
                  </div>
                </div>
                {/* 장르 슬라이드 컨트롤 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevGenreSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={genreTotalSlides <= 1}
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <span className="text-white/70 text-sm px-2">
                    {genreCurrentSlide + 1} / {genreTotalSlides}
                  </span>
                  <button
                    onClick={nextGenreSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={genreTotalSlides <= 1}
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* 장르 선택 버튼들 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">장르 선택</h4>
                <div className="flex flex-wrap gap-3">
                  {Object.values(genreMap).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreChange(genre)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedGenre === genre
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* 선택된 장르의 영화들 */}
              {genreMovies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {getCurrentGenreSlideMovies().map((movie, index) => {
                    const absoluteIndex = genreCurrentSlide * moviesPerSlide + index;
                    return (
                      <div
                        key={movie.id}
                        className="group cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                          <ImageWithFallback
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />

                          {/* 순위 배지 */}
                          <div className="absolute top-3 left-3">
                            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              #{absoluteIndex + 1}
                            </div>
                          </div>

                          {/* 평점 배지 */}
                          <div className="absolute top-3 right-3">
                            <div className="bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-white text-xs font-semibold">
                                {movie.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {/* 호버 오버레이 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="text-white/80 text-sm mb-2">
                                {movie.year}년 • {movie.director}
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-white font-semibold">
                                  {movie.rating.toFixed(1)}
                                </span>
                                <span className="text-white/60">평점</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-purple-500 transition-colors mb-2">
                            {movie.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-2">{movie.director}</p>

                          {/* 장르와 년도 */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                              {selectedGenre}
                            </span>
                            <span className="text-gray-500">{movie.year}년</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Filter className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg">해당 장르의 영화가 없습니다</p>
                    <p className="text-sm">다른 장르를 선택해 보세요</p>
                  </div>
                </div>
              )}

              {/* ✅ 장르별 통계 (영화가 있을 때만) */}
              {genreMovies.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <h4 className="font-semibold text-gray-800 mb-4">{selectedGenre} 장르 통계</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 평균 평점 */}
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">평균 평점</span>
                        <span className="text-sm font-bold text-purple-600">
                          {genreAvg.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min((genreAvg / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 작품 수 */}
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">작품 수</span>
                        <span className="text-sm font-bold text-purple-600">{genreCount}편</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min((genreCount / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 최고 평점 */}
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">최고 평점</span>
                        <span className="text-sm font-bold text-purple-600">
                          {genreBest.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min((genreBest / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 랭킹 안내 */}
        <div className="mt-8 text-center">
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">📊 랭킹 기준:</span> 평점, 관객수, 리뷰 점수를 종합하여 산정
            </p>
            <p className="text-gray-600 text-sm">매일 오전 6시에 업데이트됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}