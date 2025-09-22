import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/imageFallback/ImageWithFallback";
import { TrendingUp, Trophy, ChevronLeft, ChevronRight, Star, Crown, Medal } from "lucide-react";
import { useMovieStore, Movie as StoreMovie } from "../store/movieStore";
import { getPosterUrl } from "@/utils/getPosterUrl";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6 col-span-full">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600">로딩중...</span>
    </div>
  );
}

export default function RankingPage() {
  const navigate = useNavigate();
  const { movies, allMovies, fetchAllHybrid } = useMovieStore();

  const [topMovie, setTopMovie] = useState<StoreMovie | null>(null);
  const [secondMovie, setSecondMovie] = useState<StoreMovie | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState<"first" | "second" | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const moviesPerSlide = 4;
  const totalSlides = Math.ceil(allMovies.length / moviesPerSlide);
  const getCurrentSlideMovies = () => {
    const start = currentSlide * moviesPerSlide;
    return allMovies.slice(start, start + moviesPerSlide);
  };

  const topMovieVotes = topMovie?.voteCount ?? 0;
  const secondMovieVotes = secondMovie?.voteCount ?? 0;
  const totalVotes = topMovieVotes + secondMovieVotes;
  const topMoviePercentage = totalVotes > 0 ? Math.round((topMovieVotes / totalVotes) * 100) : 0;
  const secondMoviePercentage = totalVotes > 0 ? 100 - topMoviePercentage : 0;

  const handleVote = (choice: "first" | "second") => {
    setSelectedVote(choice);
    setHasVoted(true);
  };

  const handleMovieClick = (movie: StoreMovie) => {
    navigate(`/movies/${movie.movieIdx}`);
  };

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  // 초기 캐시 표시 + 백그라운드 fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await fetchAllHybrid();
      setTopMovie(all[0] ?? null);
      setSecondMovie(all[1] ?? null);
      setLoading(false);
    })();
  }, [fetchAllHybrid]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* 페이지 제목 */}
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
        {loading || !topMovie || !secondMovie ? (
          <LoadingSpinner />
        ) : (
          <div className="mb-12">
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/30">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">최고 평점 대결</h2>
                <p className="text-gray-600 text-lg">이번 주 최고 평점 영화들의 투표 현황</p>
                {hasVoted && <p className="mt-4 text-gray-500">총 {totalVotes.toLocaleString()}명이 참여</p>}
              </div>

              <div className="flex items-center justify-center gap-12">
                {/* 1위 영화 */}
                <div className="text-center flex flex-col items-center">
                  <div className="group cursor-pointer" onClick={() => handleMovieClick(topMovie)}>
                    <div className="relative mb-4">
                      <div className="w-48 h-64 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                        <ImageWithFallback
                          src={getPosterUrl(topMovie.posterPath) ?? "/fallback-poster.png"}
                          alt={topMovie.title ?? "제목 없음"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="absolute -top-3 -left-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {hasVoted && selectedVote === "first" && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-yellow-500 text-white font-bold text-lg px-3 py-1">선택!</Badge>
                        </div>
                      )}
                      {hasVoted && selectedVote === "second" && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-yellow-500 text-white font-bold text-lg px-3 py-1">승리!</Badge>
                        </div>
                      )}
                    </div>

                    <div className="w-48 h-28 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-500 transition-colors line-clamp-2 break-words">
                          {topMovie.title ?? "제목 없음"}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm truncate">{topMovie.director ?? "알 수 없음"}</p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-xl text-gray-800">{(topMovie.voteAverage ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-48 mt-4">
                    {!hasVoted ? (
                      <Button
                        onClick={() => handleVote("first")}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
                      >
                        이 영화에 투표
                      </Button>
                    ) : (
                      <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="font-bold text-xl mb-1" style={{ color: "#000000" }}>
                          {topMoviePercentage}%
                        </div>
                        <div className="text-sm" style={{ color: "#000000" }}>
                          {topMovie.voteCount?.toLocaleString() ?? 0}표
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* VS 텍스트 */}
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
                        <ImageWithFallback
                          src={getPosterUrl(secondMovie.posterPath) ?? "/fallback-poster.png"}
                          alt={secondMovie.title ?? "제목 없음"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="absolute -top-3 -left-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                          <Medal className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {hasVoted && selectedVote === "second" && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gray-400 text-white font-bold text-lg px-3 py-1">선택!</Badge>
                        </div>
                      )}
                      {hasVoted && selectedVote === "first" && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gray-400 text-white font-bold text-lg px-3 py-1">2위</Badge>
                        </div>
                      )}
                    </div>

                    <div className="w-48 h-28 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-500 transition-colors line-clamp-2 break-words">
                          {secondMovie.title ?? "제목 없음"}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm truncate">{secondMovie.director ?? "알 수 없음"}</p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-xl text-gray-800">{(secondMovie.voteAverage ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-48 mt-4">
                    {!hasVoted ? (
                      <Button
                        onClick={() => handleVote("second")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
                      >
                        이 영화에 투표
                      </Button>
                    ) : (
                      <div className="bg-gray-300/50 rounded-lg p-4 border border-gray-400">
                        <div className="font-bold text-xl mb-1" style={{ color: "#000000" }}>
                          {secondMoviePercentage}%
                        </div>
                        <div className="text-sm" style={{ color: "#000000" }}>
                          {secondMovie.voteCount?.toLocaleString() ?? 0}표
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 투표 안내 */}
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
            </div>
          </div>
        )}

        {/* 박스오피스 TOP 10 */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mb-12">
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
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

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getCurrentSlideMovies().map((movie) => (
                  <div
                    key={movie.movieIdx}
                    className="group cursor-pointer bg-white/80 rounded-lg p-4 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-sm border border-gray-300"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={getPosterUrl(movie.posterPath) ?? "/fallback-poster.png"}
                          alt={movie.title ?? "제목 없음"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div
                        className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg ${
                          movie.rank === 1 ? "bg-yellow-500" : movie.rank === 2 ? "bg-gray-400" : movie.rank === 3 ? "bg-orange-500" : "bg-gray-500"
                        }`}
                      >
                        {movie.rank}
                      </div>

                      {(movie.rank ?? 0) <= 3 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                          {movie.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                          {movie.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                          {movie.rank === 3 && <Trophy className="h-5 w-5 text-orange-500" />}
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                      {movie.title ?? "제목 없음"}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{movie.director ?? "알 수 없음"}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-800">{(movie.voteAverage ?? 0).toFixed(1)}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{movie.releaseDate?.split("-")[0] ?? "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
