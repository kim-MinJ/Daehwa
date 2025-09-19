import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchFilters } from "../components/searchPage/SearchFilters";
import { SortAndViewToggle } from "../components/searchPage/SortAndViewToggle";
import { useMovieStore } from "../store/movieStore";
import { useScrollStore } from "../store/scrollStore";
import { genreMap, YEAR_GROUPS } from "@/constants/genres";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { Movie } from "@/types/movie";

const BATCH_SIZE = 50;
const PAGE_SIZE = 8;
const WHEEL_SPEED = 2;

const STORAGE_KEYS = {
  displayCount: "search_displayCount",
  sortBy: "search_sortBy",
  viewMode: "search_viewMode",
};

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { getMoviesFromDB, fetchAllBackground, allMovies } = useMovieStore();
  const scrollStore = useScrollStore();

  // -------------------------
  // 상태
  // -------------------------
  const [query, setQuery] = useState(queryParams.get("query") || "");
  const [searchTrigger, setSearchTrigger] = useState(queryParams.get("query") || "");
  const [selectedYears, setSelectedYears] = useState<string[]>(queryParams.get("years")?.split(",") || []);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(queryParams.get("genres")?.split(",") || []);

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

  const hasFilter = searchTrigger.trim() || selectedYears.length > 0 || selectedGenres.length > 0;

  // -------------------------
  // URL 업데이트 함수 (단일 source of truth)
  // -------------------------
  const updateUrl = (newQuery = query, newYears = selectedYears, newGenres = selectedGenres) => {
    const params: Record<string,string> = {};
    if (newQuery) params.query = newQuery;
    if (newYears.length) params.years = newYears.join(",");
    if (newGenres.length) params.genres = newGenres.join(",");
    navigate(`/search?${new URLSearchParams(params).toString()}`, { replace: true });
  };

  // -------------------------
  // URL 동기화 effect
  // -------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("query") || "";
    const urlYears = params.get("years")?.split(",") || [];
    const urlGenres = params.get("genres")?.split(",") || [];

    if (
      urlQuery !== searchTrigger ||
      JSON.stringify(urlYears) !== JSON.stringify(selectedYears) ||
      JSON.stringify(urlGenres) !== JSON.stringify(selectedGenres)
    ) {
      setQuery(urlQuery);
      setSearchTrigger(urlQuery);
      setSelectedYears(urlYears);
      setSelectedGenres(urlGenres);
      setDisplayCount(PAGE_SIZE);
    }
  }, [location.search]);

  // -------------------------
  // 로컬스토리지 동기화
  // -------------------------
  useEffect(() => localStorage.setItem(STORAGE_KEYS.displayCount, String(displayCount)), [displayCount]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.sortBy, sortBy), [sortBy]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.viewMode, viewMode), [viewMode]);

  // -------------------------
  // 검색 실행
  // -------------------------
  useEffect(() => {
    if (!hasFilter) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const loadInitial = async () => {
      try {
        const batch = await getMoviesFromDB({
          query: searchTrigger,
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
          query: searchTrigger,
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
  }, [searchTrigger, selectedYears, selectedGenres, getMoviesFromDB, fetchAllBackground, hasFilter]);

  // -------------------------
  // 더보기
  // -------------------------
  const handleLoadMore = async () => {
    if (loadedCount < totalCount && displayCount >= movies.length) {
      const nextBatch = await getMoviesFromDB({
        query: searchTrigger,
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
  // 정렬
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
  // 스크롤 위치 복원
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
  // 필터 토글 (URL 기반)
  // -------------------------
  const toggleYearGroup = (group: string) => {
    const groupYears = YEAR_GROUPS[group];
    const allSelected = groupYears.every((y) => selectedYears.includes(y));
    const newYears = allSelected
      ? selectedYears.filter((y) => !groupYears.includes(y))
      : [...new Set([...selectedYears, ...groupYears])];

    updateUrl(query, newYears, selectedGenres);
  };

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    updateUrl(query, selectedYears, newGenres);
  };

  const clearAllFilters = () => {
    navigate("/search", { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, selectedYears, selectedGenres);
  };

  const handleSortChange = (val: string) => setSortBy(val as "latest"|"rating"|"title");

  // -------------------------
  // 추천 섹션
  // -------------------------
  const recommendedGenres = useMemo(() => {
    const genres = Object.keys(genreMap);
    if (genres.length <= 2) return genres;
    const shuffled = genres.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  const recommendedSections = useMemo(() => {
    if (hasFilter || !allMovies) return {};
    const map: Record<string, Movie[]> = {};
    recommendedGenres.forEach((genre) => {
      const moviesOfGenre = allMovies.filter((m) => m.genres?.includes(genre));
      if (moviesOfGenre.length > 0) map[genreMap[genre]] = moviesOfGenre.slice(0, 10);
    });
    return map;
  }, [recommendedGenres, allMovies, hasFilter]);

  const carouselRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    Object.keys(carouselRefs.current).forEach((section) => {
      const el = carouselRefs.current[section];
      if (!el) return;
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        el.scrollLeft += e.deltaY * WHEEL_SPEED;
      };
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    });
  }, [recommendedSections]);

  // -------------------------
  // 렌더링
  // -------------------------
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-8 lg:px-16 py-8 space-y-12">
      <div className="flex gap-8">
        <div className="w-1/4">
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
        </div>

        <div className="w-3/4 space-y-12">
          {!hasFilter &&
            Object.keys(recommendedSections).map((section) => (
              <div key={section} className="space-y-4">
                <h2 className="text-xl font-semibold">{section}</h2>
                <div
                  className="flex overflow-x-auto gap-4 py-2 scroll-smooth carousel"
                  ref={(el) => { carouselRefs.current[section] = el!; }}
                >
                  {recommendedSections[section].map((movie, idx) => (
                    <div
                      key={movie.movieIdx ?? `${section}-${idx}`}
                      className="flex-none w-40 cursor-pointer"
                      onClick={() => navigate(`/movie/${movie.movieIdx}`)}
                    >
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
            ))
          }

          {hasFilter && sortedMovies.length > 0 && (
            <div>
              <SortAndViewToggle
                sortBy={sortBy}
                handleSortChange={handleSortChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-4 mt-4`}>
                {visibleMovies.map((movie, idx) => (
                  <div
                    key={movie.movieIdx ?? `grid-${idx}`}
                    className="cursor-pointer"
                    onClick={() => navigate(`/movie/${movie.movieIdx}`)}
                  >
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
      </div>

      <style>{`
        .carousel::-webkit-scrollbar { display: none; }
        .carousel { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SearchPage;
