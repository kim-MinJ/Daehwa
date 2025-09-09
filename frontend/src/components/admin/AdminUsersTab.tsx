// AdminUsersTab.tsx
import { User } from "./types";
import { Button } from "../ui/button";

const statusMap: Record<User["status"], string> = {
  active: "정상",
  inactive: "접속제한",
  banned: "정지",
};

interface AdminUsersTabProps {
  users: User[];
  searchQuery: string;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUserStatus: (id: string, status: User["status"]) => Promise<void>;
}

export default function AdminUsersTab({
  users,
  setEditingUser,
}: AdminUsersTabProps) {
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
              <td className="p-2">{user.regDate || "-"}</td>
              <td className="p-2">
                <Button
                  className="!bg-black !text-white px-3 py-1 rounded hover:!bg-gray-800"
                  onClick={() => setEditingUser(user)}
                >
                  편집
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
