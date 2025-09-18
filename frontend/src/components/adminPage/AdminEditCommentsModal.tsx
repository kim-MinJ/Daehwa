import React, { useState, useEffect } from "react";
import { Comment } from "./types";

interface Props {
  editingComment: Comment | null;
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  updateCommentContent: (commentIdx: number, content: string) => Promise<void>;
  deleteComment: (commentIdx: number) => Promise<void>;
}

export default function AdminEditCommentModal({
  editingComment,
  setEditingComment,
  updateCommentContent,
  deleteComment,
}: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingComment) setContent(editingComment.content);
  }, [editingComment]);

  const handleSave = async () => {
  if (editingComment) {
    try {
      await updateCommentContent(editingComment.commentIdx, content);
      alert("댓글이 성공적으로 저장되었습니다."); // ✅ 알림 추가
      setEditingComment(null);
    } catch (err) {
      console.error(err);
      alert("댓글 저장에 실패했습니다."); // 오류 처리
    }
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              rows={4}
            />
          </div>
        </div>

        <div className="modal-buttons" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
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
