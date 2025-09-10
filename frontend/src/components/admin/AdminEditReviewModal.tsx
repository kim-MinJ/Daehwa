// src/components/admin/AdminEditReviewModal.tsx
import { useEffect, useState } from "react";
import { Review } from "./types";
import "/src/assets/AdminEditUserModal.css"; // 동일 CSS 사용 가능

interface Props {
  editingReview: Review | null;
  setEditingReview: React.Dispatch<React.SetStateAction<Review | null>>;
  updateReviewStatus: (id: number, isBlind: 0 | 1) => Promise<void>;
}

export default function AdminEditReviewModal({ editingReview, setEditingReview, updateReviewStatus }: Props) {
  const [isBlind, setIsBlind] = useState<0 | 1>(0);

  useEffect(() => {
    if (editingReview) setIsBlind(editingReview.isBlind as 0 | 1);
  }, [editingReview]);

  const handleSave = async () => {
    if (editingReview) {
      await updateReviewStatus(editingReview.reviewIdx, isBlind);
      setEditingReview(null);
    }
  };

  if (!editingReview) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop"></div>
      <div className="modal-box">
        <h2 className="modal-title">리뷰 편집</h2>
        <div className="modal-field">
          <div>
            <label>리뷰 idx</label>
            <p>{editingReview.reviewIdx}</p>
          </div>
          <div>
            <label>영화 idx</label>
            <p>{editingReview.movieIdx}</p>
          </div>
          <div>
            <label>유저ID</label>
            <p>{editingReview.userId}</p>
          </div>
          <div>
            <label>내용</label>
            <p>{editingReview.content}</p>
          </div>
          <div>
            <label>평점</label>
            <p>{editingReview.rating}</p>
          </div>
          <div>
            <label>상태</label>
            <select value={isBlind} onChange={e => setIsBlind(Number(e.target.value) as 0 | 1)}>
              <option value={0}>공개</option>
              <option value={1}>블라인드</option>
            </select>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-save-btn" onClick={handleSave}>저장</button>
          <button className="modal-cancel-btn" onClick={() => setEditingReview(null)}>취소</button>
        </div>
      </div>
    </div>
  );
}
