import { useState } from 'react';
import { Search, Bell, User, Play, Star, Calendar, Award, MessageSquare, ChevronRight, Info } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import MovieDetailPage from './components/MovieDetailPage';
import SearchPage from './components/SearchPage';
import RankingPage from './components/RankingPage';
import ReviewPage from './components/ReviewPage';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';
import "./index.css";

// 영화 데이터 타입
interface Movie {
  id: string;
  title: string;
  director: string;
  actors?: string;
  poster: string;
  year: number;
  genre: string;
  rating: number;
  runtime: number;
  description?: string;
  rank?: number;
}

// 페이지 타입
type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin';

// 피처드 영화 (오늘의 영화)
const featuredMovie = {
  id: 'featured-1',
  title: '우는 남자',
  director: '이정범',
  actors: '장동건, 김민희, 박성웅',
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
  { title: '기생충', director: '봉준호', actors: '송강호, 이선균, 조여정, 최우식' },
  { title: '올드보이', director: '박찬욱', actors: '최민식, 유지태, 강혜정' },
  { title: '부산행', director: '연상호', actors: '공유, 정유미, 마동석' },
  { title: '신세계', director: '박훈정', actors: '이정재, 황정민, 박성웅' },
  { title: '곡성', director: '나홍진', actors: '곽도원, 황정민, 천우희' },
  { title: '핸드메이든', director: '박찬욱', actors: '김민희, 김태리, 하정우' },
  { title: '버닝', director: '이창동', actors: '유아인, 전종서, 스티븐 연' },
  { title: '택시운전사', director: '장훈', actors: '송강호, 토마스 크레치만' },
  { title: '1987', director: '장준환', actors: '김윤석, 하정우, 유해진' },
  { title: '암살', director: '최동훈', actors: '전지현, 이정재, 하정우' },
  { title: '도둑들', director: '최동훈', actors: '김윤석, 김혜수, 이정재' },
  { title: '극한직업', director: '이병헌', actors: '류승범, 이하늬, 진선규' },
  { title: '베테랑', director: '류승완', actors: '황정민, 유아인, 유해진' },
  { title: '검은사제들', director: '장재현', actors: '김윤석, 강동원, 이솜' },
  { title: '밀정', director: '김지운', actors: '송강호, 공유, 한지민' },
  { title: '아가씨', director: '박찬욱', actors: '김민희, 김태리, 하정우' },
  { title: '마더', director: '봉준호', actors: '김혜자, 원빈, 진구' },
  { title: '살인의 추억', director: '봉준호', actors: '송강호, 김상경, 김뢰하' },
  { title: '괴물', director: '봉준호', actors: '송강호, 변희봉, 박해일' },
  { title: '친구', director: '곽경택', actors: '유오성, 장동건, 서태화' }
];

const genres = ['액션', '드라마', '코미디', '스릴러', '로맨스', '호러', 'SF', '범죄'];

// 영화 상세 설명들
const movieDescriptions = [
  '계급사회의 모순을 예리하게 파헤친 봉준호 감독의 걸작. 기택 가족과 박 사�� 가족 사이의 ��생관계를 통해 현대사회의 계급갈등을 그려낸다.',
  '박찬욱 감독의 복수 3부작 중 두 번째 작품. 15년간 감금된 남자의 복수를 그린 충격적인 스릴러.',
  '좀비 바이러스가 창궐한 KTX 안에서 벌어지는 생존 드라마. 인간성에 대한 깊이 있는 성찰을 담았다.',
  '조직의 세계를 사실적으로 그려낸 범죄 드라마. 이정재, 황정민의 열연이 돋보인다.',
  '미스터리 호러의 새로운 지평을 연 나홍진 감독의 대표작. 곡성에 나타난 정체불명의 존재를 둘러싼 이야기.',
  '박찬욱 감독이 선보인 에로틱 스릴러. 일제강점기를 배경으로 한 여성들의 치밀한 계략을 그린다.',
  '이창동 감독의 섬세한 연출이 돋보이는 미스터리 드라마. 무라카미 하루키의 소설을 각색했다.',
  '5.18 광주민주화운동을 배경으로 한 감동적인 드라마. 송강호의 뛰어난 연기가 인상적이다.',
  '1987년 6월 항쟁을 다룬 정치 드라마. 한국 현대사의 중요한 순간을 생생하게 재현했다.',
  '일제강점기 독립군의 암살 작전을 그린 액션 영화. 전지현, 이정재, 하정우의 캐스팅이 화제가 됐다.',
  '홍콩, 마카오, 부산을 오가며 벌어지는 도둑들의 이야기. 스타 캐스팅과 스펙터클한 액션이 볼��리.',
  '부패한 재벌 3세와 그를 쫓는 강력계 형사의 대결을 그린 액션 영화. 황정민의 카리스마가 돋보인다.',
  '악귀를 쫓는 신부들의 이야기를 그린 오컬트 호러. 김윤석, 강동원의 연기가 인상적이다.',
  '일제강점기 이중스파이의 갈등을 그린 스파이 스릴러. 송강호, 공유의 연기 대결이 볼거리.',
  '조선시대 기생들의 이야기를 그린 에로틱 드라마. 아름다운 영상미와 탄탄한 스토리가 조화를 이룬다.',
  '아들을 둔 어머니의 모성애를 그린 미스터리 드라마. 김혜자의 압도적인 연기가 깊은 인상을 남긴다.',
  '연쇄살인마를 쫓는 형사들의 이야기. 봉준호 감독의 데뷔작으로 한국 영화사에 한 획을 그었다.',
  '한강에 나타난 괴물과 맞서는 가족의 이야기. 환경 문제에 대한 메시지를 담�� �������품.'
];

