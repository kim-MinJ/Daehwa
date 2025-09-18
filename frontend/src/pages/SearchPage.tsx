import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { SearchFilters } from "../components/searchPage/SearchFilters";
import { MovieList } from "../components/searchPage/MovieList";
import { SortAndViewToggle } from "../components/searchPage/SortAndViewToggle";
import { useMovieStore } from "../store/movieStore";
import { useScrollStore } from "../store/scrollStore";
import { genreMap, YEAR_GROUPS } from "@/constants/genres";
import { Movie } from "@/types/movie";

const BATCH_SIZE = 50;
const PAGE_SIZE = 8;

const STORAGE_KEYS = {
  displayCount: "search_displayCount",
  sortBy: "search_sortBy",
  viewMode: "search_viewMode",
};

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { getMoviesFromDB, fetchAllBackground } = useMovieStore();
  const scrollStore = useScrollStore();

  // -------------------------
  // URL 기반 초기 상태
  // -------------------------
  const queryFromUrl = queryParams.get("query") || "";
  const yearsFromUrl = queryParams.get("years")?.split(",") || [];
  const genresFromUrl = queryParams.get("genres")?.split(",") || [];

  const [query, setQuery] = useState(queryFromUrl);
  const [selectedYears, setSelectedYears] = useState<string[]>(yearsFromUrl);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genresFromUrl);

  const [sortBy, setSortBy] = useState<"latest" | "rating" | "title">(
    (localStorage.getItem(STORAGE_KEYS.sortBy) as "latest" | "rating" | "title") || "latest"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem(STORAGE_KEYS.viewMode) as "grid" | "list") || "grid"
  );
  const [displayCount, setDisplayCount] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.displayCount);
    return saved ? Number(saved) : PAGE_SIZE;
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  // -------------------------
  // localStorage 동기화
  // -------------------------
  useEffect(() => localStorage.setItem(STORAGE_KEYS.displayCount, String(displayCount)), [displayCount]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.sortBy, sortBy), [sortBy]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.viewMode, viewMode), [viewMode]);

  // -------------------------
  // URL query 동기화
  // -------------------------
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedQuery) params.query = debouncedQuery;
    if (selectedYears.length > 0) params.years = selectedYears.join(",");
    if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");

    const searchString = new URLSearchParams(params).toString();
    navigate(`/search?${searchString}`, { replace: true });
  }, [debouncedQuery, selectedYears, selectedGenres, navigate]);

  // -------------------------
  // 초기 데이터 로드
  // -------------------------
  useEffect(() => {
    const hasFilter = query.trim() || selectedYears.length > 0 || selectedGenres.length > 0;

    if (!hasFilter) {
      setMovies([]);
      setTotalCount(0);
      setLoadedCount(0);
      setDisplayCount(PAGE_SIZE);
      return;
    }

    const loadInitial = async () => {
      const batch = await getMoviesFromDB({
        query: debouncedQuery,
        years: selectedYears,
        genres: selectedGenres,
        offset: 0,
        limit: BATCH_SIZE,
      });
      if (Array.isArray(batch)) {
        setMovies(batch);
        setLoadedCount(batch.length);
      }

      const count = await getMoviesFromDB({
        query: debouncedQuery,
        years: selectedYears,
        genres: selectedGenres,
        countOnly: true,
      });
      if (typeof count === "number") setTotalCount(count);
    };

    loadInitial();
    fetchAllBackground();
  }, [debouncedQuery, selectedYears, selectedGenres, getMoviesFromDB, fetchAllBackground]);

  // -------------------------
  // 더보기
  // -------------------------
  const handleLoadMore = async () => {
    if (loadedCount < totalCount && displayCount >= movies.length) {
      const nextBatch = await getMoviesFromDB({
        query: debouncedQuery,
        years: selectedYears,
        genres: selectedGenres,
        offset: loadedCount,
        limit: BATCH_SIZE,
      });
      if (Array.isArray(nextBatch)) {
        setMovies((prev) => [...prev, ...nextBatch]);
        setLoadedCount((prev) => prev + nextBatch.length);
      }
    }
    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

  // -------------------------
  // 정렬 및 화면 표시
  // -------------------------
  const sortedMovies = useMemo(() => {
    const result = [...movies];
    switch (sortBy) {
      case "latest": return result.sort((a,b)=> (b.releaseDate||"").localeCompare(a.releaseDate||""));
      case "rating": return result.sort((a,b)=> (b.voteAverage||0)-(a.voteAverage||0));
      case "title": return result.sort((a,b)=> a.title.localeCompare(b.title));
    }
  }, [movies, sortBy]);

  const visibleMovies = sortedMovies.slice(0, displayCount);

  // -------------------------
  // 스크롤 복원
  // -------------------------
  useEffect(() => {
    const pos = scrollStore.getScroll(location.pathname);
    window.scrollTo(0, pos);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => scrollStore.setScroll(location.pathname, window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // -------------------------
  // 필터 토글
  // -------------------------
  const toggleYearGroup = (group: string) => {
    const groupYears = YEAR_GROUPS[group];
    const allSelected = groupYears.every((y) => selectedYears.includes(y));
    if (allSelected) setSelectedYears((prev) => prev.filter((y) => !groupYears.includes(y)));
    else setSelectedYears((prev) => [...new Set([...prev, ...groupYears])]);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g!==genre) : [...prev, genre]);
  };

  const clearAllFilters = () => {
    setQuery("");
    setSelectedYears([]);
    setSelectedGenres([]);
    navigate("/search", { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => e.preventDefault();
  const handleSortChange = (val: string) => setSortBy(val as "latest"|"rating"|"title");

  return (
    <div className="min-h-screen bg-white flex max-w-7xl mx-auto px-8 lg:px-16 py-8 gap-8">
      <SearchFilters
        query={query}
        setQuery={setQuery}
        yearGroups={YEAR_GROUPS}
        selectedYears={selectedYears}
        toggleYearGroup={toggleYearGroup}
        genres={Object.keys(genreMap)}
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
        clearAllFilters={clearAllFilters}
        handleSearchSubmit={handleSearchSubmit}
        genreMap={genreMap}
      />

      <div className="flex-1 space-y-6">
        {!query.trim() && selectedYears.length===0 && selectedGenres.length===0 && (
          <p className="text-center text-gray-600 py-12">검색어나 필터를 선택해주세요.</p>
        )}

        {(query.trim() || selectedYears.length>0 || selectedGenres.length>0) && sortedMovies.length===0 && (
          <p className="text-center text-gray-600 py-12">조건에 맞는 영화가 없습니다.</p>
        )}

        {sortedMovies.length>0 && (
          <>
            <SortAndViewToggle
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <MovieList
              movies={visibleMovies}
              genreMap={genreMap}
              displayCount={visibleMovies.length}
              setDisplayCount={setDisplayCount}
              viewMode={viewMode}
            />
            {displayCount<sortedMovies.length && (
              <div className="flex justify-center mt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleLoadMore}>더보기</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
