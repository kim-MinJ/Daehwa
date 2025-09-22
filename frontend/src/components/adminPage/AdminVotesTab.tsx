import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "../imageFallback/ImageWithFallback";
import { Movie } from "../../pages/RankingPage";

interface AdminVotesTabProps {
  token: string;
  onApplyVsMovies?: (movie1: Movie | null, movie2: Movie | null) => void;
  onVotesChange?: (votes: any[]) => void;
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
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movieVotes, setMovieVotes] = useState<any[]>([]);
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [voteSearchQuery, setVoteSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vsMovie1, setVsMovie1] = useState<Movie | null>(null);
  const [vsMovie2, setVsMovie2] = useState<Movie | null>(null);
  const [selecting, setSelecting] = useState<"movie1" | "movie2" | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [roundSelectOpen, setRoundSelectOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(1);
  const [maxRound, setMaxRound] = useState(1);
  const PAGE_SIZE = 12;

  // -------------------- 전체 영화 데이터 불러오기 --------------------
  useEffect(() => {
    (async () => {
      try {
        setLoadingMovies(true);
        const res = await fetch("/api/searchMovie?page=0&limit=1000");
        if (!res.ok) throw new Error("영화 데이터 조회 실패");
        const raw = await res.json();
        const dataArray: any[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];

        const mapped: Movie[] = dataArray
          .filter((m) => m.posterPath && m.title)
          .map((m) => ({
            id: m.movieIdx,
            movieIdx: String(m.movieIdx),
            tmdbMovieId: m.tmdbMovieId ?? "",
            title: m.title,
            poster: m.posterPath ? `https://image.tmdb.org/t/p/w500${m.posterPath}` : "",
            year: m.releaseDate?.split("-")[0] ?? "",
            genres: m.genre ? m.genre.split(",") : [],
            genre: m.genre ?? "",
            rating: m.voteAverage ?? 0,
            runtime: m.runtime ?? 0,
            description: m.overview ?? "",
            director: m.director ?? "",
            rank: 0,
            voteCount: 0,
          }));

        setAllMovies(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMovies(false);
      }
    })();
  }, []);

  // -------------------- MovieVote 리스트 불러오기 --------------------
  const fetchMovieVotes = async () => {
    try {
      setLoadingVotes(true);
      const res = await fetch("/api/vs/movievote");
      if (!res.ok) throw new Error("MovieVote 조회 실패");
      const raw = await res.json();
      const dataArray: any[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];

      setMovieVotes(dataArray);

      // 최대 회차 계산
      const max = dataArray.reduce((acc, cur) => (cur.vsRound > acc ? cur.vsRound : acc), 1);
      setMaxRound(max);
      if (selectedRound > max) setSelectedRound(max);
    } catch (err) {
      console.error(err);
      setMovieVotes([]);
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    fetchMovieVotes();
  }, []);

  const visibleMovieVotes = useMemo(() => movieVotes.filter((mv) => mv.active !== 3), [movieVotes]);

  const filteredMovieVotes = useMemo(() => {
    if (!voteSearchQuery) return visibleMovieVotes;
    const q = voteSearchQuery.toLowerCase().replace(/\s/g, "");
    return visibleMovieVotes.filter((mv: any) => {
      const vsString = `${mv.vsIdx}-${mv.vsRound}-${mv.pair}`.replace(/\s/g, "");
      const movie1Title = mv.movieVs1?.title?.toLowerCase() ?? "";
      const movie2Title = mv.movieVs2?.title?.toLowerCase() ?? "";
      return movie1Title.includes(q) || movie2Title.includes(q) || vsString.includes(q);
    });
  }, [visibleMovieVotes, voteSearchQuery]);

  // -------------------- 검색 & 필터링 --------------------
  const filteredMovies = useMemo(() => {
    return allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(movieSearchQuery.toLowerCase())
    );
  }, [allMovies, movieSearchQuery]);

  const pagedMovies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMovies.slice(start, start + PAGE_SIZE);
  }, [filteredMovies, currentPage]);

  // -------------------- VS 선택 --------------------
  const handleCardClick = (movie: Movie) => {
    if (!vsMovie1) return setVsMovie1(movie);
    if (!vsMovie2) return setVsMovie2(movie);
    if (selecting === "movie1") return setVsMovie1(movie);
    if (selecting === "movie2") return setVsMovie2(movie);
  };

  const handleApply = async () => {
    if (!vsMovie1 || !vsMovie2) return;
    try {
      const res = await fetch("/api/vs/ranking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieIds: [Number(vsMovie1.movieIdx), Number(vsMovie2.movieIdx)],
          round: selectedRound,
        }),
      });

      if (!res.ok) throw new Error("VS 등록 실패");

      alert("✅ VS 등록 완료");
      onApplyVsMovies?.(vsMovie1, vsMovie2);
      fetchMovieVotes();
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
          {loadingMovies ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* 검색창 + 회차 선택 + 회차 추가 */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="검색"
                    value={movieSearchQuery}
                    onChange={(e) => {
                      setMovieSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="relative">
                  <Button
                    size="sm"
                    onClick={() => setRoundSelectOpen((prev) => !prev)}
                    className="flex items-center gap-1"
                  >
                    {selectedRound}회차
                  </Button>
                  {roundSelectOpen && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow z-10">
                      {Array.from({ length: maxRound }, (_, i) => i + 1).map((r) => (
                        <div
                          key={r}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedRound(r);
                            setRoundSelectOpen(false);
                          }}
                        >
                          {r}회차
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMaxRound((prev) => prev + 1);
                    setSelectedRound(maxRound + 1);
                  }}
                >
                  회차 추가
                </Button>
              </div>

              {/* VS 선택 카드 */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div
                  className={`text-center cursor-pointer ${
                    selecting === "movie1" ? "ring-4 ring-yellow-400 rounded-xl" : ""
                  }`}
                  onClick={() => setSelecting("movie1")}
                >
                  {vsMovie1 ? (
                    <img
                      src={vsMovie1.poster}
                      className="w-48 h-64 object-cover rounded-xl border-4 border-yellow-400"
                    />
                  ) : (
                    <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-xl">
                      무비1 선택
                    </div>
                  )}
                  <p className="mt-2 font-semibold">무비1</p>
                </div>

                {/* VS 텍스트 */}
                <div className="text-2xl font-bold flex-shrink-0 self-center">VS</div>

                <div
                  className={`text-center cursor-pointer ${
                    selecting === "movie2" ? "ring-4 ring-yellow-400 rounded-xl" : ""
                  }`}
                  onClick={() => setSelecting("movie2")}
                >
                  {vsMovie2 ? (
                    <img
                      src={vsMovie2.poster}
                      className="w-48 h-64 object-cover rounded-xl border-4 border-yellow-400"
                    />
                  ) : (
                    <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-xl">
                      무비2 선택
                    </div>
                  )}
                  <p className="mt-2 font-semibold">무비2</p>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <Button onClick={handleApply} disabled={!vsMovie1 || !vsMovie2} className="px-8">
                  VS 적용
                </Button>
              </div>

              {/* 전체 영화 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pagedMovies.map((movie) => (
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

              {/* 페이지 네비게이션 */}
              <div className="flex justify-center gap-2 mt-4">
                {currentPage > 1 && (
                  <Button size="sm" onClick={() => setCurrentPage((prev) => prev - 1)}>
                    이전
                  </Button>
                )}
                {currentPage * PAGE_SIZE < filteredMovies.length && (
                  <Button size="sm" onClick={() => setCurrentPage((prev) => prev + 1)}>
                    다음
                  </Button>
                )}
              </div>
            </>
          )}

          {/* MovieVote 리스트 */}
          <CardContent className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">영화 투표 리스트</h3>
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="영화 제목 또는 vsIdx-회차-순번으로 검색"
                value={voteSearchQuery}
                onChange={(e) => setVoteSearchQuery(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            {loadingVotes ? (
              <LoadingSpinner />
            ) : visibleMovieVotes.length === 0 ? (
              <p className="text-gray-500 text-center">MovieVote가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2">번호-회차-순번</th>
                      <th className="p-2">Movie 1</th>
                      <th className="p-2">Movie 2</th>
                      <th className="p-2">Start Date</th>
                      <th className="p-2">End Date</th>
                      <th className="p-2">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovieVotes.map((mv: any) => {
                      const expired =
                        mv.endDate && new Date(mv.endDate).getTime() + 72 * 60 * 60 * 1000 < Date.now();
                      const effectiveActive = expired ? 0 : mv.active ?? 0;

                      return (
                        <tr key={mv.vsIdx} className="border-b">
                          <td className="p-2">{mv.vsIdx} - {mv.vsRound} - {mv.pair}</td>
                          <td className="p-2 text-center">
                            <div className="flex flex-col items-center">
                              <ImageWithFallback
                                src={`https://image.tmdb.org/t/p/w92${mv.movieVs1?.posterPath ?? ""}`}
                                alt={mv.movieVs1?.title ?? "?"}
                                className="w-24 h-32 object-cover rounded"
                              />
                              <p className="mt-1 font-semibold w-24 truncate">{mv.movieVs1?.title ?? "?"}</p>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex flex-col items-center">
                              <ImageWithFallback
                                src={`https://image.tmdb.org/t/p/w92${mv.movieVs2?.posterPath ?? ""}`}
                                alt={mv.movieVs2?.title ?? "?"}
                                className="w-24 h-32 object-cover rounded"
                              />
                              <p className="mt-1 font-semibold w-24 truncate">{mv.movieVs2?.title ?? "?"}</p>
                            </div>
                          </td>
                          <td className="p-2">{mv.startDate ? new Date(mv.startDate).toLocaleDateString() : "-"}</td>
                          <td className="p-2">{mv.endDate ? new Date(mv.endDate).toLocaleDateString() : "-"}</td>
                          <td className="p-2">
                            <div className="flex flex-col items-center gap-2">
                              <Button
                                size="sm"
                                className={`w-24 px-3 py-1 rounded ${
                                  effectiveActive === 1
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-400 hover:bg-gray-500 text-white"
                                }`}
                                onClick={async () => {
                                  try {
                                    const newActive = effectiveActive === 1 ? 0 : 1;
                                    if (newActive === 1) {
                                      const confirmActivate = window.confirm("이 MovieVote를 활성화하시겠습니까?");
                                      if (!confirmActivate) return;
                                    }
                                    await fetch(`/api/vs/movievote/${mv.vsIdx}/active`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ active: newActive }),
                                    });
                                    fetchMovieVotes();
                                  } catch (err) {
                                    console.error("토글 실패", err);
                                  }
                                }}
                              >
                                {effectiveActive === 1 ? "활성화" : "비활성화"}
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-24 px-3 py-1 rounded"
                                onClick={async () => {
                                  const confirmDelete = window.confirm("정말 이 MovieVote를 삭제하시겠습니까?");
                                  if (!confirmDelete) return;

                                  try {
                                    await fetch(`/api/vs/movievote/${mv.vsIdx}/active`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ active: 3 }),
                                    });
                                    fetchMovieVotes();
                                  } catch (err) {
                                    console.error("삭제 실패", err);
                                  }
                                }}
                              >
                                삭제
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </CardContent>
      )}
    </Card>
  );
}