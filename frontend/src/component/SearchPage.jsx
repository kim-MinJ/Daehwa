import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./fallBack/ImageWithFallback";
import "../assets/SearchPage.css";

const LOCAL_STORAGE_KEYS = {
  SEARCH_TERM: "searchTerm",
  YEARS: "selectedYears",
  GENRES: "selectedGenres",
  KEYWORDS: "selectedKeywords",
};

export function SearchPage() {
  const [movies, setMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_TERM) || ""
  );
  const [selectedYears, setSelectedYears] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.YEARS);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GENRES);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedKeywords, setSelectedKeywords] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.KEYWORDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [keywords, setKeywords] = useState([]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 영화 데이터 불러오기
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("http://localhost:8080/api/movies");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        console.log("DB에서 가져온 영화 데이터:", data);
        setMovies(data);

        // releaseDate에서 연도 추출
        const allYears = [
          ...new Set(
            data
              .map((movie) =>
                movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) : null
              )
              .filter((year) => year !== null)
          ),
        ];
        setYears(allYears.sort((a, b) => b - a));

        setGenres([...new Set(data.flatMap((movie) => movie.genre))].sort());
        setKeywords(
          [...new Set(data.flatMap((movie) => movie.keywords))].sort()
        );
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchMovies();
  }, []);

  // localStorage 업데이트
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_TERM, searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.YEARS,
      JSON.stringify(selectedYears)
    );
  }, [selectedYears]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.GENRES,
      JSON.stringify(selectedGenres)
    );
  }, [selectedGenres]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.KEYWORDS,
      JSON.stringify(selectedKeywords)
    );
  }, [selectedKeywords]);

  // 연도 그룹 정의
  const yearGroups = useMemo(
    () => ({
      "2020년대": years.filter((y) => y >= 2020 && y < 2030),
      "2010년대": years.filter((y) => y >= 2010 && y < 2020),
      "2000년대": years.filter((y) => y >= 2000 && y < 2010),
      "2000년대 이전": years.filter((y) => y < 2000),
    }),
    [years]
  );

  // 필터 적용된 영화 목록
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const movieYear = movie.releaseDate
        ? Number(movie.releaseDate.slice(0, 4))
        : null;

      const matchesYear =
        selectedYears.length === 0 ||
        (movieYear !== null && selectedYears.includes(movieYear));

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => movie.genre.includes(genre));
      const matchesKeyword =
        selectedKeywords.length === 0 ||
        selectedKeywords.some((keyword) => movie.keywords.includes(keyword));

      const title = movie.title || "";
      const description = movie.overview || "";
      const matchesSearch =
        searchTerm === "" ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesYear && matchesGenre && matchesKeyword && matchesSearch;
    });
  }, [movies, selectedYears, selectedGenres, selectedKeywords, searchTerm]);

  // 페이지네이션 데이터
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const pagedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const shouldShowResults =
    searchTerm !== "" ||
    selectedYears.length > 0 ||
    selectedGenres.length > 0 ||
    selectedKeywords.length > 0;

  const toggleFilter = (stateSetter, value) => {
    stateSetter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1); // 필터 바뀌면 첫 페이지로 이동
  };

  // 초기화 버튼
  const handleReset = () => {
    setSearchTerm("");
    setSelectedYears([]);
    setSelectedGenres([]);
    setSelectedKeywords([]);
    setCurrentPage(1);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SEARCH_TERM);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.YEARS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.GENRES);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.KEYWORDS);
  };

  return (
    <div className="search-page">
      {/* 왼쪽 필터 */}
      <div className="filters">
        {/* 검색창 + 초기화 버튼 */}
        <div className="filter-box search-box">
          <h3>검색</h3>
          <Input
            placeholder="영화 제목이나 설명을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleReset} className="reset-button">
            초기화
          </button>
        </div>

        {/* 연도 그룹 체크박스 */}
        <div className="filter-box">
          <h3>년도</h3>
          {Object.entries(yearGroups).map(([label, groupYears]) => (
            <div key={label} className="filter-option">
              <Checkbox
                id={`yeargroup-${label}`}
                checked={groupYears.every((year) =>
                  selectedYears.includes(year)
                )}
                onCheckedChange={() => {
                  const allSelected = groupYears.every((year) =>
                    selectedYears.includes(year)
                  );
                  if (allSelected) {
                    setSelectedYears((prev) =>
                      prev.filter((y) => !groupYears.includes(y))
                    );
                  } else {
                    setSelectedYears((prev) => [
                      ...new Set([...prev, ...groupYears]),
                    ]);
                  }
                  setCurrentPage(1);
                }}
              />
              <label htmlFor={`yeargroup-${label}`}>{label}</label>
            </div>
          ))}
        </div>

        {/* 장르 필터 */}
        <div className="filter-box">
          <h3>장르</h3>
          {genres.map((genre, index) => (
            <div key={`genre-${genre}-${index}`} className="filter-option">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleFilter(setSelectedGenres, genre)}
              />
              <label htmlFor={`genre-${genre}`}>{genre}</label>
            </div>
          ))}
        </div>

        {/* 키워드 필터 */}
        <div className="filter-box">
          <h3>키워드</h3>
          {keywords.map((keyword, index) => (
            <div key={`keyword-${keyword}-${index}`} className="filter-option">
              <Checkbox
                id={`keyword-${keyword}`}
                checked={selectedKeywords.includes(keyword)}
                onCheckedChange={() =>
                  toggleFilter(setSelectedKeywords, keyword)
                }
              />
              <label htmlFor={`keyword-${keyword}`}>{keyword}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 영화 리스트 */}
      <div className="movie-list">
        {shouldShowResults && (
          <>
            <h2>영화 검색 결과 ({filteredMovies.length}개)</h2>
            <div className="movie-grid">
              {pagedMovies.map((movie) => (
                <div key={`movie-${movie.id}`} className="movie-card">
                  <ImageWithFallback
                    src={movie.posterUrl}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="movie-card-content">
                    <h3>{movie.title}</h3>
                    <p>
                      {movie.releaseDate
                        ? movie.releaseDate.slice(0, 4)
                        : "N/A"}
                    </p>
                    <p className="line-clamp-2">{movie.overview}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              {/* 이전 버튼 */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>

              {(() => {
                const pageNumbers = [];
                const groupSize = 3; // 현재 페이지 기준으로 몇 개 보여줄지 (홀수 추천)
                let startPage = currentPage - Math.floor(groupSize / 2);
                let endPage = currentPage + Math.floor(groupSize / 2);

                // 범위 보정
                if (startPage < 1) {
                  startPage = 1;
                  endPage = Math.min(groupSize, totalPages);
                }
                if (endPage > totalPages) {
                  endPage = totalPages;
                  startPage = Math.max(totalPages - groupSize + 1, 1);
                }

                // 맨 앞 페이지 (1)
                if (startPage > 1) {
                  pageNumbers.push(
                    <button key={1} onClick={() => setCurrentPage(1)}>
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pageNumbers.push(<span key="dots-prev">...</span>);
                  }
                }

                // 현재 그룹 페이지들
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={i === currentPage ? "active" : ""}
                    >
                      {i}
                    </button>
                  );
                }

                // 맨 끝 페이지 (totalPages)
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push(<span key="dots-next">...</span>);
                  }
                  pageNumbers.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pageNumbers;
              })()}

              {/* 다음 버튼 */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
