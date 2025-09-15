import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Grid, List, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';
import Footer from './Footer';

interface Movie {
  id: string;
  title: string;
  director: string;
  actors: string;
  poster: string;
  year: number;
  genre: string;
  rating: number;
  runtime: number;
  description?: string;
  rank?: number;
}

interface SearchPageProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBack: () => void;
  onNavigation: (page: 'home' | 'movies' | 'ranking' | 'reviews' | 'search') => void;
  initialSearchQuery?: string;
}

const years = ['2019년', '2018년', '2009년', '2003년', '1997년', '1995년'];
const genres = ['SF', '가족', '드라마', '로맨스', '스릴러', '액션코미디', '액션'];
const keywords = ['가족', '감동', '재벌', '복수', '시간여행', '코믹', '인스타', '휴머니즘'];

export default function SearchPage({ movies, onMovieClick, onBack, onNavigation, initialSearchQuery = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 필터링된 영화들
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // 검색어 필터 (제목, 감독, 배우)
    if (searchQuery) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.actors.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 연도 필터
    if (selectedYears.length > 0) {
      filtered = filtered.filter(movie => {
        const yearString = `${movie.year}년`;
        return selectedYears.includes(yearString);
      });
    }

    // 장르 필터
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie => 
        selectedGenres.some(genre => movie.genre.includes(genre))
      );
    }

    return filtered;
  }, [movies, searchQuery, selectedYears, selectedGenres]);

  // 정렬
  const sortedMovies = useMemo(() => {
    const sorted = [...filteredMovies];
    
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [filteredMovies, sortBy]);

  const handleYearFilter = (year: string, checked: boolean) => {
    if (checked) {
      setSelectedYears([...selectedYears, year]);
    } else {
      setSelectedYears(selectedYears.filter(y => y !== year));
    }
  };

  const handleGenreFilter = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const handleKeywordFilter = (keyword: string, checked: boolean) => {
    if (checked) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    } else {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedYears([]);
    setSelectedGenres([]);
    setSelectedKeywords([]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 공통 헤더 */}

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="flex gap-8">
          {/* 왼쪽 필터 사이드바 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 sticky top-24">
              <div className="space-y-6">
                {/* 검색 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="영화 제목, 감독, 배우를 검색해주세요"
                      className="pl-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* 연도 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">연도</label>
                  <div className="space-y-2">
                    {years.map((year) => (
                      <div key={year} className="flex items-center space-x-3">
                        <Checkbox
                          id={`year-${year}`}
                          checked={selectedYears.includes(year)}
                          onCheckedChange={(checked) => handleYearFilter(year, checked as boolean)}
                        />
                        <label
                          htmlFor={`year-${year}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                        >
                          {year}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 장르 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">장르</label>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-3">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => handleGenreFilter(genre, checked as boolean)}
                        />
                        <label
                          htmlFor={`genre-${genre}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 키워드 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">키워드</label>
                  <div className="space-y-2">
                    {keywords.map((keyword) => (
                      <div key={keyword} className="flex items-center space-x-3">
                        <Checkbox
                          id={`keyword-${keyword}`}
                          checked={selectedKeywords.includes(keyword)}
                          onCheckedChange={(checked) => handleKeywordFilter(keyword, checked as boolean)}
                        />
                        <label
                          htmlFor={`keyword-${keyword}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                        >
                          {keyword}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 필터 초기화 */}
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full bg-white border-gray-400 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 검색 결과 컨테이너 */}
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/30">
              {/* 검색 결과 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-800">
                    영화 {sortedMovies.length}건 검색 ({Math.min(sortedMovies.length, 6)}개)
                  </h1>
                </div>
              
                <div className="flex items-center gap-4">
                  {/* 정렬 옵션 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">정렬:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32 text-sm bg-white border-gray-300 text-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value="latest" className="text-gray-800 hover:bg-gray-100">최신순</SelectItem>
                        <SelectItem value="rating" className="text-gray-800 hover:bg-gray-100">평점순</SelectItem>
                        <SelectItem value="title" className="text-gray-800 hover:bg-gray-100">제목순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 뷰 모드 토글 */}
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-300">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`h-8 px-3 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 활성 필터 표시 */}
              {(selectedYears.length > 0 || selectedGenres.length > 0 || selectedKeywords.length > 0 || searchQuery) && (
                <div className="mb-6 p-4 bg-white/70 rounded-lg border border-gray-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">적용된 필터</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    >
                      모두 지우기
                    </Button>
                  </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                      검색: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedYears.map((year) => (
                    <Badge key={year} className="bg-green-600 text-white hover:bg-green-600">
                      {year}
                    </Badge>
                  ))}
                  {selectedGenres.map((genre) => (
                    <Badge key={genre} className="bg-purple-600 text-white hover:bg-purple-600">
                      {genre}
                    </Badge>
                  ))}
                  {selectedKeywords.map((keyword) => (
                    <Badge key={keyword} className="bg-orange-600 text-white hover:bg-orange-600">
                      {keyword}
                    </Badge>
                  ))}
                  </div>
                </div>
              )}

              {/* 영화 그리드 */}
              {sortedMovies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
                  <p className="text-gray-500 text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
                </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {sortedMovies.slice(0, 6).map((movie) => (
                  <div 
                    key={movie.id} 
                    className="group cursor-pointer"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                          <div className="flex items-center gap-1 text-white/80 text-xs">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-red-500 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2">{movie.year}년</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-blue-600 text-white hover:bg-blue-600"
                        >
                          {movie.director.split('')[0] === '박' ? '드라마' : '액션'}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-green-600 text-white hover:bg-green-600"
                        >
                          {movie.genre}
                        </Badge>
                        {Math.random() > 0.5 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-purple-600 text-white hover:bg-purple-600"
                          >
                            {keywords[Math.floor(Math.random() * keywords.length)]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 리스트 뷰
              <div className="space-y-4">
                {sortedMovies.slice(0, 6).map((movie) => (
                  <div 
                    key={movie.id} 
                    className="bg-white/80 rounded-lg p-6 border border-gray-300 hover:border-gray-400 transition-all cursor-pointer group shadow-sm"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-32 flex-shrink-0">
                        <ImageWithFallback
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-gray-600 mb-2">감독: {movie.director}</p>
                        <p className="text-gray-500 text-sm mb-3">{movie.year}년 • {movie.runtime}분 • 평점 {movie.rating.toFixed(1)}</p>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {movie.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-600">
                            드라마
                          </Badge>
                          <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-600">
                            {movie.genre}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-600 text-white hover:bg-purple-600">
                            가족
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

              {/* 더보기 버튼 */}
              {sortedMovies.length > 6 && (
                <div className="text-center mt-8">
                  <Button variant="outline" className="px-8 bg-white border-gray-400 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                    더 많은 결과 보기 ({sortedMovies.length - 6}개 더)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}