import React from "react";
import { Comment } from "./types";
import { Button } from "../ui/button";

interface AdminCommentsTabProps {
  comments: Comment[];
  searchQuery: string;
  users: { id: string; username: string }[];
  setEditingComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  updateCommentContent: (commentIdx: number, content: string) => Promise<void>; // 수정됨
}

export default function AdminCommentsTab({
  comments,
  searchQuery,
  users,
  setEditingComment,
  updateCommentContent,
}: AdminCommentsTabProps) {
  const filteredComments = comments.filter(c => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      c.commentIdx.toString().includes(query) ||
      c.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">댓글 idx</th>
            <th className="p-2 text-left">유저ID</th>
            <th className="p-2 text-left">내용</th>
            <th className="p-2 text-left">생성일</th>
            <th className="p-2 text-left">수정일</th>
            <th className="p-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.length > 0 ? (
            filteredComments.map(comment => {
              const user = users.find(u => u.id === comment.userId);
              return (
                <tr key={comment.commentIdx} className="border-b">
                  <td className="p-2">{comment.commentIdx}</td>
                  <td className="p-2">{comment.userId}</td>
                  <td className="p-2">{comment.content}</td>
                  <td className="p-2">{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(comment.updateAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <Button
                      className="!bg-black !text-white px-3 py-1 rounded hover:!bg-gray-800"
                      onClick={() => setEditingComment(comment)}
                    >
                      편집
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
