import { useEffect, useState } from "react";
import axios from "axios";
import AdminEditUserModal from "./AdminEditUserModal";
import { User } from "./types"; 
import { Button } from "../ui/button";

// 상태 문자열 ↔ 화면 표시
const statusMap: Record<User["status"], string> = {
  active: "정상",
  inactive: "접속제한",
  banned: "정지",
};

// 문자열 ↔ 숫자 매핑 (DB용)
const statusToNumber: Record<User["status"], number> = {
  active: 0,
  inactive: 1,
  banned: 2,
};

const numberToStatus: Record<number, User["status"]> = {
  0: "active",
  1: "inactive",
  2: "banned",
};

interface AdminUsersTabProps {
  users: User[];
  searchQuery: string;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  deleteUser: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: User["status"]) => Promise<void>;
}

export default function AdminUsersTab({ setEditingUser }: AdminUsersTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedUsers: User[] = res.data.map((u: any) => ({
        id: u.userId,
        username: u.username,
        status: numberToStatus[u.status] || "active",
        regDate: u.regDate || "",
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      alert("회원 목록을 가져오는 데 실패했습니다.");
    }
  };

  const updateUserStatus = async (id: string, status: User["status"]) => {
    if (!token) return;
    try {
      await axios.patch(
        `http://localhost:8080/api/users/${id}/status`,
        { status: statusToNumber[status] }, // 숫자로 변환해서 전송
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 프론트에도 상태 반영
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("상태 변경 실패");
    }
  };

  const deleteUser = async (id: string) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">아이디</th>
            <th className="p-2 text-left">이름</th>
            <th className="p-2 text-left">상태</th>
            <th className="p-2 text-left">가입일</th>
            <th className="p-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{statusMap[user.status]}</td>
              <td className="p-2">{user.regDate?.slice(0, 10) || "-"}</td>
              <td className="p-2 flex gap-2">
                <Button
                  className="!bg-black !text-white px-3 py-1 rounded hover:!bg-gray-800"
                  onClick={() => setEditingUser(user)} // 모달 열기
                >
                  편집
                </Button>
                <Button
                  variant="outline"
                  className="!bg-gray-200 !text-black px-3 py-1 rounded hover:!bg-gray-300"
                  onClick={() => deleteUser(user.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