// 모든 영화 데이터 생성
const allMovies: Movie[] = Array.from({ length: 20 }, (_, i) => ({
  id: `movie-${i}`,
  title: movieData[i].title,
  director: movieData[i].director,
  actors: movieData[i].actors,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };

  // 영화 상세 페이지 렌더링
  if (currentPage === 'movie-detail' && selectedMovie) {
    return <MovieDetailPage 
      movie={selectedMovie} 
      onBack={handleBackToHome} 
      onNavigation={handleNavigation}
    />;
  }

  // 검색 페이지 렌더링
  if (currentPage === 'search') {
    return (
      <SearchPage 
        movies={allMovies} 
        onMovieClick={handleMovieClick}
        onBack={handleBackToHome}
        onNavigation={handleNavigation}
        initialSearchQuery={searchQuery}
      />
    );
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

  // 리뷰 페이지 렌더��
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

  // 관리자 페이지 렌더링
  if (currentPage === 'admin') {
    return (
      <AdminPage 
        onNavigation={handleNavigation}
        onBack={handleBackToHome}
      />
    );
  }

  // 홈 페이지 렌더링 (Netflix 스타일)
  return (
    <div className="min-h-screen bg-white">
      {/* 공통 헤더 */}
      <Header currentPage={currentPage} onNavigation={handleNavigation} onSearch={handleSearch} />

      {/* 메인 콘텐츠 */}
      <main className="relative">
        
        {/* 히어로 섹션 (Netflix 스타일) */}
        <div className="relative h-[85vh] mb-8">
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => handleMovieClick(featuredMovie)}
          >
            <ImageWithFallback
              src={featuredMovie.poster}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          
          {/* 히어로 콘텐츠 */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 relative pb-8 lg:pb-16">
              <div className="max-w-lg">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {featuredMovie.title}
                </h1>
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6">
                  {featuredMovie.description?.slice(0, 200)}...
                </p>
                <div className="flex items-center gap-4 mb-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{featuredMovie.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{featuredMovie.year}년</span>
                  <span>•</span>
                  <span>{featuredMovie.runtime}분</span>
                  <span>•</span>
                  <span>{featuredMovie.genre}</span>
                </div>
                <div className="flex justify-start">
                  <Button 
                    className="bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg"
                    onClick={() => handleMovieClick(featuredMovie)}
                  >
                    <Info className="h-6 w-6 mr-3" />
                    상세 정보
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 섹션들 */}
        <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-[100px] space-y-[100px] pb-16">
          
          {/* 1. 맞춤형 추천 랭킹 TOP3 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">당신만을 위한 추천</h2>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-black font-medium"
                onClick={() => handleNavigation('ranking')}
              >
                전체 보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {/* 밑줄 추가 */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {personalizedTopMovies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="group cursor-pointer flex-shrink-0 relative"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="w-80 aspect-[16/9] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-red-600' : index === 1 ? 'bg-orange-600' : 'bg-yellow-600'
                          }`}>
                            {index + 1}
                          </div>
                          <Badge className="bg-white/20 text-white hover:bg-white/20 text-xs">
                            맞춤 추천
                          </Badge>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{movie.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{movie.year}년</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 최신 영화 추천리스트 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">최신 영화</h2>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-black font-medium"
                onClick={() => handleNavigation('movies')}
              >
                더보기 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {/* 밑줄 추가 */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {latestMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="group cursor-pointer flex-shrink-0"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-600 text-white text-xs">
                        NEW
                      </Badge>
                    </div>
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
                </div>
              ))}
            </div>
          </div>

          {/* 3. 이번주 우수작 TOP5 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">이번주 인기 순위</h2>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-black font-medium"
                onClick={() => handleNavigation('ranking')}
              >
                전체 순위 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {/* 밑줄 추가 */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {topMovies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="group cursor-pointer flex-shrink-0 relative"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
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
                </div>
              ))}
            </div>
          </div>

          {/* 4. 영화 리뷰 이벤트 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-medium text-gray-600">리뷰 이벤트</h2>
              <Badge className="bg-purple-600 text-white hover:bg-purple-600">
                진행중
              </Badge>
            </div>
            {/* 밑줄 추가 */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            
            <div className="bg-gray-100 rounded-xl p-6">
              <p className="text-gray-700 mb-6">영화 리뷰를 작성하고 특별한 혜택을 받아보세요!</p>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {reviewEventMovies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="group cursor-pointer flex-shrink-0"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                          <div className="flex items-center gap-1 text-white/80 text-xs mb-2">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            리뷰 작성
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}