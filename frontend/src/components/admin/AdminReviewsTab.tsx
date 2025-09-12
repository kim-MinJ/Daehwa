import { Review } from "./types";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";



interface AdminReviewsTabProps {
  reviews: Review[];
  searchQuery: string;
  users: { id: string; username: string }[];
  movies?: { id: number; title: string }[]; // optional
  setEditingReview: Dispatch<SetStateAction<Review | null>>;
  updateReviewStatus: (reviewIdx: number, isBlind: 0 | 1) => void;
}


export default function AdminReviewsTab({
  reviews,
  users,
  movies,
  searchQuery,
  setEditingReview,
  updateReviewStatus,
}: AdminReviewsTabProps) {
  const filteredReviews = reviews.filter(r => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      r.reviewIdx.toString().includes(query) ||
      r.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">리뷰 idx</th>
            <th className="p-2 text-left">영화</th>
            <th className="p-2 text-left">유저ID</th>
            <th className="p-2 text-left">내용</th>
            <th className="p-2 text-left">평점</th>
            <th className="p-2 text-left">생성일</th>
            <th className="p-2 text-left">수정일</th>
            <th className="p-2 text-left">상태</th>
            <th className="p-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => {
              const user = users.find(u => u.id === review.userId);
              const movie = movies?.find(m => m.id === review.movieIdx);

              return (
                <tr
                  key={review.reviewIdx}
                  className={`border-b ${
                    review.isBlind === 1 ? "bg-gray-200" : ""
                  }`}
                >
                  <td className="p-2">{review.reviewIdx}</td>
                  <td className="p-2">{movie?.title || review.movieIdx}</td>
                  <td className="p-2">{user?.username || review.userId}</td>
                  <td className="p-2">{review.content}</td>
                  <td className="p-2">{review.rating}</td>
                  <td className="p-2">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(review.updateAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    {review.isBlind === 0 ? (
                      <span className="text-green-600 font-medium">공개</span>
                    ) : (
                      <span className="text-red-600 font-medium">블라인드</span>
                    )}
                  </td>
                  <td className="p-2">
                    <Button
                      className="!bg-black !text-white px-3 py-1 rounded hover:!bg-gray-800"
                      onClick={() => setEditingReview(review)}
                    >
                      편집
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500">
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
