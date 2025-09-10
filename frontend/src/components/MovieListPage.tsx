import { useState } from 'react';
import { Search, Filter, Grid, List, Star, Calendar, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';
import Footer from './Footer';

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

type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail';

interface MovieListPageProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBack: () => void;
  onNavigation: (page: Page) => void;
}

export default function MovieListPage({ movies, onMovieClick, onBack, onNavigation }: MovieListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const genres = ['전체', '액션', '드라마', '코미디', '스릴러', '로맨스', '호러', 'SF', '범죄'];
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'rating', label: '평점순' },
    { value: 'title', label: '제목순' },
    { value: 'year', label: '연도순' }
  ];

  // 필터링 및 정렬
  const filteredMovies = movies
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === '전체' || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage="movies" onNavigation={onNavigation} />
      
      {/* 페이지 제목 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-6 w-6 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">전체 영화</h1>
                <p className="text-gray-600 mt-1">다양한 장르의 영화를 탐색해보세요</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터링 및 검색 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* 검색 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="영화 제목, 감독을 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* 장르 필터 */}
            <div className="flex gap-2 flex-wrap">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className="whitespace-nowrap"
                >
                  {genre}
                </Button>
              ))}
            </div>

            {/* 정렬 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 결과 정보 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{filteredMovies.length}</span>개의 영화
          </div>
        </div>

        {/* 영화 목록 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => onMovieClick(movie)}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative">
                  <ImageWithFallback
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                      상세보기
                    </Button>
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                    {movie.title}
                  </h4>
                  <p className="text-gray-600 text-xs mb-2">감독: {movie.director}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">{movie.year}년</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-yellow-600 text-xs font-medium">{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {movie.genre}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onMovieClick(movie)}
              >
                <div className="flex gap-6">
                  <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
                        <p className="text-gray-600 mb-2">감독: {movie.director}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {movie.year}년
                      </div>
                      <span className="text-sm text-gray-500">{movie.runtime}분</span>
                      <Badge variant="outline" className="text-xs">
                        {movie.genre}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {movie.description || '이 영화에 대한 상세한 정보를 확인해보세요.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}