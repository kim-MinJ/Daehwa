// src/components/admin/AdminUsersTab.tsx
import { FC } from "react";
import { User } from "./types";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";

interface AdminUsersTabProps {
  users: User[];
  searchQuery: string;
  setEditingUser: (user: User | null) => void;
  deleteUser: (id: string) => void;
  updateUserStatus: (id: string, status: User["status"]) => void;
}

const AdminUsersTab: FC<AdminUsersTabProps> = ({
  users,
  searchQuery,
  setEditingUser,
  deleteUser,
  updateUserStatus,
}) => {
  // 검색 필터
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">회원명</th>
            <th className="p-2 text-left">이메일</th>
            <th className="p-2 text-left">가입일</th>
            <th className="p-2 text-left">상태</th>
            <th className="p-2 text-left">리뷰수</th>
            <th className="p-2 text-left">액션</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.joinDate}</td>
              <td className="p-2">
                <select
                  value={user.status}
                  onChange={e => updateUserStatus(user.id, e.target.value as User["status"])}
                  className="border rounded px-2 py-1"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="banned">차단</option>
                </select>
              </td>
              <td className="p-2">{user.reviewCount}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTab;
