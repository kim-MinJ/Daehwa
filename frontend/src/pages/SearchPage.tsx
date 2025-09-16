import { Grid, List, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Movie {
  movieIdx: number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  genres?: string[];
  voteAverage?: number;
}

const genreMap: Record<string, string> = {
  Action: '액션',
  Adventure: '모험',
  Animation: '애니메이션',
  Comedy: '코미디',
  Crime: '범죄',
  Documentary: '다큐멘터리',
  Drama: '드라마',
  Family: '가족',
  Fantasy: '판타지',
  History: '역사',
  Horror: '공포',
  Music: '음악',
  Mystery: '미스터리',
  Romance: '로맨스',
  'Science Fiction': 'SF',
  'TV Movie': 'TV 영화',
  Thriller: '스릴러',
  War: '전쟁',
  Western: '서부극',
};

// 간단한 fetch helper
async function fetchMoviesFromApi(page: number, limit = 20): Promise<Movie[]> {
  const res = await fetch(`/api/searchMovie?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('서버에서 배열이 아닌 데이터를 반환했습니다.');
  // 포스터 없는 영화는 제외
  return data.filter((m: Movie) => m.posterPath && m.posterPath.trim() !== '');
}

// 로딩 스피너 컴포넌트
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-600">로딩중...</span>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('query') || '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState(queryFromUrl);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'title'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(8);
  const [years, setYears] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const newMovies = await fetchMoviesFromApi(page);
        if (!alive) return;

        const combined = [...movies, ...newMovies];
        const uniqueMovies = Array.from(new Map(combined.map(m => [m.movieIdx, m])).values());
        setMovies(uniqueMovies);

        const allYears = [...new Set(uniqueMovies.map(m => m.releaseDate ? `${m.releaseDate.split('-')[0]}년` : ''))].filter(Boolean);
        setYears(allYears.sort((a, b) => parseInt(b) - parseInt(a)));

        const allGenres = [...new Set(uniqueMovies.flatMap(m => m.genres || []))];
        setGenres(allGenres.sort());
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [page]);

  const yearGroups = useMemo(() => {
    const groups: Record<string, string[]> = { '2020년대': [], '2010년대': [], '2000년대': [] };
    years.forEach(y => {
      const num = parseInt(y);
      if (num >= 2020) groups['2020년대'].push(y);
      else if (num >= 2010) groups['2010년대'].push(y);
      else if (num >= 2000) groups['2000년대'].push(y);
    });
    return groups;
  }, [years]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = !query || movie.title.toLowerCase().includes(query.toLowerCase());
      const movieYear = movie.releaseDate ? `${movie.releaseDate.split('-')[0]}년` : '';
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(movieYear);
      const matchesGenre = selectedGenres.length === 0 || (movie.genres || []).some(g => selectedGenres.includes(g));
      return matchesSearch && matchesYear && matchesGenre;
    });
  }, [movies, query, selectedYears, selectedGenres]);

  const sortedMovies = useMemo(() => {
    const sorted = [...filteredMovies];
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => (parseInt(b.releaseDate?.split('-')[0] || '0')) - (parseInt(a.releaseDate?.split('-')[0] || '0')));
      case 'rating':
        return sorted.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
      case 'title':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return sorted;
    }
  }, [filteredMovies, sortBy]);

  const toggleYearGroup = (group: string) => {
    const groupYears = yearGroups[group];
    const allSelected = groupYears.every(y => selectedYears.includes(y));
    if (allSelected) setSelectedYears(prev => prev.filter(y => !groupYears.includes(y)));
    else setSelectedYears(prev => [...new Set([...prev, ...groupYears])]);
    setDisplayCount(8);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    setDisplayCount(8);
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedYears([]);
    setSelectedGenres([]);
    setDisplayCount(8);
    navigate('/search');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleSortChange = (val: string) => setSortBy(val as 'latest' | 'rating' | 'title');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8 flex gap-8">
        {/* 필터 */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-gray-100/50 rounded-2xl p-6 shadow-lg border sticky top-24 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer" onClick={handleSearchSubmit} />
              <form onSubmit={handleSearchSubmit}>
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="영화 제목 검색"
                  className="pl-10"
                />
              </form>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-2">
                {Object.entries(yearGroups).map(([label, groupYears]) => (
                  <div key={label} className="flex items-center space-x-3">
                    <Checkbox
                      id={`group-${label}`}
                      checked={groupYears.every(y => selectedYears.includes(y))}
                      onCheckedChange={() => toggleYearGroup(label)}
                    />
                    <label htmlFor={`group-${label}`} className="text-sm text-gray-700 cursor-pointer">{label}</label>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {genres.map((genre, idx) => (
                <div key={`${genre}-${idx}`} className="flex items-center space-x-3">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                  />
                  <label htmlFor={`genre-${genre}`} className="text-sm text-gray-700 cursor-pointer">{genreMap[genre] || genre}</label>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={clearAllFilters} className="w-full">
              필터 초기화
            </Button>
          </div>
        </div>

        {/* 영화 리스트 */}
        <div className="flex-1 space-y-6">
          {!query && selectedYears.length === 0 && selectedGenres.length === 0 ? (
            <p className="text-center text-gray-600 py-12">검색어를 입력하거나 필터를 선택해주세요.</p>
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">영화 {sortedMovies.length}건</h1>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-32 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">최신순</SelectItem>
                      <SelectItem value="rating">평점순</SelectItem>
                      <SelectItem value="title">제목순</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
                </div>
              </div>

              {sortedMovies.length === 0 ? (
                <p className="text-center text-gray-600 py-12">검색 결과가 없습니다.</p>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                  {sortedMovies.slice(0, displayCount).map((movie, idx) => (
                    <div
                      key={`${movie.movieIdx}-${idx}`}
                      className="cursor-pointer"
                      onClick={() => navigate(`/movies/${movie.movieIdx}`)}
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                        <ImageWithFallback
                          src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/default-poster.png'}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold text-gray-800 line-clamp-1">{movie.title}</h3>
                      <p className="text-gray-600 text-xs">{movie.releaseDate?.split('-')[0]}년 • {(movie.genres || []).map(g => genreMap[g] || g).join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}

              {displayCount < sortedMovies.length && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    className="px-8 bg-white border-gray-400 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setDisplayCount(prev => prev + 8)}
                  >
                    더 많은 결과 보기
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
