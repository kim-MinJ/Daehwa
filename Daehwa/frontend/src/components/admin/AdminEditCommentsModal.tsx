// src/components/admin/AdminEditCommentModal.tsx
import React, { useState, useEffect } from "react";
import { Comment } from "./types";

interface Props {
  editingComment: Comment | null;
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  updateCommentStatus: (commentIdx: number, isBlind: 0 | 1) => Promise<void>;
  deleteComment: (commentIdx: number) => Promise<void>;
}

export default function AdminEditCommentModal({
  editingComment,
  setEditingComment,
  updateCommentStatus,
  deleteComment,
}: Props) {
  const [isBlind, setIsBlind] = useState<0 | 1>(0);

  useEffect(() => {
    if (editingComment) setIsBlind(editingComment.isBlind as 0 | 1);
  }, [editingComment]);

  const handleSave = async () => {
    if (editingComment) {
      await updateCommentStatus(editingComment.commentIdx, isBlind);
      setEditingComment(null);
    }
  };

  const handleDelete = async () => {
    if (editingComment && confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      await deleteComment(editingComment.commentIdx);
      setEditingComment(null);
    }
  };

  if (!editingComment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop"></div>
      <div className="modal-box">
        <h2 className="modal-title">댓글 편집</h2>
        <div className="modal-field">
          <div>
            <label>댓글 idx</label>
            <p>{editingComment.commentIdx}</p>
          </div>
          <div>
            <label>유저ID</label>
            <p>{editingComment.userId}</p>
          </div>
          <div>
            <label>내용</label>
            <p>{editingComment.content}</p>
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
              color: "#000",
              border: "2px solid #888",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffdddd")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            삭제
          </button>

          <button
            className="modal-cancel-btn"
            onClick={() => setEditingComment(null)}
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
