import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Grid, List } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';

interface Movie {
  id: string;
  title: string;
  director: string;
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
  onNavigation: (page: 'home' | 'movies' | 'ranking' | 'reviews') => void;
}

const years = ['2019년', '2018년', '2009년', '2003년', '1997년', '1995년'];
const genres = ['SF', '가족', '드라마', '로맨스', '스릴러', '액션코미디', '액션'];
const keywords = ['가족', '감동', '재벌', '복수', '시간여행', '코믹', '인스타', '휴머니즘'];

export default function SearchPage({ movies, onMovieClick, onBack, onNavigation }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 필터링된 영화들
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage="movies" onNavigation={onNavigation} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 왼쪽 필터 사이드바 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <div className="space-y-6">
                {/* 검색 */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="영화 제목이나 감독을 검색해주세요"
                      className="pl-10 bg-gray-50 border-0"
                    />
                  </div>
                </div>

                {/* 연도 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">연도</label>
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
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {year}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 장르 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">장르</label>
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
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 키워드 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">키워드</label>
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
                          className="text-sm text-gray-600 cursor-pointer"
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
                  className="w-full"
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 검색 결과 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  영화 {sortedMovies.length}건 검색 ({Math.min(sortedMovies.length, 6)}개)
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* 정렬 옵션 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">정렬:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">최신순</SelectItem>
                      <SelectItem value="rating">평점순</SelectItem>
                      <SelectItem value="title">제목순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 뷰 모드 토글 */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 활성 필터 표시 */}
            {(selectedYears.length > 0 || selectedGenres.length > 0 || selectedKeywords.length > 0 || searchQuery) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-900">적용된 필터</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    모두 지우기
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge className="bg-blue-100 text-blue-700">
                      검색: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedYears.map((year) => (
                    <Badge key={year} className="bg-green-100 text-green-700">
                      {year}
                    </Badge>
                  ))}
                  {selectedGenres.map((genre) => (
                    <Badge key={genre} className="bg-purple-100 text-purple-700">
                      {genre}
                    </Badge>
                  ))}
                  {selectedKeywords.map((keyword) => (
                    <Badge key={keyword} className="bg-orange-100 text-orange-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 영화 그리드 */}
            {sortedMovies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {sortedMovies.slice(0, 6).map((movie) => (
                  <div 
                    key={movie.id} 
                    className="group cursor-pointer"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 relative">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2">{movie.year}년</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 hover:bg-blue-100"
                        >
                          {movie.director.split('')[0] === '박' ? '드라마' : '액션'}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-green-100 text-green-700 hover:bg-green-100"
                        >
                          {movie.genre}
                        </Badge>
                        {Math.random() > 0.5 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 hover:bg-purple-100"
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
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-gray-600 mb-2">감독: {movie.director}</p>
                        <p className="text-gray-500 text-sm mb-3">{movie.year}년 • {movie.runtime}분 • 평점 {movie.rating.toFixed(1)}</p>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {movie.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            드라마
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                            {movie.genre}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
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
                <Button variant="outline" className="px-8">
                  더 많은 결과 보기 ({sortedMovies.length - 6}개 더)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}