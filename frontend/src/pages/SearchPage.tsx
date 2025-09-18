import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { SearchFilters } from "../components/searchPage/SearchFilters";
import { SortAndViewToggle } from "../components/searchPage/SortAndViewToggle";
import { useMovieStore } from "../store/movieStore";
import { useScrollStore } from "../store/scrollStore";
import { genreMap, YEAR_GROUPS } from "@/constants/genres";
import { getPosterUrl } from "@/utils/getPosterUrl";
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

    const controller = new AbortController();
    const signal = controller.signal;

    const loadInitial = async () => {
      try {
        const batch = await getMoviesFromDB({
          query: debouncedQuery,
          years: selectedYears,
          genres: selectedGenres,
          offset: 0,
          limit: BATCH_SIZE,
          signal,
        });
        if (!signal.aborted && Array.isArray(batch)) {
          setMovies(batch);
          setLoadedCount(batch.length);
        }

        const count = await getMoviesFromDB({
          query: debouncedQuery,
          years: selectedYears,
          genres: selectedGenres,
          countOnly: true,
          signal,
        });
        if (!signal.aborted && typeof count === "number") setTotalCount(count);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      }
    };

    loadInitial();
    fetchAllBackground();

    return () => controller.abort();
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

  // -------------------------
  // Featured + Section Carousel UI
  // -------------------------
  const featured = visibleMovies.slice(0, 5); // 상단 Featured
  const sections = useMemo(() => {
    // 장르별 섹션 생성
    const map: Record<string, Movie[]> = {};
    visibleMovies.forEach((movie) => {
      movie.genres?.forEach((g) => {
        const genreName = genreMap[g];
        if (!map[genreName]) map[genreName] = [];
        map[genreName].push(movie);
      });
    });
    return map;
  }, [visibleMovies]);

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-8 lg:px-16 py-8 space-y-12">
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

      {/* Featured Section */}
      {featured.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Featured</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {featured.map((movie, idx) => (
              <div key={movie.movieIdx ?? `featured-${idx}`} className="flex-none w-48">
                <img
                  src={getPosterUrl(movie.posterPath)}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h4 className="mt-2 text-sm font-medium">{movie.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Carousels */}
      {Object.keys(sections).map((section) => (
        <div key={section} className="space-y-4">
          <h2 className="text-xl font-semibold">{section}</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {sections[section].map((movie, idx) => (
              <div key={movie.movieIdx ?? `${section}-${idx}`} className="flex-none w-40">
                <img
                  src={getPosterUrl(movie.posterPath)}
                  alt={movie.title}
                  className="w-full h-56 object-cover rounded"
                />
                <h4 className="mt-1 text-sm font-medium">{movie.title}</h4>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sort & Load More */}
      {sortedMovies.length > 0 && (
        <div className="space-y-6">
          <SortAndViewToggle
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleMovies.map((movie, idx) => (
              <div key={movie.movieIdx ?? `grid-${idx}`}>
                <img
                  src={getPosterUrl(movie.posterPath)}
                  alt={movie.title}
                  className="w-full h-56 object-cover rounded"
                />
                <h4 className="mt-2 text-sm font-medium">{movie.title}</h4>
              </div>
            ))}
          </div>
          {displayCount < sortedMovies.length && (
            <div className="flex justify-center mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleLoadMore}
              >
                더보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
