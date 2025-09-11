import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface Comment {
  commentIdx: number;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface CommentModalProps {
  reviewId: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function CommentModal({ reviewId, isOpen, onClose }: CommentModalProps) {
  if (!isOpen) return null;
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get<Comment[]>(`http://192.168.0.30/api/review/${reviewId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("댓글 가져오기 실패:", err);
        alert("댓글 조회 실패: 권한이 없거나 서버 오류입니다.");
      })
      .finally(() => setLoading(false));
  }, [reviewId, token]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !token) return;

    setPosting(true);
    try {
      const res = await axios.post(
        `http://192.168.0.30/api/review/${reviewId}/comments`,
        { content: commentText }, // userId 제거, 서버에서 JWT 확인
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성 실패: 권한이 없거나 서버 오류입니다.");
    } finally {
      setPosting(false);
    }
  };

  if (!token) return null; // 로그인 안 된 유저는 모달 비활성

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">댓글</h2>

        {/* 댓글 입력 */}
        <div className="mb-4">
          <Textarea
            placeholder="댓글을 작성해주세요."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="w-full bg-gray-100 border border-gray-300 rounded p-2"
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleAddComment}
              disabled={!commentText.trim() || posting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              {posting ? "작성 중..." : "작성"}
            </Button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">댓글 불러오는 중...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.commentIdx} className="mb-3 border-b border-gray-200 pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">{comment.userName}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}