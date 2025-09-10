import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search } from "lucide-react";
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
import { api } from "../lib/api";
import AdminEditReviewModal from "../components/admin/AdminEditReviewModal";
import AdminSearchBar from "../components/admin/AdminSearchBar";

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

  // --- Users API 호출 ---
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedUsers: User[] = res.data.map((u: any) => ({
          id: u.userId,
          username: u.username,
          status:
            u.status === 0
              ? "active"
              : u.status === 1
              ? "inactive"
              : "banned",
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
    };

    fetchUsers();
  }, [token]);

  // --- 삭제 ---
  const deleteUser = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      console.error(err.response?.status, err.response?.data || err);
      alert("삭제 실패");
    }
  };

  // --- Reviews API 호출 ---
  useEffect(() => {
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
    fetchReviews();
  }, [token]);

  // --- 상태 변경 ---
  const updateUserStatus = async (id: string, status: User["status"]) => {
    if (!token) return;
    try {
      const statusNum = status === "active" ? 0 : status === "inactive" ? 1 : 2;

      await api.patch(
        `/users/${id}/status`,
        { status: statusNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // UI에도 바로 반영
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    } catch (err: any) {
      console.error(err.response?.status, err.response?.data || err);
      alert("상태 변경 실패");
    }
  };

  // --- 상태 변경 (Reviews) --- <--- 여기
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

        {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">총 회원수</p>
                          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <MessageSquare className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">총 리뷰수</p>
                          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">총 게시글수</p>
                          <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Bell className="h-8 w-8 text-orange-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">공지사항</p>
                          <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
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
      searchQuery={searchQuery} // 여기에서 검색어 전달
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
              movies={movies}
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
  editingReview={editingReview} // AdminPage에서 관리하는 상태
  setEditingReview={setEditingReview} 
  updateReviewStatus={updateReviewStatus}
/>

      

      <Footer />
    </div>
  );
}
