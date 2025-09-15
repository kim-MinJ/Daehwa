import { ArrowLeft, Star, Clock, Calendar, Users, Share2, MoreHorizontal, Play, Volume2, Film, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface Cast {
  id: string;
  name: string;
  character: string;
  image: string;
}

interface MovieDetailPageProps {
  movie: Movie;
  onBack: () => void;
  onNavigation?: (page: 'home' | 'movies' | 'ranking' | 'reviews') => void;
}

// 출연진 데이터
const cast: Cast[] = [
  {
    id: '1',
    name: '이병헌',
    character: '김수현 역',
    image: 'https://images.unsplash.com/photo-1686245203273-8f3fabb01ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RvciUyMHBvcnRyYWl0JTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    name: '하정우',
    character: '박민수 역',
    image: 'https://images.unsplash.com/photo-1686245203273-8f3fabb01ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RvciUyMHBvcnRyYWl0JTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    name: '전지현',
    character: '이서연 역',
    image: 'https://images.unsplash.com/photo-1686245203273-8f3fabb01ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RvciUyMHBvcnRyYWl0JTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    name: '조진웅',
    character: '최대식 역',
    image: 'https://images.unsplash.com/photo-1686245203273-8f3fabb01ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RvciUyMHBvcnRyYWl0JTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

// OST 데이터
const ostTracks = [
  { id: '1', title: '메인 테마', artist: '조영욱', duration: '4:32' },
  { id: '2', title: '슬픔의 멜로디', artist: '조영욱', duration: '3:28' },
  { id: '3', title: '액션 테마', artist: '조영욱', duration: '5:15' },
  { id: '4', title: '이별의 노래', artist: '이하이', duration: '3:45' }
];

// 예고편 데이터
const trailers = [
  { id: '1', title: '메인 예고편', thumbnail: 'https://images.unsplash.com/photo-1563202221-f4eae97e4828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHNjZW5lJTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjIwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', duration: '2:30' },
  { id: '2', title: '캐릭터 예고편', thumbnail: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', duration: '1:45' },
  { id: '3', title: '스페셜 영상', thumbnail: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', duration: '3:20' },
  { id: '4', title: '메이킹 영상', thumbnail: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', duration: '4:15' }
];

// 관련 키워드 영화 데이터
const keywordMovies = [
  { id: '1', title: '베테랑', poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', rating: 8.2, year: 2015 },
  { id: '2', title: '신세계', poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', rating: 8.5, year: 2013 },
  { id: '3', title: '암살', poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', rating: 8.8, year: 2015 },
  { id: '4', title: '도둑들', poster: 'https://images.unsplash.com/photo-1710988486821-9af47f60d62b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1Njk2NDMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', rating: 7.9, year: 2012 }
];

// 관련 기사 데이터
const relatedArticles = [
  {
    id: '1',
    title: '\'우는 남자\' 이정범 감독 "액션과 드라마의 조화에 집중"',
    source: '영화저널',
    date: '2024.01.15',
    thumbnail: 'https://images.unsplash.com/photo-1563202221-f4eae97e4828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHNjZW5lJTIwY2luZW1hfGVufDF8fHx8MTc1Njk3MjIwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    title: '이병헌 "10년 만의 액션 영화, 새로운 도전이었다"',
    source: '씨네21',
    date: '2024.01.12',
    thumbnail: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    title: '\'우는 남자\' 첫 주 박스오피스 1위 등극',
    source: '무비위크',
    date: '2024.01.10',
    thumbnail: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    title: '관객들이 뽑은 올해의 액션 영화 TOP 3',
    source: '스크린데일리',
    date: '2024.01.08',
    thumbnail: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export default function MovieDetailPage({ movie, onBack, onNavigation }: MovieDetailPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 공통 헤더 */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600 hover:text-black hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            뒤로가기
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 영화 기본 정보 + 줄거리 + 출연진 */}
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* 포스터 */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-80 rounded-xl overflow-hidden shadow-lg">
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 영화 정보 + 줄거리 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-red-100 text-red-700">
                      {movie.year}년 작품
                    </Badge>
                    <Badge variant="outline">
                      {movie.genre}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-black mb-4">{movie.title}</h1>
                  <p className="text-xl text-gray-700 mb-6">감독: {movie.director}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                      <span className="text-gray-500">(3,847명 평가)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>{movie.runtime}분</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>{movie.year}년 개봉</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>15세 이상 관람가</span>
                    </div>
                  </div>

                  {/* 줄거리 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-black mb-3">줄거리</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.description || '절대 울지 않는 남자의 마지막 눈물을 그린 감동 액션 드라마. 복수와 용서 사이에서 고뇌하는 한 남자의 이야기가 깊은 울림을 준다. 가족을 잃은 슬픔과 분노로 가득한 주인공이 진정한 용서와 구원을 찾아가는 여정을 그린 작품으로, 액션과 드라마가 완벽하게 조화를 이룬다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 출연진 */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">주요 출연진</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                        <ImageWithFallback
                          src={actor.image}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-black text-sm truncate">{actor.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OST 섹션 */}
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-black">OST</h2>
              </div>
              <div className="space-y-3">
                {ostTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-black">{track.title}</h4>
                        <p className="text-sm text-gray-600">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 예고편 & 영상 섹션 */}
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Film className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-black">예고편 & 영상</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trailers.map((trailer) => (
                  <div key={trailer.id} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden relative mb-3">
                      <ImageWithFallback
                        src={trailer.thumbnail}
                        alt={trailer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-800 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {trailer.duration}
                      </div>
                    </div>
                    <h4 className="font-medium text-black text-sm">{trailer.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* 비슷한 키워드 영화 추천 */}
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-6">비슷한 키워드 영화</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {keywordMovies.map((keywordMovie) => (
                  <div key={keywordMovie.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                      <ImageWithFallback
                        src={keywordMovie.poster}
                        alt={keywordMovie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold text-black text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {keywordMovie.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{keywordMovie.year}년</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-600 text-xs font-medium">{keywordMovie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 - 관련 기사 */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-black mb-6">관련 기사</h3>
              <div className="space-y-6">
                {relatedArticles.map((article) => (
                  <div key={article.id} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-medium text-black text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                <ExternalLink className="h-4 w-4 mr-2" />
                더 많은 기사 보기
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 공통 푸터 */}
    </div>
  );
}