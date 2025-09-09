// src/components/admin/AdminUsersTab.tsx
import { User } from "./types";

interface Props {
  users: User[];
  searchQuery: string;
  setEditingUser: (user: User) => void;
  deleteUser: (id: string) => void;
  updateUserStatus: (id: string, status: User["status"]) => void;
}

export default function AdminUsersTab({ users, searchQuery, setEditingUser, deleteUser }: Props) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">회원ID</th>
          <th className="p-2">이름</th>
          <th className="p-2">가입일</th>
          <th className="p-2">상태</th>
          <th className="p-2">액션</th>
        </tr>
      </thead>
      <tbody>
        {users
          .filter(u => u.username.includes(searchQuery))
          .map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.regDate?.slice(0, 10) || "-"}</td>
              <td className="p-2">{user.status}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => setEditingUser(user)}>편집</button>
                <button onClick={() => deleteUser(user.id)}>삭제</button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
