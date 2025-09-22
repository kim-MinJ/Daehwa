import { Star, Edit3, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { ImageWithFallback } from '../components/imageFallback/ImageWithFallback';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
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
  directors?: string[];
  genres?: string[];
}

interface Comment {
  commentIdx: number;
  userId: string;
  content: string;
  createdAt: string;
}

function CommentMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <DropdownMenuItem
            onClick={() => {
              onEdit();
            }}
            className="cursor-pointer"
          >
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDelete();
            }}
            className="cursor-pointer text-red-600"
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
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


  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.commentIdx);
   setEditedCommentContent(comment.content);
  // 수정 모드로 전환 후 PUT 요청 처리하면 됨
};

const handleDeleteComment = async (commentIdx: number) => {
  if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`/api/review/comments/${commentIdx}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setComments((prev) => prev.filter((c) => c.commentIdx !== commentIdx));
  } catch (err) {
    console.error(err);
    alert("삭제 실패");
  }
};
  const handleSubmitComment = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
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
              className="bg-red-600 hover:bg-gray-700 text-white"
            >
              등록
            </Button>
          </div>

          <div className="space-y-2">
            {comments.map((c) => (
  <div key={c.commentIdx} className="bg-gray-100 p-2 rounded-md">
    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
      <span>{c.userId}</span>
      <div className="flex items-center gap-2">
        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
        
        {/* 로그인 유저와 동일할 때만 수정/삭제 메뉴 */}
        {c.userId === localStorage.getItem("userId") && (
           <CommentMenu
              onEdit={() => handleEditComment(c)}
              onDelete={() => handleDeleteComment(c.commentIdx)}
            />
        )}
      </div>
    </div>
    {editingCommentId === c.commentIdx ? (
        <div>
          <Textarea
            value={editedCommentContent}
            onChange={(e) => setEditedCommentContent(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <div className="flex gap-2 mt-2">
            <Button
              className="bg-red-600 text-white"
              onClick={async () => {
                try {
                  await axios.put(`/api/review/comments/${c.commentIdx}`, {
                    content: editedCommentContent,
                  }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  });
                  setComments((prev) =>
                    prev.map((comment) =>
                      comment.commentIdx === c.commentIdx
                        ? { ...comment, content: editedCommentContent }
                        : comment
                    )
                  );
                  setEditingCommentId(null);
                } catch (err) {
                  console.error(err);
                  alert("댓글 수정 실패");
                }
              }}
            >
              확인
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingCommentId(null);
                setEditedCommentContent("");
              }}
            >
              취소
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800">{c.content}</p>
      )}
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

export default function ReviewPage() {
  const navigate = useNavigate();
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedReviewContent, setEditedReviewContent] = useState("");
  const [todayMovie, setTodayMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBlind, setIsBlind] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [showSpoilers, setShowSpoilers] = useState<boolean>(false);
  const [directors, setDirectors] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

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

  useEffect(() => {
    axios
      .get('/api/reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(async (res) => {
        const reviewsData = await Promise.all(
          res.data.map(async (review: Review) => {
            try {
              const movieRes = await axios.get(`/api/movie/${review.movieIdx}`);
              const directorsRes = await axios.get(
                `/api/movies/${movieRes.data.tmdbMovieId}/directors`
              );
              const genresRes = await axios.get(`/api/movies/${review.movieIdx}/genres`);
              return {
                ...review,
                movieTitle: movieRes.data.title,
                moviePoster: movieRes.data.posterPath,
                directors: directorsRes.data,
                genres: genresRes.data,
              };
            } catch (err) {
              console.error('영화 정보 불러오기 실패:', err);
              return review;
            }
          })
        );
        setReviews(reviewsData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get<Movie>('/api/movie/random', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        setTodayMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('랜덤 영화 가져오기 실패', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  if (!todayMovie) return;

  // 감독 정보
  axios.get<string[]>(`/api/movies/${todayMovie.tmdbMovieId}/directors`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => {
    // 중복 제거
    const uniqueDirectors = Array.from(new Set(res.data));
    setDirectors(uniqueDirectors);
  })
  .catch(console.error);

  // 장르 정보
  axios.get<string[]>(`/api/movies/${todayMovie.movieIdx}/genres`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => setGenres(res.data || []))
  .catch(console.error);

}, [todayMovie]);

const handleSubmitReview = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }
  if (!todayMovie) return;

  try {
    // 1. 리뷰 등록 요청
    const postRes = await axios.post(
      "/api/reviews",
      {
        movieIdx: todayMovie.movieIdx,
        rating: userRating,
        content: newReview,
        isBlind: isBlind ? 1 : 0,
        createdAt: new Date().toISOString(),
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const createdReview = postRes.data; // 서버에서 내려준 reviewIdx 포함됨

    // 2. DB 기준 최신 리뷰 + 감독 + 장르 데이터 다시 조회
    const [reviewRes, directorRes, genreRes] = await Promise.all([
      axios.get(`/api/reviews/${createdReview.reviewIdx}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get(`/api/movies/${todayMovie.tmdbMovieId}/directors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get(`/api/movies/${todayMovie.movieIdx}/genres`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    ]);

    // 3. 프론트에서 사용할 Review 객체 조립
    const newReviewObj: Review = {
      ...reviewRes.data,
      movieTitle: todayMovie.title,
      moviePoster: todayMovie.posterPath,
      directors: directorRes.data,
      genres: genreRes.data,
    };

    // 4. 기존 리뷰 목록 앞에 새 리뷰 추가
    setReviews((prev) => [newReviewObj, ...prev]);

    // 5. 입력 초기화
    setNewReview("");
    setUserRating(0);
    setIsBlind(false);

    alert("리뷰 등록 완료!");
  } catch (err) {
    console.error("[handleSubmitReview]", err);
    alert("리뷰 등록 실패");
  }
};
const handleEditReview = (review: Review) => {
  setNewReview(review.content);
  setUserRating(review.rating);
  setSelectedReviewId(Number(review.reviewIdx));
  setEditedReviewContent(review.content);
  setEditingReviewId(review.reviewIdx);
  // 수정 모드용 state를 따로 두고 patch 요청하면 됨
};

const handleDeleteReview = async (reviewIdx: number) => {
  if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`/api/reviews/${reviewIdx}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setReviews((prev) => prev.filter((r) => r.reviewIdx !== reviewIdx));
  } catch (err) {
    console.error(err);
    alert("삭제 실패");
  }
};


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ backgroundColor: '#E4E4E4' }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-black">영화 리뷰</h1>
          </div>
          <p className="text-black/70 mt-2">
            영화에 대한 솔직한 리뷰를 작성하고 다른 사용자들의 후기도 확인해보세요
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        {/* 오늘의 영화 */}
        {todayMovie && (
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-gray-200/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-red-600 text-white hover:bg-red-600 text-sm px-4 py-2">
                  오늘의 영화
                </Badge>
                <h2 className="text-2xl font-bold text-black">
                  오늘의 영화에 리뷰를 남겨주세요!
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-36 h-52 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => navigate(`/movie/${todayMovie.movieIdx}`)}
                  >
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w500/${todayMovie.posterPath}`}
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
                      <span className="text-black">{directors.join(", ") || "정보 없음"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-12">장르</span>
                      {genres.length > 0 
                        ? genres.map((g) => <Badge key={g} variant="outline" className="border-gray-400 text-black">{g}</Badge>) 
                        : <span className="text-black">정보 없음</span>
                      }
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">{renderStars(Math.round(todayMovie.voteAverage), 'lg')}</div>
                      <span className="text-2xl font-bold text-black">
                        {todayMovie.voteAverage.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">오늘의 추천 영화 • 평균 평점</p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{todayMovie.overview}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-6">오늘의 영화 리뷰 작성</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium text-black mb-3">평점</label>
                    <div className="flex gap-1">{renderRatingStars(userRating, setUserRating)}</div>
                    {userRating > 0 && <p className="text-sm text-gray-600 mt-2">{userRating}점을 주셨네요!</p>}
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
                    <p className="text-xs text-gray-600 mt-2">{newReview.length}/500자</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="spoiler"
                      checked={isBlind}
                      onChange={(e) => setIsBlind(e.target.checked)}
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 리뷰 목록 */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="showSpoilers"
            checked={showSpoilers}
            onChange={(e) => setShowSpoilers(e.target.checked)}
            className="rounded border-gray-400 bg-white"
          />
          <label htmlFor="showSpoilers" className="text-sm text-gray-700">
            스포일러 보기
          </label>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-black mb-2">최근 영화 리뷰 ({reviews.length})</h3>
          <p className="text-gray-600">다른 관람객들이 남긴 다양한 영화 리뷰를 확인해보세요</p>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => {
            const isOpen = selectedReviewId === review.reviewIdx;
            console.log("review.userId:", review.userId, "local userId:", localStorage.getItem("userId"));
            return (
              <div
                key={review.reviewIdx}
                className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={`https://image.tmdb.org/t/p/w500/${review.moviePoster}`}
                        alt={review.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-black">{review.userId}</span>
                      </div>
                      {review.userId === localStorage.getItem("userId") && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-8 w-8 text-gray-600 hover:text-black hover:bg-gray-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditReview(review)}>
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteReview(review.reviewIdx)}>
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    </div>

                    <div className="mb-3">
                      <Badge variant="outline" className="bg-white text-black border-gray-400">
                        {review.movieTitle}
                      </Badge>
                    </div>

                    {/* 감독과 장르 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-12">감독</span>
                        <span className="text-black">{review.directors?.join(', ') || '정보 없음'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-12">장르</span>
                        {review.genres?.length ? (
                          review.genres.map((g) => (
                            <Badge key={g} variant="outline" className="border-gray-400 text-black">
                              {g}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-black">정보 없음</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                      <span className="text-yellow-500 font-medium">
                        {review.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>

                    {editingReviewId === review.reviewIdx ? (
  <div className="space-y-3">
    {/* ⭐ 별점 수정 */}
    <div className="flex items-center gap-2">
      {renderRatingStars(userRating, setUserRating)}
      <span className="ml-2 text-sm text-gray-600">{userRating} 점</span>
    </div>

    {/* 리뷰 내용 수정 */}
    <Textarea
      value={editedReviewContent}
      onChange={(e) => setEditedReviewContent(e.target.value)}
      rows={4}
      className="w-full border border-gray-300 rounded-md p-2"
    />

    <div className="flex gap-2 mt-2">
      <Button
        className="bg-red-600 text-white"
        onClick={async () => {
          try {
            await axios.patch(
              `/api/reviews/${review.reviewIdx}`,
              {
                content: editedReviewContent,
                rating: userRating,                // ✅ 수정한 별점 반영
                updateAt: new Date().toISOString() // ✅ 수정 시점 저장
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setReviews((prev) =>
              prev.map((r) =>
                r.reviewIdx === review.reviewIdx
                  ? { ...r, content: editedReviewContent, rating: userRating }
                  : r
              )
            );
            setEditingReviewId(null);
          } catch (err) {
            console.error(err);
            alert("리뷰 수정 실패");
          }
        }}
      >
        확인
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setEditingReviewId(null);
          setEditedReviewContent("");
          setUserRating(0);
        }}
      >
        취소
      </Button>
    </div>
  </div>
    ) : (
  <>
    {review.isBlind === 1 && !showSpoilers ? (
      <p className="text-gray-800 mb-4 blur-sm select-none">
        {review.content}
      </p>
    ) : (
      <p className="text-gray-800 mb-4">{review.content}</p>
    )}
  </>
)}
                    <CommentAccordion
                      reviewId={review.reviewIdx}
                      isOpen={isOpen}
                      onToggle={() => setSelectedReviewId(isOpen ? null : review.reviewIdx)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
