import { useState } from 'react';
import { Star, TrendingUp, Crown, Medal, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
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
  // 슬라이드 상태 관리
  const [currentSlide, setCurrentSlide] = useState(0);
  const moviesPerSlide = 4;

  // 평점 기준으로 정렬
  const rankedMovies = movies
    .map((movie, index) => ({ ...movie, rank: index + 1 }))
    .sort((a, b) => b.rating - a.rating);

  const topMovie = rankedMovies[0];
  const secondMovie = rankedMovies[1];
  const remainingMovies = rankedMovies.slice(2);

  // 박스오피스 TOP 10
  const boxOfficeMovies = rankedMovies.slice(0, 10);
  const totalSlides = Math.ceil(boxOfficeMovies.length / moviesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideMovies = () => {
    const startIndex = currentSlide * moviesPerSlide;
    return boxOfficeMovies.slice(startIndex, startIndex + moviesPerSlide);
  };

  // VS 대결용 투표 수 생성 (실제로는 서버에서 받아올 데이터)
  const topMovieVotes = 15247;
  const secondMovieVotes = 12893;
  const totalVotes = topMovieVotes + secondMovieVotes;
  const topMoviePercentage = Math.round((topMovieVotes / totalVotes) * 100);
  const secondMoviePercentage = Math.round((secondMovieVotes / totalVotes) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 공통 헤더 */}
      <Header currentPage="ranking" onNavigation={onNavigation} />

      {/* 페이지 제목 */}
      <div className="bg-black/95 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl lg:text-4xl font-bold text-white">영화 랭킹</h1>
          </div>
          <p className="text-white/70 mt-3 text-lg">실시간 업데이트되는 영화 순위를 확인하세요</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VS 섹션 - 1위 vs 2위 */}
        <div className="mb-12">
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">최고 평점 대결</h2>
              <p className="text-gray-600 text-lg">이번 주 최고 평점 영화들의 투표 현황</p>
              <div className="mt-4">
                <p className="text-gray-500">총 {totalVotes.toLocaleString()}명이 참여</p>
              </div>
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
                  
                  {/* 승리 표시 */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white font-bold text-lg px-3 py-1">
                      승리!
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
                  {topMovie.title}
                </h3>
                <p className="text-gray-600 mb-2">{topMovie.director}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-xl text-gray-800">{topMovie.rating.toFixed(1)}</span>
                </div>
                
                {/* 투표 결과 */}
                <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                  <div className="font-bold text-yellow-400 text-xl mb-1">
                    {topMoviePercentage}%
                  </div>
                  <div className="text-yellow-300 text-sm">
                    {topMovieVotes.toLocaleString()}표
                  </div>
                </div>
              </div>

              {/* VS 텍스트 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-2xl mb-3">
                  <span className="text-white font-bold text-2xl">VS</span>
                </div>
                <p className="text-gray-600 mb-3">대결</p>
                
                {/* 투표 진행률 표시 */}
                <div className="w-40 bg-gray-700 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${topMoviePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">실시간 투표</p>
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
                
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
                  {secondMovie.title}
                </h3>
                <p className="text-gray-600 mb-2">{secondMovie.director}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-xl text-gray-800">{secondMovie.rating.toFixed(1)}</span>
                </div>
                
                {/* 투표 결과 */}
                <div className="bg-gray-300/50 rounded-lg p-4 border border-gray-400">
                  <div className="font-bold text-gray-800 text-xl mb-1">
                    {secondMoviePercentage}%
                  </div>
                  <div className="text-gray-600 text-sm">
                    {secondMovieVotes.toLocaleString()}표
                  </div>
                </div>
              </div>
            </div>
            
            {/* 투표 참여 안내 */}
            <div className="mt-8 text-center">
              <div className="bg-red-600/20 rounded-xl p-4 inline-block border border-red-500/30">
                <p className="text-red-400">
                  🗳️ <span className="font-semibold">투표는 매주 월요일 초기화됩니다</span>
                </p>
                <p className="text-red-300 text-sm mt-1">
                  다음 투표는 2일 후 시작됩니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 박스오피스 TOP 10 - 가로 슬라이드 */}
        <div className="mb-12">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-7 w-7 text-white" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">박스오피스 TOP 10</h3>
                    <p className="text-red-100">별점 합계 기준</p>
                  </div>
                </div>
                
                {/* 슬라이드 컨트롤 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalSlides <= 1}
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <span className="text-white/70 text-sm px-2">
                    {currentSlide + 1} / {totalSlides}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={totalSlides <= 1}
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getCurrentSlideMovies().map((movie) => (
                  <div 
                    key={movie.id}
                    className="group cursor-pointer bg-white/80 rounded-lg p-4 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-sm border border-gray-300"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* 순위 배지 */}
                      <div className="absolute -top-2 -left-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg ${
                          movie.rank === 1 ? 'bg-yellow-500' :
                          movie.rank === 2 ? 'bg-gray-400' :
                          movie.rank === 3 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                          {movie.rank}
                        </div>
                      </div>
                      
                      {/* 상위 3위 아이콘 */}
                      {movie.rank <= 3 && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                            {movie.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                            {movie.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                            {movie.rank === 3 && <Trophy className="h-5 w-5 text-orange-500" />}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{movie.director}</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-800">{movie.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 이번주 화제작 - 가로 스크롤 */}
        <div className="mb-12">
          <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-white" />
                <div>
                  <h3 className="text-2xl font-bold text-white">이번주 화제작</h3>
                  <p className="text-purple-100">트렌딩 지수 기준</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                {remainingMovies.slice(0, 8).map((movie, index) => (
                  <div 
                    key={movie.id}
                    className="group cursor-pointer flex-shrink-0"
                    onClick={() => onMovieClick(movie)}
                  >
                    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* HOT 배지 */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          HOT
                        </div>
                      </div>
                      
                      {/* 순위 표시 */}
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">#{index + 1}</span>
                        </div>
                      </div>
                      
                      {/* 호버 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-white/80 text-sm">
                            {movie.year}년 • {movie.genre}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 w-48">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-purple-500 transition-colors mb-2">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">{movie.director}</p>
                      
                      {/* 트렌딩 지표 */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-400 font-medium">
                          +{Math.floor(Math.random() * 500) + 100}%
                        </span>
                        <span className="text-gray-500">화제성</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 화제성 통계 */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <h4 className="font-semibold text-gray-800 mb-4">실시간 화제성 지표</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">SNS 언급</span>
                      <span className="text-sm font-bold text-purple-500">+2,547%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">검색량</span>
                      <span className="text-sm font-bold text-purple-500">+1,893%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-4 border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">리뷰 작성</span>
                      <span className="text-sm font-bold text-purple-500">+967%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 랭킹 정보 */}
        <div className="mt-8 text-center">
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">📊 랭킹 기준:</span> 평점, 관객수, 리뷰 점수를 종합하여 산정
            </p>
            <p className="text-gray-600 text-sm">
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