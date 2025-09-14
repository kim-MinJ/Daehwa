// src/components/admin/AdminVotesTab.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Movie } from "../../pages/RankingPage";

interface AdminVotesTabProps {
  token: string;
  onApplyVsMovies?: (movie1: Movie | null, movie2: Movie | null) => void;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600">로딩중...</span>
    </div>
  );
}

export default function AdminVotesTab({ token, onApplyVsMovies }: AdminVotesTabProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieVotes, setMovieVotes] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vsMovie1, setVsMovie1] = useState<Movie | null>(null);
  const [vsMovie2, setVsMovie2] = useState<Movie | null>(null);
  const [selecting, setSelecting] = useState<"movie1" | "movie2" | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const PAGE_SIZE = 10;

  // VS 영화 불러오기
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/searchMovie?page=${currentPage}&limit=${PAGE_SIZE}&query=${searchQuery}`);
        const data: any[] = await res.json();
        const mapped: Movie[] = data
          .filter(m => m.posterPath)
          .map(m => ({
            movieIdx: String(m.movieIdx),
            tmdbMovieId: m.tmdbMovieId ?? "",
            title: m.title,
            poster: m.posterPath ? `https://image.tmdb.org/t/p/w500${m.posterPath}` : "",
            year: m.releaseDate?.split("-")[0] ?? "",
            genre: m.genre ?? "",
            rating: m.voteAverage ?? 0,
            runtime: m.runtime ?? 0,
            description: m.overview ?? "",
            director: m.director ?? "",
            rank: 0,
            voteCount: 0,
          }));
        setMovies(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage, searchQuery]);

  // MovieVote 리스트
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/vs/movievote");
        const data: any[] = await res.json();
        const mapped: Movie[] = data
          .filter(m => m.posterPath)
          .map(m => ({
            movieIdx: String(m.movieIdx),
            tmdbMovieId: m.tmdbMovieId ?? "",
            title: m.title,
            poster: m.posterPath ? `https://image.tmdb.org/t/p/w500${m.posterPath}` : "",
            year: m.releaseDate?.split("-")[0] ?? "",
            genre: m.genre ?? "",
            rating: m.voteAverage ?? 0,
            runtime: m.runtime ?? 0,
            description: m.overview ?? "",
            director: m.director ?? "",
            rank: 0,
            voteCount: m.voteCount ?? 0,
          }));
        setMovieVotes(mapped);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleCardClick = (movie: Movie) => {
    if (!vsMovie1) return setVsMovie1(movie);
    if (!vsMovie2) return setVsMovie2(movie);
    if (selecting === "movie1") return setVsMovie1(movie);
    if (selecting === "movie2") return setVsMovie2(movie);
  };

  const handleApply = async () => {
    if (!vsMovie1 || !vsMovie2) return;
    try {
      const res = await fetch("http://localhost:8080/api/vs/ranking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieIds: [Number(vsMovie1.movieIdx), Number(vsMovie2.movieIdx)],
        }),
      });
      if (!res.ok) throw new Error("VS 등록 실패");
      alert("✅ VS 등록 완료");
      if (onApplyVsMovies) onApplyVsMovies(vsMovie1, vsMovie2);
    } catch (err) {
      console.error(err);
      alert("❌ VS 등록 중 오류 발생");
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>VS 영화 선택</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1"
        >
          {collapsed ? "펼치기" : "접기"}
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-6">
          {/* 검색창 */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // 검색 시 1페이지로 초기화
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* VS 선택 카드 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className={`text-center cursor-pointer ${selecting === "movie1" ? "ring-4 ring-yellow-400 rounded-xl" : ""}`}
              onClick={() => setSelecting("movie1")}
            >
              {vsMovie1 ? (
                <img src={vsMovie1.poster} className="w-48 h-64 object-cover rounded-xl border-4 border-yellow-400" />
              ) : (
                <div className="w-48 h-64 bg-gray-200 rounded-xl flex items-center justify-center">무비1 선택</div>
              )}
              <p className="mt-2 font-semibold">무비1</p>
            </div>

            <div className="text-2xl font-bold flex-shrink-0 self-center">VS</div>

            <div
              className={`text-center cursor-pointer ${selecting === "movie2" ? "ring-4 ring-yellow-400 rounded-xl" : ""}`}
              onClick={() => setSelecting("movie2")}
            >
              {vsMovie2 ? (
                <img src={vsMovie2.poster} className="w-48 h-64 object-cover rounded-xl border-4 border-yellow-400" />
              ) : (
                <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-xl">무비2 선택</div>
              )}
              <p className="mt-2 font-semibold">무비2</p>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <Button onClick={handleApply} disabled={!vsMovie1 || !vsMovie2} className="px-8">
              VS 적용
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
              {movies.map(movie => (
                <div
                  key={movie.movieIdx}
                  className={`cursor-pointer relative rounded-lg overflow-hidden border ${
                    vsMovie1?.movieIdx === movie.movieIdx || vsMovie2?.movieIdx === movie.movieIdx
                      ? "border-yellow-500 shadow-lg"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleCardClick(movie)}
                >
                  <ImageWithFallback src={movie.poster} alt={movie.title} className="w-full h-64 object-cover" />
                  <h3 className="mt-2 font-semibold text-gray-800 line-clamp-1">{movie.title}</h3>
                </div>
              ))}
            </div>
          )}

          {/* 페이지 네비게이션 */}
          <div className="flex justify-center gap-2 mt-4">
            {currentPage > 1 && (
              <Button size="sm" onClick={() => setCurrentPage(prev => prev - 1)}>이전</Button>
            )}
            {movies.length === PAGE_SIZE && (
              <Button size="sm" onClick={() => setCurrentPage(prev => prev + 1)}>다음</Button>
            )}
          </div>
        </CardContent>
      )}

      {/* MovieVote 리스트 */}
      <CardContent className="space-y-4 mt-4">
        <h3 className="font-semibold text-lg">MovieVote 리스트</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movieVotes.map(movie => (
            <div key={movie.movieIdx} className="border rounded-lg overflow-hidden p-1">
              <ImageWithFallback src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" />
              <p className="mt-1 text-sm font-medium text-gray-800 line-clamp-1">{movie.title}</p>
              <p className="text-xs text-gray-500">Votes: {movie.voteCount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
