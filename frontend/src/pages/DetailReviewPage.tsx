import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { ImageWithFallback } from "../components/imageFallback/ImageWithFallback";
import axios from "axios";
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
  overview: string;
  posterPath?: string;
}

export interface Review {
  reviewIdx: number;
  movieIdx: number;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
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

/* ----------------- 댓글 아코디언 ----------------- */
function CommentAccordion({
  reviewId,
  isOpen,
  onToggle,
}: {
  reviewId: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`/api/review/${reviewId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setComments(res.data))
        .catch(console.error);
    }
  }, [isOpen, reviewId]);

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

  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `/api/review/${reviewId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-2 border-t border-gray-300 pt-3">
      <button onClick={onToggle} className="font-medium hover:underline mb-2">
        {isOpen ? "댓글 접기 ▲" : "댓글 보기 ▼"}
      </button>

      {isOpen && (
        <div className="space-y-3">
          {/* 댓글 작성 */}
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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              등록
            </Button>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.commentIdx} className="bg-gray-100 p-2 rounded-md">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{c.userId}</span>
                  <div className="flex items-center gap-2">
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.userId === localStorage.getItem("userId") && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCommentId(c.commentIdx);
                              setEditedCommentContent(c.content);
                            }}
                          >
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(c.commentIdx)}
                            className="text-red-600"
                          >
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                            await axios.put(
                              `/api/review/comments/${c.commentIdx}`,
                              { content: editedCommentContent },
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              }
                            );
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
}

