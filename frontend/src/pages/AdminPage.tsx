// src/pages/AdminPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { User } from "../components/admin/types";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminEditUserModal from "../components/admin/AdminEditUserModal";
import { api } from "../lib/api";

export function AdminPage() {
  const { userInfo, loading, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
            : "-", // null/잘못된 값도 안전하게 처리
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
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      console.error(err.response?.status, err.response?.data || err);
      alert("삭제 실패");
    }
  };

  // --- 상태 변경 ---
  const updateUserStatus = async (id: string, status: User["status"]) => {
    if (!token) return;
    try {
      await api.patch(
        `/users/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => (u.id === id ? { ...u, status } : u)));
    } catch (err: any) {
      console.error(err.response?.status, err.response?.data || err);
      alert("상태 변경 실패");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="admin" onNavigation={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">MovieSSG 사이트 관리 시스템</p>
          </div>
        </div>

        {/* 검색바 */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">회원 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab
              users={users}
              searchQuery={searchQuery}
              setEditingUser={setEditingUser}
              deleteUser={deleteUser}
              updateUserStatus={updateUserStatus}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 편집 모달 */}
      <AdminEditUserModal
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        updateUserStatus={updateUserStatus}
      />

      <Footer />
    </div>
  );
}
