import { useState } from 'react';
import { Search, Bell, User, Play, Star, Calendar, Award, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import MovieDetailPage from './components/MovieDetailPage';
import SearchPage from './components/SearchPage';
import RankingPage from './components/RankingPage';
import ReviewPage from './components/ReviewPage';
import Header from './components/Header';
import Footer from './components/Footer';

// 영화 데이터 타입
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

// 페이지 타입
type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search';

// 피처드 영화 (오늘의 영화)
const featuredMovie = {
  id: 'featured-1',
  title: '우는 남자',
  director: '이정범',
  poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  year: 2024,
  genre: '액션/드라마',
  rating: 8.7,
  runtime: 125,
  description: '절대 울지 않는 남자의 마지막 눈물을 그린 감동 액션 드라마. 복수와 용서 사이에서 고뇌하는 한 남자의 이야기가 깊은 울림을 준다. 가족을 잃은 슬픔과 분노로 가득한 주인공이 진정한 용서와 구원을 찾아가는 여정을 그린 작품으로, 액션과 드라마가 완벽하게 조화를 이룬다.'
};

// 영화 포스터 이미지들
const moviePosters = [
  'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1710988486821-9af47f60d62b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1Njk2NDMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1NjkxNjIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
];

// 한국 영화 데이터
const movieData = [
  { title: '기생충', director: '봉준호' },
  { title: '올드보이', director: '박찬욱' },
  { title: '부산행', director: '연상호' },
  { title: '신세계', director: '박훈정' },
  { title: '곡성', director: '나홍진' },
  { title: '핸드메이든', director: '박찬욱' },
  { title: '버닝', director: '이창동' },
  { title: '택시운전사', director: '장훈' },
  { title: '1987', director: '장준환' },
  { title: '암살', director: '최동훈' },
  { title: '도둑들', director: '최동훈' },
  { title: '극한직업', director: '이병헌' },
  { title: '베테랑', director: '류승완' },
  { title: '검은사제들', director: '장재현' },
  { title: '밀정', director: '김지운' },
  { title: '아가씨', director: '박찬욱' },
  { title: '마더', director: '봉준호' },
  { title: '살인의 추억', director: '봉준호' },
  { title: '괴물', director: '봉준호' },
  { title: '친구', director: '곽경택' }
];

const genres = ['액션', '드라마', '코미디', '스릴러', '로맨스', '호러', 'SF', '범죄'];

// 영화 상세 설명들
const movieDescriptions = [
  '계급사회의 모순을 예리하게 파헤친 봉준호 감독의 걸작. 기택 가족과 박 사장 가족 사이의 기생관계를 통해 현대사회의 계급갈등을 그려낸다.',
  '박찬욱 감독의 복수 3부작 중 두 번째 작품. 15년간 감금된 남자의 복수를 그린 충격적인 스릴러.',
  '좀비 바이러스가 창궐한 KTX 안에서 벌어지는 생존 드라마. 인간성에 대한 깊이 있는 성찰을 담았다.',
  '조직의 세계를 사실적으로 그려낸 범죄 드라마. 이정재, 황정민의 열연이 돋보인다.',
  '미스터리 호러의 새로운 지평을 연 나홍진 감독의 대표작. 곡성에 나타난 정체불명의 존재를 둘러싼 이야기.',
  '박찬욱 감독이 선보인 에로틱 스릴러. 일제강점기를 배경으로 한 여성들의 치밀한 계략을 그린다.',
  '이창동 감독의 섬세한 연출이 돋보이는 미스터리 드라마. 무라카미 하루키의 소설을 각색했다.',
  '5.18 광주민주화운동을 배경으로 한 감동적인 드라마. 송강호의 뛰어난 ���기가 인상적이다.',
  '1987년 6월 항쟁을 다룬 정치 드라마. 한국 현대사의 중요한 순간을 생생하게 재현했다.',
  '일제강점기 독립군의 암살 작전을 그린 액션 영화. 전지현, 이정재, 하정우의 캐스팅이 화제가 됐다.',
  '홍콩, 마카오, 부산을 오가며 벌어지는 도둑들의 이야기. 스타 캐스팅과 스펙터클한 액션이 볼거리.',
  '마약수사대의 위장 수사를 소재로 한 액션 코미디. 류승범, 이하늬 등의 코믹 연기가 웃음을 준다.',
  '부패한 재벌 3세와 그를 쫓는 강력계 형사의 대결을 그린 액션 영화. 황정민의 카리스마가 돋보인다.',
  '악귀를 쫓는 신부들의 이야기를 그린 오컬트 호러. 김윤석, 강동원의 연기가 인상적이다.',
  '일제강점기 이중스파이의 갈등을 그린 스파이 스릴러. 송강호, 공유의 연기 대결이 볼거리.',
  '조선시대 기생들의 이야기를 그린 에로틱 드라마. 아름다운 영상미와 탄탄한 스토리가 조화를 이룬다.',
  '아들을 둔 어머니의 모성애를 그린 미스터리 드라마. 김혜자의 압도적인 연기가 깊은 인상을 남긴다.',
  '연쇄살인마를 쫓는 형사들의 이야기. 봉준호 감독의 데뷔작으로 한국 영화사에 한 획을 그었다.',
  '한강에 나타난 괴물과 맞서는 가족�� 이야기. 환경 문제에 대한 메시지를 담은 작품.'
];

// 모든 영화 데이터 생성
const allMovies: Movie[] = Array.from({ length: 20 }, (_, i) => ({
  id: `movie-${i}`,
  title: movieData[i].title,
  director: movieData[i].director,
  poster: moviePosters[i % moviePosters.length],
  year: 2000 + Math.floor(Math.random() * 25),
  genre: genres[Math.floor(Math.random() * genres.length)],
  rating: 7.0 + Math.random() * 2.5,
  runtime: 90 + Math.floor(Math.random() * 60),
  description: movieDescriptions[i]
}));

// 1. 맞춤형 추천 랭킹 TOP3
const personalizedTopMovies = allMovies.slice(0, 3).map((movie, index) => ({
  ...movie,
  rank: index + 1
}));

// 2. 최신 영화 추천리스트
const latestMovies = allMovies.slice(6, 12);

// 3. 이번주 우수작 TOP5
const topMovies = allMovies.slice(12, 17).map((movie, index) => ({
  ...movie,
  rank: index + 1
}));

// 4. 영화 리뷰 요청 이벤트 영화들
const reviewEventMovies = allMovies.slice(17, 20);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentPage('movie-detail');
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setSelectedMovie(null);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedMovie(null);
  };

  // 영화 상세 페이지 렌더링
  if (currentPage === 'movie-detail' && selectedMovie) {
    return <MovieDetailPage 
      movie={selectedMovie} 
      onBack={handleBackToHome} 
      onNavigation={handleNavigation}
    />;
  }

  // 영화 목록 페이지 렌더링
  if (currentPage === 'movies') {
    return (
      <SearchPage 
        movies={allMovies} 
        onMovieClick={handleMovieClick}
        onBack={handleBackToHome}
        onNavigation={handleNavigation}
      />
    );
  }

  // 랭킹 페이지 렌더링
  if (currentPage === 'ranking') {
    return (
      <RankingPage 
        movies={allMovies} 
        onMovieClick={handleMovieClick}
        onBack={handleBackToHome}
        onNavigation={handleNavigation}
      />
    );
  }

  // 리뷰 페이지 렌더링
  if (currentPage === 'reviews') {
    return (
      <ReviewPage 
        movies={allMovies} 
        onMovieClick={handleMovieClick}
        onBack={handleBackToHome}
        onNavigation={handleNavigation}
      />
    );
  }

  // 홈 페이지 렌더링
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage={currentPage} onNavigation={handleNavigation} />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 피처드 영화 (오늘의 영화 메인) */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div 
                  className="w-80 h-96 rounded-xl overflow-hidden shadow-xl relative cursor-pointer group"
                  onClick={() => handleMovieClick(featuredMovie)}
                >
                  <ImageWithFallback
                    src={featuredMovie.poster}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 lg:pl-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    오늘의 영화
                  </Badge>
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    {featuredMovie.genre}
                  </Badge>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{featuredMovie.title}</h2>
                <p className="text-xl text-gray-600 mb-6">감독: {featuredMovie.director}</p>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-2xl">
                  {featuredMovie.description}
                </p>
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{featuredMovie.rating}</span>
                    <span className="text-gray-500">(2,847명 평가)</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{featuredMovie.year}년</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{featuredMovie.runtime}분</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 1. 맞춤형 추�� 랭킹 TOP3 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">맞춤형 추천 랭킹 TOP3</h3>
              <p className="text-gray-600">당신의 취향을 바탕으로 추천하는 베스트 영화</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700 font-medium"
              onClick={() => handleNavigation('ranking')}
            >
              전체 랭킹 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personalizedTopMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="group cursor-pointer relative"
                onClick={() => handleMovieClick(movie)}
              >
                {/* 순위 표시 */}
                <div className="absolute -top-4 -left-4 z-20">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl ${
                    movie.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    movie.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-orange-400 to-orange-600'
                  }`}>
                    {movie.rank}
                  </div>
                </div>

                {/* 메인 카드 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    
                    {/* 랭킹 배지 */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`text-white font-bold ${
                        movie.rank === 1 ? 'bg-yellow-500' :
                        movie.rank === 2 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                        #{movie.rank} 추천
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {movie.title}
                    </h4>
                    
                    <p className="text-gray-600">감독: {movie.director}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-lg">{movie.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">({movie.year}년)</span>
                      </div>
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        {movie.genre}
                      </Badge>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {movie.description?.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* ���천 이유 */}
                <div className="mt-4 bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-700 font-medium text-sm">추천 이유</span>
                  </div>
                  <p className="text-orange-600 text-sm">
                    {movie.rank === 1 ? '최근 시청한 액션 영화와 취향이 비슷해요!' :
                     movie.rank === 2 ? '평점이 높고 같은 감독 작품을 좋아하셨어요!' :
                     '비슷한 장르를 즐겨보시는 패턴이 있어요!'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 최신 영화 추천리스트 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">최신 영화 추천리스트</h3>
              <p className="text-gray-600">2024년 최신 개봉작 중 놓치면 안 될 작품들</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => handleNavigation('movies')}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {latestMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="group cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative">
                  <ImageWithFallback
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-xs">
                    NEW
                  </Badge>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
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
        </div>

        {/* 3. 이번주 우수작 TOP5 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">이번주 우수작 TOP5</h3>
              <p className="text-gray-600">평점과 관객수를 종합한 이번주 최고의 영화들</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-green-600 hover:text-green-700 font-medium"
              onClick={() => handleNavigation('ranking')}
            >
              전체 순위 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="group cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative">
                  <ImageWithFallback
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                    {movie.rank}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-semibold text-sm">#{movie.rank} 위</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
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
        </div>

        {/* 4. 영화 리뷰 요청 이벤트 */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-purple-600 mb-2">영화 리뷰 요청 이벤트</h3>
                <p className="text-gray-600">리뷰를 작성하고 특별한 혜택을 받아보세요!</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 px-4 py-2">
                이벤트 진행중
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviewEventMovies.map((movie) => (
                <Card 
                  key={movie.id} 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="relative">
                    <div className="aspect-[16/9] rounded-t-lg overflow-hidden">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">감독: {movie.director}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-600 font-medium">{movie.rating.toFixed(1)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {movie.genre}
                      </Badge>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      리뷰 작성하고 포인트 받기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-purple-700 mb-4">
                💝 리뷰 작성시 1,000포인트 + 추가 혜택까지!
              </p>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                이벤트 ��세히 보기
              </Button>
            </div>
          </div>
        </div>

      </main>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}