// src/components/admin/AdminEditReviewModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Review } from './types';

interface AdminEditReviewModalProps {
  editingReview: Review | null;
  setEditingReview: (review: Review | null) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'rejected') => void;
}

export default function AdminEditReviewModal({
  editingReview,
  setEditingReview,
  updateReviewStatus,
}: AdminEditReviewModalProps) {
  if (!editingReview) return null;

  return (
    <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 상태 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>상태 변경</Label>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={editingReview.status === 'approved' ? 'default' : 'outline'}
                onClick={() => updateReviewStatus(editingReview.id, 'approved')}
              >
                승인
              </Button>
              <Button
                size="sm"
                variant={editingReview.status === 'pending' ? 'default' : 'outline'}
                onClick={() => updateReviewStatus(editingReview.id, 'pending')}
              >
                대기
              </Button>
              <Button
                size="sm"
                variant={editingReview.status === 'rejected' ? 'destructive' : 'outline'}
                onClick={() => updateReviewStatus(editingReview.id, 'rejected')}
              >
                거부
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
