// src/components/admin/AdminReviewsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Review } from './types';

interface AdminReviewsTabProps {
  reviews: Review[];
  searchQuery: string;
  setEditingReview: (review: Review | null) => void;
  deleteReview: (id: string) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'rejected') => void;
}

export default function AdminReviewsTab({
  reviews,
  searchQuery,
  setEditingReview,
  deleteReview,
  updateReviewStatus,
}: AdminReviewsTabProps) {
  const filterReviews = () =>
    reviews.filter(r =>
      r.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const colorMap = { approved: 'bg-green-600', pending: 'bg-yellow-600', rejected: 'bg-red-600' };
    return <Badge className={`${colorMap[status as keyof typeof colorMap]} text-white`}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">영화</th>
                <th className="text-left p-4">작성자</th>
                <th className="text-left p-4">평점</th>
                <th className="text-left p-4">내용</th>
                <th className="text-left p-4">작성일</th>
                <th className="text-left p-4">상태</th>
                <th className="text-left p-4">관리</th>
              </tr>
            </thead>
            <tbody>
              {filterReviews().map(review => (
                <tr key={review.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{review.movieTitle}</td>
                  <td className="p-4">{review.username}</td>
                  <td className="p-4">⭐ {review.rating}</td>
                  <td className="p-4 max-w-xs truncate">{review.content}</td>
                  <td className="p-4">{review.date}</td>
                  <td className="p-4">{getStatusBadge(review.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingReview(review)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteReview(review.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
