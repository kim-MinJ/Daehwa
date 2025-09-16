import { Star, Edit3, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { Page } from './types';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

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
  createdAt: string;
  updateAt: string;
  isBlind: number;
  movieTitle: string;
  moviePoster: string;
}

interface Comment {
  commentIdx: number;
  userId: string;
  content: string;
  createdAt: string;
}

const CommentAccordion = ({
  reviewId,
  isOpen,
  onToggle,
}: {
  reviewId: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`/api/review/${reviewId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setComments(res.data))
        .catch(console.error);
    }
  }, [isOpen, reviewId]);

  const handleSubmitComment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }
    if (!newComment.trim()) return;

    axios
      .post(
        `/api/review/${reviewId}/comments`,
        {
          content: newComment,
          createdAt: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setComments((prev) => [res.data, ...prev]);
        setNewComment('');
      })
      .catch(console.error);
  };

  return (
    <div className="mt-2 border-t border-gray-300 pt-3">
      <button onClick={onToggle} className="font-medium hover:underline mb-2">
        {isOpen ? '댓글 접기 ▲' : '댓글 보기 ▼'}
      </button>

      {isOpen && (
        <div className="space-y-3">
          <div className="flex gap-2 items-start">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              placeholder="댓글을 작성하세요."
              className="flex-1 resize-none bg-gray-50 border border-gray-300 rounded-md p-2"
            />
            <Button
              onClick={handleSubmitComment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              등록
            </Button>
          </div>

          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.commentIdx} className="bg-gray-100 p-2 rounded-md">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{c.userId}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-400 text-sm">댓글이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ReviewPage({ onMovieClick, onNavigation }: any) {
  const [todayMovie, setTodayMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBlind, setIsBlind] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newReview, setNewReview] = useState('');

  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [showSpoilers, setShowSpoilers] = useState<boolean>(false);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // 현재 로그인 정보 (localStorage)
  const storedUserId = localStorage.getItem('userId');
  const storedRole = localStorage.getItem('role'); // "user" | "admin"

  // 오늘의 영화 불러오기
  useEffect(() => {
    axios
      .get<Movie>('/api/movie/random', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setTodayMovie(res.data))
      .catch(console.error);
  }, []);

  // 리뷰 목록 불러오기
  useEffect(() => {
    axios
      .get('/api/review', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(async (res) => {
        const reviewsData = await Promise.all(
          res.data.map(async (review: Review) => {
            try {
              const movieRes = await axios.get(`/api/movie/${review.movieIdx}`);
              return {
                ...review,
                movieTitle: movieRes.data.title,
                moviePoster: movieRes.data.posterPath,
              };
            } catch {
              return review;
            }
          })
        );
        setReviews(reviewsData);
      })
      .catch(err => {
    if (err.response?.status === 401) {
      alert("로그인 후 리뷰 작성이 가능합니다.");
    }
  });
  }, []);

  // 리뷰 작성
  const handleSubmitReview = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      alert("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }
    if (!todayMovie) return;

    axios
      .post(
        '/api/review',
        {
          movieIdx: todayMovie.movieIdx,
          rating: userRating,
          content: newReview,
          isBlind: isBlind ? 1 : 0,
          createdAt: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        alert('리뷰 등록 완료!');
        setNewReview('');
        setUserRating(0);
        setIsBlind(false);
        setReviews((prev) => [res.data, ...prev]);
      })
      .catch(console.error);
  };

  // 리뷰 수정
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.reviewIdx);
    setEditContent(review.content);
  };

  const handleSaveReview = (reviewId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 리뷰를 수정할 수 있습니다.');
      return;
    }

    axios
      .patch(
        `/api/review/${reviewId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewIdx === reviewId ? { ...r, content: editContent } : r
          )
        );
        setEditingReviewId(null);
        setEditContent('');
      })
      .catch(console.error);
  };

  // 리뷰 삭제
  const handleDeleteReview = (reviewId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 리뷰를 삭제할 수 있습니다.');
      return;
    }
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    axios
      .delete(`/api/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setReviews((prev) => prev.filter((r) => r.reviewIdx !== reviewId));
      })
      .catch(console.error);
  };

  const STAR_COUNT = 10;
  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') =>
    Array.from({ length: STAR_COUNT }, (_, i) => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));

  const renderRatingStars = (
    rating: number,
    onRatingChange?: (rating: number) => void
  ) =>
    Array.from({ length: STAR_COUNT }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => onRatingChange && onRatingChange(i + 1)}
      />
    ));

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="reviews" onNavigation={onNavigation} />

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        {/* 리뷰 작성 */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-6">오늘의 영화 리뷰 작성</h3>
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-3">평점</label>
              <div className="flex gap-1">
                {renderRatingStars(userRating, setUserRating)}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-3">내용</label>
              <Textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={5}
                className="resize-none bg-white border-gray-300"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isBlind}
                onChange={(e) => setIsBlind(e.target.checked)}
              />
              <label>스포일러가 포함되어 있습니다</label>
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || userRating === 0}
              className="w-full bg-red-600 hover:bg-red-700 py-3"
            >
              리뷰 등록하기
            </Button>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {reviews.map((review) => {
            const isOwner = storedUserId === review.userId;
            const isAdmin = storedRole === 'admin';

            return (
              <div key={review.reviewIdx} className="bg-gray-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{review.userId}</span>

                  {(isOwner || isAdmin) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-200 rounded-full">
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditReview(review)}>
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteReview(review.reviewIdx)}
                        >
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {editingReviewId === review.reviewIdx ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full mb-4"
                  />
                ) : (
                  <p className="text-gray-800 mb-4">{review.content}</p>
                )}

                <CommentAccordion
                  reviewId={review.reviewIdx}
                  isOpen={selectedReviewId === review.reviewIdx}
                  onToggle={() =>
                    setSelectedReviewId(
                      selectedReviewId === review.reviewIdx ? null : review.reviewIdx
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}