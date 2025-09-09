import { Star, Heart, MessageCircle, MoreHorizontal, ThumbsUp, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';

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
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  replies: number;
  isVerified?: boolean;
  movieTitle: string;
  moviePoster: string;
}

type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail';

interface ReviewPageProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBack: () => void;
  onNavigation: (page: Page) => void;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '영화매니아',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: '정말 감동적인 영화였습니다. 연출과 연기 모든 면에서 완벽했고, 특히 마지막 장면에서는 눈물이 났네요. 올해 본 영화 중 최고입니다.',
    date: '2024년 1월 15일',
    likes: 124,
    replies: 23,
    isVerified: true,
    movieTitle: '기생충',
    moviePoster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    userId: 'user2',
    userName: '시네마러버',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c35e1e22?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    content: '스토리는 예측 가능했지만, 배우들의 연기력이 정말 뛰어났어요. 특히 주연 배우의 감정 표현이 인상깊었습니다.',
    date: '2024년 1월 14일',
    likes: 89,
    replies: 15,
    movieTitle: '올드보이',
    moviePoster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    userId: 'user3',
    userName: '무비헌터',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    content: '영상미가 정말 아름다웠습니다. 촬영과 음악이 조화롭게 어우러져서 몰입도가 높았어요. 다만 중반부가 조금 지루한 감이 있었습니다.',
    date: '2024년 1월 13일',
    likes: 67,
    replies: 8,
    movieTitle: '부산행',
    moviePoster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '4',
    userId: 'user4',
    userName: '드라마킹',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    content: '완벽한 스릴러 영화입니다. 매 순간이 긴장감 넘치고 결말이 정말 충격적이었어요. 다시 한번 보고 싶은 영화네요.',
    date: '2024년 1월 12일',
    likes: 156,
    replies: 31,
    isVerified: true,
    movieTitle: '신세계',
    moviePoster: 'https://images.unsplash.com/photo-1710988486821-9af47f60d62b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1Njk2NDMzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '5',
    userId: 'user5',
    userName: '감성시네마',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    content: '감동적인 스토리와 아름다운 영상이 인상적이었습니다. 가족과 함께 보기에 좋은 따뜻한 영화였어요.',
    date: '2024년 1월 11일',
    likes: 43,
    replies: 12,
    movieTitle: '곡성',
    moviePoster: 'https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1NjkxNjIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export default function ReviewPage({ movies, onMovieClick, onBack, onNavigation }: ReviewPageProps) {
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  
  // 오늘의 영화 (매일 변경되는 추천 영화)
  const todayMovie = {
    id: 'today-movie',
    title: '우는 남자',
    director: '이정범',
    poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjUzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    year: 2024,
    genre: '액션/드라마',
    rating: 8.7,
    runtime: 125,
    description: '절대 울지 않는 남자의 마지막 눈물을 그린 감동 액션 드라마. 복수와 용서 사이에서 고뇌하는 한 남자의 이야기가 깊은 울림을 준다.'
  };

  const handleSubmitReview = () => {
    if (newReview.trim() && userRating > 0) {
      // 리뷰 제출 로직
      setNewReview('');
      setUserRating(0);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i}
        className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E4E4E4' }}>
      {/* 공통 헤더 */}
      <Header currentPage="reviews" onNavigation={onNavigation} />

      {/* 페이지 제목 */}
      <div className="bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-white">영화 리뷰</h1>
          </div>
          <p className="text-white/70 mt-2">영화에 대한 솔직한 리뷰를 작성하고 다른 사용자들의 후기도 확인해보세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        {/* 오늘의 영화 리뷰 섹션 */}
        <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white hover:bg-red-600 text-sm px-4 py-2">
                오늘의 영화
              </Badge>
              <h2 className="text-2xl font-bold text-black">오늘의 영화에 리뷰를 남겨주세요!</h2>
            </div>
            <span className="text-sm text-black">2024년 9월 5일</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 왼쪽 - 오늘의 영화 정보 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-36 h-52 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => onMovieClick(todayMovie)}
                >
                  <ImageWithFallback
                    src={todayMovie.poster}
                    alt={todayMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">{todayMovie.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">감독</span>
                    <span className="text-black">{todayMovie.director}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">장르</span>
                    <Badge variant="outline" className="border-gray-400 text-black">{todayMovie.genre}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">개봉</span>
                    <span className="text-black">{todayMovie.year}년</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">러닝타임</span>
                    <span className="text-black">{todayMovie.runtime}분</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {renderStars(Math.round(todayMovie.rating), 'lg')}
                    </div>
                    <span className="text-2xl font-bold text-black">{todayMovie.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    오늘의 추천 영화 • 평균 평점
                  </p>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {todayMovie.description}
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => onMovieClick(todayMovie)}
                  className="w-full bg-white border-gray-400 text-black hover:bg-gray-100 hover:text-black"
                >
                  상세 정보 보기
                </Button>
              </div>
            </div>

            {/* 오른쪽 - 오늘의 영화 리뷰 작성 */}
            <div>
              <h3 className="text-xl font-bold text-black mb-6">오늘의 영화 리뷰 작성</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-black mb-3">평점</label>
                  <div className="flex gap-1">
                    {renderRatingStars(userRating, setUserRating)}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">{userRating}점을 주셨네요!</p>
                  )}
                </div>
                
                <div>
                  <label className="block font-medium text-black mb-3">내용</label>
                  <Textarea
                    placeholder="'우는 남자'에 대한 솔직한 리뷰를 작성해주세요. 다른 분들에게 도움이 되는 후기를 남겨주시면 감사하겠습니다."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={8}
                    className="resize-none bg-white border-gray-300 text-black placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {newReview.length}/500자
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="spoiler" 
                    className="rounded border-gray-400 bg-white"
                  />
                  <label htmlFor="spoiler" className="text-sm text-gray-700">
                    스포일러가 포함되어 있습니다
                  </label>
                </div>
                
                <Button 
                  onClick={handleSubmitReview}
                  disabled={!newReview.trim() || userRating === 0}
                  className="w-full bg-red-600 hover:bg-red-700 py-3"
                >
                  오늘의 영화 리뷰 등록하기
                </Button>
                
                <div className="bg-orange-100 rounded-lg p-4 border border-orange-300">
                  <p className="text-sm text-orange-700">
                    💝 오늘의 영화 리뷰 작성시 1,000포인트를 드립니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 헤더 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-black mb-2">최근 영화 리뷰 ({mockReviews.length})</h3>
          <p className="text-gray-600">다른 관람객들이 남긴 다양한 영화 리뷰를 확인해보세요</p>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                {/* 영화 포스터 */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md">
                    <ImageWithFallback
                      src={review.moviePoster}
                      alt={review.movieTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <Avatar className="w-12 h-12 flex-shrink-0">
                  <ImageWithFallback
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-black">{review.userName}</span>
                      {review.isVerified && (
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                          ✓ 인증된 리뷰어
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-black hover:bg-gray-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* 영화 제목 */}
                  <div className="mb-3">
                    <Badge variant="outline" className="bg-white text-black border-gray-400">
                      {review.movieTitle}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-yellow-500 font-medium">{review.rating}.0</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-800 mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
                      <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
                      <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{review.replies}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8 bg-white border-gray-400 text-black hover:bg-gray-100 hover:text-black">
            리뷰 더보기
          </Button>
        </div>
      </div>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}