import { Star, TrendingUp, Crown, Medal, Trophy } from 'lucide-react';
import { Badge } from './ui/badge';
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

interface RankingPageProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBack: () => void;
  onNavigation: (page: Page) => void;
}

export default function RankingPage({ movies, onMovieClick, onBack, onNavigation }: RankingPageProps) {
  // 평점 기준으로 정렬
  const rankedMovies = movies
    .map((movie, index) => ({ ...movie, rank: index + 1 }))
    .sort((a, b) => b.rating - a.rating);

  const topMovie = rankedMovies[0];
  const secondMovie = rankedMovies[1];
  const remainingMovies = rankedMovies.slice(2);

  // 격자에 표시할 영화들을 두 그룹으로 나누기
  const firstGridMovies = remainingMovies.slice(0, 4);
  const secondGridMovies = remainingMovies.slice(4, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage="ranking" onNavigation={onNavigation} />

      {/* 페이지 제목 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">영화 랭킹</h1>
          </div>
          <p className="text-gray-600 mt-2">실시간 업데이트되는 영화 순위를 확인하세요</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VS 섹션 - 1위 vs 2위 */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">VS 대결</h2>
              <p className="text-gray-600">이번 주 최고 평점 영화 1위 vs 2위</p>
            </div>

            <div className="flex items-center justify-center gap-12">
              {/* 1위 영화 */}
              <div 
                className="group cursor-pointer text-center"
                onClick={() => onMovieClick(topMovie)}
              >
                <div className="relative mb-4">
                  <div className="w-48 h-64 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={topMovie.poster}
                      alt={topMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 1위 배지 */}
                  <div className="absolute -top-3 -left-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* 순위 표시 */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white font-bold text-lg px-3 py-1">
                      1위
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {topMovie.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{topMovie.director}</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-lg">{topMovie.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* VS 텍스트 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-2">
                  <span className="text-white font-bold text-xl">VS</span>
                </div>
                <p className="text-gray-500 text-sm">대결</p>
              </div>

              {/* 2위 영화 */}
              <div 
                className="group cursor-pointer text-center"
                onClick={() => onMovieClick(secondMovie)}
              >
                <div className="relative mb-4">
                  <div className="w-48 h-64 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={secondMovie.poster}
                      alt={secondMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 2위 배지 */}
                  <div className="absolute -top-3 -left-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                      <Medal className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* 순위 표시 */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-400 text-white font-bold text-lg px-3 py-1">
                      2위
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {secondMovie.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{secondMovie.director}</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-lg">{secondMovie.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ��드 레이아웃 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 박스오피스 TOP 10 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">박스오피스 TOP 10</h3>
                  <p className="text-red-100 text-sm">별점 합계 기준</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {rankedMovies.slice(0, 10).map((movie) => (
                  <div 
                    key={movie.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                        movie.rank === 1 ? 'bg-yellow-500' :
                        movie.rank === 2 ? 'bg-gray-400' :
                        movie.rank === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}>
                        {movie.rank}
                      </div>
                    </div>
                    
                    <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">{movie.director}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{movie.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{movie.year}</span>
                      </div>
                    </div>
                    
                    {movie.rank <= 3 && (
                      <div className="flex-shrink-0">
                        {movie.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                        {movie.rank === 2 && <Medal className="h-4 w-4 text-gray-400" />}
                        {movie.rank === 3 && <Trophy className="h-4 w-4 text-orange-500" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 이번주 화제작 */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">이번주 화제작</h3>
                  <p className="text-purple-100 text-sm">별점 합계 기준</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {remainingMovies.slice(0, 4).map((movie) => (
                  <div 
                    key={movie.id}
                    className="group cursor-pointer"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                          HOT
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-600 text-xs font-medium">{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">화제성 지표</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SNS 언급</span>
                    <span className="text-sm font-medium text-purple-600">+2,547%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">검색량</span>
                    <span className="text-sm font-medium text-purple-600">+1,893%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">리뷰 작성</span>
                    <span className="text-sm font-medium text-purple-600">+967%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 랭킹 정보 */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-blue-700 mb-2">
              <span className="font-semibold">📊 랭킹 기준:</span> 평점, 관객수, 리뷰 점수를 종합하여 산정
            </p>
            <p className="text-blue-600 text-sm">
              매일 오전 6시에 업데이트됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}