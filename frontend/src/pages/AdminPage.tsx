// src/pages/AdminPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { User, Review, Movie } from "../components/admin/types";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminReviewsTab from "../components/admin/AdminReviewsTab";
import AdminEditUserModal from "../components/admin/AdminEditUserModal";
import AdminEditReviewModal from "../components/admin/AdminEditReviewModal";
import AdminSearchBar from "../components/admin/AdminSearchBar";
import { api } from "../lib/api";

export function AdminPage() {
  const { userInfo, loading, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // --- admin 접근 제한 ---
  useEffect(() => {
    if (!loading && (!userInfo || userInfo.role !== "admin")) {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/");
    }
  }, [userInfo, loading, navigate]);

  // --- 더미 데이터용 ---
  useEffect(() => {
    // 유저 더미
    // 영화 더미
    setMovies([
      { id: 1, title: "인터스텔라" },
      { id: 2, title: "인셉션" },
    ]);

    // 리뷰 더미
    setReviews([
      {
        reviewIdx: 101,
        movieIdx: 1,
        userId: "user1",
        content: "정말 재미있었어요!",
        rating: 9,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        isBlind: 0,
      },
      {
        reviewIdx: 102,
        movieIdx: 2,
        userId: "user2",
        content: "좀 어려웠지만 볼만함",
        rating: 8,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        isBlind: 1,
      },
    ]);
  }, []);

  // --- Users API 호출 ---
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
      } catch (err: any) {
        console.error(err);
        alert("회원 목록을 가져오는 데 실패했습니다.");
      }
    })();
  }, [token]);

  // // --- Movies API 호출 ---
  // useEffect(() => {
  //   if (!token) return;
  //   (async () => {
  //     try {
  //       const res = await api.get("/movies", { headers: { Authorization: `Bearer ${token}` } });
  //       const formattedMovies: Movie[] = res.data.map((m: any) => ({
  //         id: m.movieIdx || m.id,
  //         title: m.title,
  //       }));
  //       setMovies(formattedMovies);
  //     } catch (err) {
  //       console.error(err);
  //       alert("영화 목록을 가져오는 데 실패했습니다.");
  //     }
  //   })();
  // }, [token]);

  // // --- Reviews API 호출 ---
  // useEffect(() => {
  //   if (!token) return;
  //   (async () => {
  //     try {
  //       const res = await api.get("/reviews", { headers: { Authorization: `Bearer ${token}` } });
  //       const formattedReviews: Review[] = res.data.map((r: any) => ({
  //         reviewIdx: r.reviewIdx,
  //         movieIdx: r.movieIdx,
  //         userId: r.userId,
  //         content: r.content,
  //         rating: r.rating,
  //         createdAt: r.createdAt,
  //         updateAt: r.updateAt,
  //         isBlind: r.isBlind
  //       }));
  //       setReviews(formattedReviews);
  //     } catch (err) {
  //       console.error(err);
  //       alert("리뷰 목록을 가져오는 데 실패했습니다.");
  //     }
  //   })();
  // }, [token]);

  const fetchReviews = async () => {
    if (!token) return;
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
        isBlind: r.isBlind
      }));
      setReviews(formattedReviews);
    } catch (err) {
      console.error(err);
      alert("리뷰 목록을 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  // --- User 상태 변경 ---
  const updateUserStatus = async (id: string, status: User["status"]) => {
    if (!token) return;
    try {
      const statusNum = status === "active" ? 0 : status === "inactive" ? 1 : 2;
      await api.patch(`/users/${id}/status`, { status: statusNum }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    } catch (err: any) {
      console.error(err.response?.status, err.response?.data || err);
      alert("상태 변경 실패");
    }
  };

  // --- Review 상태 변경 ---
  const updateReviewStatus = async (reviewIdx: number, isBlind: 0 | 1) => {
  if (!token) return;
  try {
    await api.patch(
      `/reviews/${reviewIdx}/status`,
      { isBlind },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReviews(prev =>
      prev.map(r => (r.reviewIdx === reviewIdx ? { ...r, isBlind } : r))
    );
  } catch (err: any) {
    console.error(err.response?.status, err.response?.data || err);
    alert("리뷰 상태 변경 실패");
  }
};

const deleteReview = async (reviewIdx: number) => {
  if (!token) return;
  try {
    await api.delete(`/reviews/${reviewIdx}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews((prev) => prev.filter((r) => r.reviewIdx !== reviewIdx));
  } catch (err: any) {
    console.error(err.response?.status, err.response?.data || err);
    alert("리뷰 삭제 실패");
  }
};

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="admin" onNavigation={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">MovieSSG 사이트 관리 시스템</p>
          </div>
        </div>

        {/* 검색바 */}
        <AdminSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="reviews">리뷰 관리</TabsTrigger>
            <TabsTrigger value="comments">댓글 관리</TabsTrigger>
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
              users={users}
              movies={movies}
              searchQuery={searchQuery}
              setEditingReview={setEditingReview}
              updateReviewStatus={updateReviewStatus} // ✅ 추가
            />
          </TabsContent>
        </Tabs>
      </div>

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

      <Footer />
    </div>
  );
}