/* ----------------- 메인 리뷰 페이지 ----------------- */
export default function DetailReviewPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [directors, setDirectors] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isBlind, setIsBlind] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedReviewContent, setEditedReviewContent] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const [showSpoilers, setShowSpoilers] = useState(false);

  const STAR_COUNT = 10;
  const renderStars = (rating: number) =>
    Array.from({ length: STAR_COUNT }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const renderRatingStars = (rating: number, onRatingChange: (r: number) => void) =>
    Array.from({ length: STAR_COUNT }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
        }`}
        onClick={() => onRatingChange(i + 1)}
      />
    ));

  /* 영화 정보 */
  useEffect(() => {
  axios
    .get(`/api/movie/${movieId}`)
    .then((res) => {
      setMovie(res.data);
      return Promise.all([
        axios.get(`/api/movies/${res.data.tmdbMovieId}/directors`),
        axios.get(`/api/movies/${res.data.movieIdx}/genres`),
      ]);
    })
    .then(([directorsRes, genresRes]) => {
      setDirectors(directorsRes.data);
      setGenres(genresRes.data);
    })
    .catch(console.error);

  // 리뷰 목록 + 영화 정보 합치기
  axios
    .get(`/api/reviews?movieIdx=${movieId}`)
    .then(async (res) => {
      const reviewsData = await Promise.all(
        res.data.map(async (review: Review) => {
          try {
            const movieRes = await axios.get(`/api/movie/${review.movieIdx}`);
            const directorsRes = await axios.get(`/api/movies/${movieRes.data.tmdbMovieId}/directors`);
            const genresRes = await axios.get(`/api/movies/${review.movieIdx}/genres`);
            return {
              ...review,
              movieTitle: movieRes.data.title,
              moviePoster: movieRes.data.posterPath,
              directors: directorsRes.data,
              genres: genresRes.data,
            };
          } catch (err) {
            console.error("리뷰용 영화정보 불러오기 실패", err);
            return review;
          }
        })
      );
      setReviews(reviewsData);
    })
    .catch(console.error);
}, [movieId]);
  /* 리뷰 등록 */
  const handleSubmitReview = async () => {
  try {
    const res = await axios.post(
      "/api/reviews",
      {
        movieIdx: movieId,
        rating: userRating,
        content: newReview,
        isBlind: isBlind ? 1 : 0,
        createdAt: new Date().toISOString(),
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const created = res.data;

    // 영화 정보 API 다시 호출해서 합치기
    const [movieRes, directorsRes, genresRes] = await Promise.all([
      axios.get(`/api/movie/${created.movieIdx}`),
      axios.get(`/api/movies/${movie?.tmdbMovieId}/directors`),
      axios.get(`/api/movies/${movieId}/genres`),
    ]);

    const newReviewObj: Review = {
      ...created,
      movieTitle: movieRes.data.title,
      moviePoster: movieRes.data.posterPath,
      directors: directorsRes.data,
      genres: genresRes.data,
    };

    setReviews((prev) => [newReviewObj, ...prev]);
    setNewReview("");
    setUserRating(0);
    setIsBlind(false);
  } catch (err) {
    console.error(err);
  }
};

  /* 리뷰 삭제 */
  const handleDeleteReview = async (reviewIdx: number) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/reviews/${reviewIdx}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews((prev) => prev.filter((r) => r.reviewIdx !== reviewIdx));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {movie && (
        <div className="mb-8 flex gap-6">
          <ImageWithFallback
            src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`}
            alt={movie.title}
            className="w-40 h-56 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-gray-700">{movie.overview}</p>

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold">감독:</span>
                <span>{directors.join(", ") || "정보 없음"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">장르:</span>
                {genres.length > 0 ? (
                  genres.map((g) => (
                    <Badge key={g} variant="outline" className="border-gray-400 text-black">
                      {g}
                    </Badge>
                  ))
                ) : (
                  <span>정보 없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 */}
      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">리뷰 작성</h2>
        <div className="flex gap-1 mb-3">{renderRatingStars(userRating, setUserRating)}</div>
        <Textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="솔직한 리뷰를 작성해주세요."
          rows={4}
        />
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isBlind}
            onChange={(e) => setIsBlind(e.target.checked)}
          />
          <label>스포일러가 포함되어 있습니다</label>
        </div>
        <Button className="mt-4 bg-red-600" onClick={handleSubmitReview}>
          등록
        </Button>
      </div>

      {/* 스포일러 보기 토글 */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={showSpoilers}
          onChange={(e) => setShowSpoilers(e.target.checked)}
        />
        <label>스포일러 보기</label>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {reviews.map((review) => {
          const isSpoiler = review.isBlind === 1;
          const hidden = isSpoiler && !showSpoilers;
          return (
            <div
              key={review.reviewIdx}
              className="bg-white rounded-xl p-6 shadow border border-gray-200"
            >
            <div className="flex gap-4 mb-4">
                {/* 포스터 */}
                <div className="w-16 h-20 rounded-lg overflow-hidden shadow">
                  <ImageWithFallback
                    src={`https://image.tmdb.org/t/p/w500/${review.moviePoster}`}
                    alt={review.movieTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 영화 정보 */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{review.movieTitle}</h3>
                  <p className="text-sm text-gray-600">감독: {review.directors?.join(", ") || "정보 없음"}</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {review.genres?.length ? (
                      review.genres.map((g) => (
                        <Badge key={g} variant="outline" className="border-gray-400 text-black">
                          {g}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm">장르 정보 없음</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.userId}</span>
                {review.userId === localStorage.getItem("userId") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 hover:bg-gray-200 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingReviewId(review.reviewIdx);
                          setEditedReviewContent(review.content);
                          setUserRating(review.rating);
                        }}
                      >
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteReview(review.reviewIdx)}
                        className="text-red-600"
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex gap-2 items-center mb-2">
                {renderStars(review.rating)}
                <span className="text-yellow-500">{review.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
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
      rows={3}
    />
    <div className="flex gap-2 mt-2">
      <Button
        className="bg-red-600"
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
          }
        }}
      >
        확인
      </Button>
      <Button
        variant="outline"
        onClick={() => setEditingReviewId(null)}
      >
        취소
      </Button>
    </div>
  </div>
  ) : (
    <p
      className={`text-gray-800 mb-2 ${
        hidden ? "blur-sm select-none pointer-events-none" : ""
      }`}
    >
      {review.content}
    </p>
  )}
              {/* 댓글 */}
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
  );
}