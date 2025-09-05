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
    isVerified: true
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
    replies: 15
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
    replies: 8
  }
];

export default function ReviewPage({ movies, onMovieClick, onBack, onNavigation }: ReviewPageProps) {
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  
  // 예시로 첫 번째 영화 사용
  const currentMovie = movies[0];

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
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage="reviews" onNavigation={onNavigation} />

      {/* 페이지 제목 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">영화 리뷰</h1>
          </div>
          <p className="text-gray-600 mt-2">영화에 대한 솔직한 리뷰를 작성하고 다른 사용자들의 후기도 확인해보세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 레이아웃 - 영화 정보와 리뷰 작성 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 왼쪽 - 영화 정보 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div 
                  className="w-36 h-52 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => onMovieClick(currentMovie)}
                >
                  <ImageWithFallback
                    src={currentMovie.poster}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{currentMovie.title}</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-12">감독</span>
                    <span className="text-gray-700">{currentMovie.director}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-12">장르</span>
                    <Badge variant="outline">{currentMovie.genre}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-12">개봉</span>
                    <span className="text-gray-700">{currentMovie.year}년</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-12">러닝타임</span>
                    <span className="text-gray-700">{currentMovie.runtime}분</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {renderStars(Math.round(currentMovie.rating), 'lg')}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{currentMovie.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    총 {mockReviews.length}개의 리뷰 • 평균 평점
                  </p>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {currentMovie.description}
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => onMovieClick(currentMovie)}
                  className="w-full"
                >
                  상세 정보 보기
                </Button>
              </div>
            </div>

            {/* 오른쪽 - 리뷰 작성 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">리뷰 작성</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-gray-900 mb-3">평점</label>
                  <div className="flex gap-1">
                    {renderRatingStars(userRating, setUserRating)}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-500 mt-2">{userRating}점을 주셨네요!</p>
                  )}
                </div>
                
                <div>
                  <label className="block font-medium text-gray-900 mb-3">내용</label>
                  <Textarea
                    placeholder="영화에 대한 솔직한 리뷰를 작성해주세요. 다른 분들에게 도움이 되는 후기를 남겨주시면 감사하겠습니다."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {newReview.length}/500자
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="spoiler" 
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="spoiler" className="text-sm text-gray-700">
                    스포일러가 포함되어 있습니다
                  </label>
                </div>
                
                <Button 
                  onClick={handleSubmitReview}
                  disabled={!newReview.trim() || userRating === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                >
                  리뷰 등록하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 헤더 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">리뷰 ({mockReviews.length})</h3>
          <p className="text-gray-600">다른 관람객들의 솔직한 후기를 확인해보세요</p>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start gap-4">
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
                      <span className="font-semibold text-gray-900">{review.userName}</span>
                      {review.isVerified && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                          ✓ 인증된 리뷰어
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-yellow-600 font-medium">{review.rating}.0</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
                      <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
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
          <Button variant="outline" className="px-8">
            리뷰 더보기
          </Button>
        </div>
      </div>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}