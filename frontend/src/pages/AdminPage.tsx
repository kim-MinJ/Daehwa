// src/pages/AdminPage.tsx
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { User, Review } from "../components/admin/types";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminReviewsTab from "../components/admin/AdminReviewsTab";
import AdminEditUserModal from "../components/admin/AdminEditUserModal";
import AdminEditReviewModal from "../components/admin/AdminEditReviewModal";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import { api } from "../lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import axios from "axios";

export default function AdminPage() {
  const { userInfo, loading, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // 관리자 접근 제한
  useEffect(() => {
    if (!loading && (!userInfo || userInfo.role !== "admin")) {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/");
    }
  }, [userInfo, loading, navigate]);

  // Users API 호출
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await api.get("/users", { headers: { Authorization: `Bearer ${token}` } });
        const formattedUsers: User[] = res.data.map((u: any) => ({
          id: u.userId,
          username: u.username,
          status: u.status === 0 ? "active" : u.status === 1 ? "inactive" : "banned",
          regDate:
            u.regDate && !isNaN(Date.parse(u.regDate))
              ? new Date(u.regDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "-",
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.error(err);
        alert("회원 목록을 가져오는 데 실패했습니다.");
      }
    })();
  }, [token]);

  // Reviews API 호출
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await api.get("/reviews", { headers: { Authorization: `Bearer ${token}` } });
        const formattedReviews: Review[] = res.data.map((r: any) => ({
          reviewIdx: r.reviewIdx,
          movieIdx: r.movieIdx,
          userId: r.userId,
          content: r.content,
          rating: r.rating,
          createdAt: r.createdAt,
          updateAt: r.updateAt,
          isBlind: r.isBlind,
        }));
        setReviews(formattedReviews);
      } catch (err) {
        console.error(err);
        alert("리뷰 목록을 가져오는 데 실패했습니다.");
      }
    })();
  }, [token]);

  // User 상태 변경
  const updateUserStatus = async (id: string, status: User["status"]) => {
    if (!token) return;
    try {
      const statusNum = status === "active" ? 0 : status === "inactive" ? 1 : 2;
      await api.patch(`/users/${id}/status`, { status: statusNum }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    } catch (err) {
      console.error(err);
      alert("상태 변경 실패");
    }
  };

  // Review 상태 변경 (블라인드)
  const updateReviewStatus = async (reviewIdx: number, isBlind: 0 | 1) => {
  if (!token) return;
  try {
    await api.patch(
      `/reviews/${reviewIdx}/status`, // ← api의 baseURL이 이미 /api 포함
      { isBlind },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReviews(prev =>
      prev.map(r => (r.reviewIdx === reviewIdx ? { ...r, isBlind } : r))
    );
  } catch (err) {
    console.error(err);
    alert("리뷰 상태 변경 실패");
  }
};

  // Review 삭제
  const deleteReview = async (reviewIdx: number) => {
    if (!token) return;
    try {
      await api.delete(`/reviews/${reviewIdx}`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(prev => prev.filter(r => r.reviewIdx !== reviewIdx));
    } catch (err) {
      console.error(err);
      alert("리뷰 삭제 실패");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 관리자 소개 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">
            {userInfo?.username}님, MovieSSG 사이트 관리 시스템에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="p-6 shadow-md rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition"
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h2 className="text-lg font-medium text-gray-700">총 회원 수</h2>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </Card>

          <Card
            className="p-6 shadow-md rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition"
            onClick={() => setActiveTab("reviews")}
          >
            <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
            <h2 className="text-lg font-medium text-gray-700">총 댓글 수</h2>
            <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
          </Card>
        </div>

        {/* 검색바 */}
        <AdminSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="reviews">댓글 관리</TabsTrigger>
            <TabsTrigger value="comments">댓글 관리(예비)</TabsTrigger>
            <TabsTrigger value="votes">투표 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab
              users={users}
              searchQuery={searchQuery}
              setEditingUser={setEditingUser}
              updateUserStatus={updateUserStatus}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviewsTab
              reviews={reviews}
              searchQuery={searchQuery}
              setEditingReview={setEditingReview}
              users={users}
              updateReviewStatus={updateReviewStatus}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 모달 */}
      <AdminEditUserModal
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        updateUserStatus={updateUserStatus}
      />
      <AdminEditReviewModal
        editingReview={editingReview}
        setEditingReview={setEditingReview}
        updateReviewStatus={updateReviewStatus}
        deleteReview={deleteReview}
      />

    </div>
  );
}
