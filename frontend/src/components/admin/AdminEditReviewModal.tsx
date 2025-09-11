// src/components/admin/AdminEditReviewModal.tsx
import React, { useState, useEffect } from "react"; // React 전체 import
import { Review } from "./types";
import "/src/assets/AdminEditUserModal.css";

interface Props {
  editingReview: Review | null;
  setEditingReview: React.Dispatch<React.SetStateAction<Review | null>>;
  updateReviewStatus: (reviewIdx: number, isBlind: 0 | 1) => Promise<void>;
  deleteReview: (reviewIdx: number) => Promise<void>;
}

export default function AdminEditReviewModal({
  editingReview,
  setEditingReview,
  updateReviewStatus,
  deleteReview,
}: Props) {
  const [isBlind, setIsBlind] = React.useState<0 | 1>(0);

  React.useEffect(() => {
    if (editingReview) setIsBlind(editingReview.isBlind as 0 | 1);
  }, [editingReview]);

  const handleSave = async () => {
    if (editingReview) {
      await updateReviewStatus(editingReview.reviewIdx, isBlind);
      setEditingReview(null);
    }
  };

  const handleDelete = async () => {
    if (editingReview && confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      await deleteReview(editingReview.reviewIdx);
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
            <select
              value={isBlind}
              onChange={(e) => setIsBlind(Number(e.target.value) as 0 | 1)}
            >
              <option value={0}>공개</option>
              <option value={1}>블라인드</option>
            </select>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="modal-buttons" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
            className="modal-save-btn"
            onClick={handleSave}
            style={{
              padding: "6px 16px",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            저장
          </button>

          <button
  className="modal-delete-btn"
  onClick={handleDelete}
  style={{
    padding: "6px 16px",
    backgroundColor: "#fff",
    color: "#000", // 텍스트는 검정 유지
    border: "2px solid #888",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 3s ease", // 색상만 전환
  }}
  onMouseEnter={(e) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffdddd"; // 연한 빨강
  }}
  onMouseLeave={(e) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fff";
  }}
>
  삭제
</button>

          <button
            className="modal-cancel-btn"
            onClick={() => setEditingReview(null)}
            style={{
              padding: "6px 16px",
              backgroundColor: "#ccc",
              color: "#000",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}