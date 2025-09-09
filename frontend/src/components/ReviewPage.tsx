import { Star, Heart, MessageCircle, MoreHorizontal, ThumbsUp, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { Page } from './types';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component'
interface Movie {
  movieIdx: number;
  tmdbMovieId: number;
  title: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  adult: boolean;
  overview: string;
  backdropPath?: string;
  posterPath?: string;
  releaseDate: string;
}

export interface Review {
  reviewIdx: number;
  movieIdx: number;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;      // ISO 문자열
  updateAt: string;
  isBlind: number;

  // 화면 표시용 추가 속성
  movieTitle: string;
  moviePoster: string;
  userName: string;
}


interface User {
  userId: string;
  username: string;
}

interface ReviewPageProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBack: () => void;
  onNavigation: (page: Page) => void;
}



export default function ReviewPage({ onMovieClick, onNavigation }: any) {
  const [todayMovie, setTodayMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
const [reviews, setReviews] = useState<Review[]>([]);

  const [userRating, setUserRating] = useState(0);
const [newReview, setNewReview] = useState("");

useEffect(() => {
  axios.get("http://localhost:8080/api/review", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => setReviews(res.data))
  .catch(console.error);
}, []);

const handleSubmitReview = () => {
  if (!todayMovie) return;
  axios.post("http://localhost:8080/api/review", {
  movieIdx: todayMovie.movieIdx,
  rating: userRating,
  content: newReview,
  
}, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
.then(res => {
  alert("리뷰 등록 완료!");
  setNewReview('');
  setUserRating(0);

  // 리뷰 리스트 갱신
  setReviews(prev => [res.data, ...prev]);
})
.catch(console.error);
};

  useEffect(() => {
    axios.get<Movie>("http://localhost:8080/api/review/random", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
      .then(res => {
        setTodayMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("랜덤 영화 가져오기 실패", err);
        setLoading(false);
      });
  }, []);

  const STAR_COUNT = 10;
  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
  return Array.from({ length: STAR_COUNT }, (_, i) => (
    <Star 
      key={i}
      className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
};

const renderRatingStars = (rating: number, onRatingChange?: (rating: number) => void) => {
  return Array.from({ length: STAR_COUNT }, (_, i) => (
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 공통 헤더 */}
      <Header currentPage="reviews" onNavigation={onNavigation} />

      {/* 페이지 제목 */}
      <div style={{ backgroundColor: '#E4E4E4' }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-black">영화 리뷰</h1>
          </div>
          <p className="text-black/70 mt-2">영화에 대한 솔직한 리뷰를 작성하고 다른 사용자들의 후기도 확인해보세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        {/* 오늘의 영화 리뷰 섹션 */}
        <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-gray-200/30">
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
                    src={
                      todayMovie?.posterPath
                        ? `https://image.tmdb.org/t/p/w500/${todayMovie.posterPath}`
                        : "/default-poster.jpg" // 기본 이미지 경로
                    }
                    alt={todayMovie?.title || "영화 포스터"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">{todayMovie?.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">감독</span>
                    <span className="text-black">고쳐야함</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">장르</span>
                    <Badge variant="outline" className="border-gray-400 text-black">고쳐야함</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">개봉</span>
                    <span className="text-black">{todayMovie?.releaseDate ? todayMovie.releaseDate.slice(0, 4) : ""}년</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">러닝타임</span>
                    <span className="text-black">고쳐야함</span>
                  </div> */}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {renderStars(Math.round(todayMovie?.voteAverage??0), 'lg')}
                    </div>
                    <span className="text-2xl font-bold text-black">{todayMovie?.voteAverage}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    오늘의 추천 영화 • 평균 평점
                  </p>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {todayMovie?.overview}
                </p>
                
                {/* <Button 
                  variant="outline" 
                  onClick={() => onMovieClick(todayMovie)}
                  className="w-full bg-white border-gray-400 text-black hover:bg-gray-100 hover:text-black"
                >
                  상세 정보 보기
                </Button> */}
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
                    placeholder="'솔직한 리뷰를 작성해주세요. 다른 분들에게 도움이 되는 후기를 남겨주시면 감사하겠습니다."
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
                
                {/* <div className="bg-orange-100 rounded-lg p-4 border border-orange-300">
                  <p className="text-sm text-orange-700">
                    💝 오늘의 영화 리뷰 작성시 1,000포인트를 드립니다!
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 헤더 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-black mb-2">최근 영화 리뷰 ({reviews.length})</h3>
          <p className="text-gray-600">다른 관람객들이 남긴 다양한 영화 리뷰를 확인해보세요</p>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.reviewIdx} className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30">
              <div className="flex items-start gap-4">
                {/* 영화 포스터 */}
                <div className="flex-shrink-0">
          <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md">
            <LazyLoadImage
              src={
                review.moviePoster
                  ? `https://image.tmdb.org/t/p/w500/${review.moviePoster}`
                  : "/default-poster.jpg"
              }
              alt={review.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 유저 아바타 (임시 기본 이미지 사용) */}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-black">{review.userName}</span>
              {/* 필요하다면 인증 여부 필드 추가 */}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-black hover:bg-gray-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* 영화 제목 */}
          <div className="mb-3">
            <Badge
              variant="outline"
              className="bg-white text-black border-gray-400"
            >
              {review.movieTitle}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">{renderStars(review.rating)}</div>
            <span className="text-yellow-500 font-medium">{review.rating}.0</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-800 mb-4 leading-relaxed">
            {review.content}
          </p>

          <div className="flex items-center gap-6 pt-2">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
              <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">0</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
              <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">0</span>
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