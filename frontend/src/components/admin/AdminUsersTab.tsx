import { User } from "./types";
import { Button } from "../ui/button";

interface Props {
  users: User[];
  searchQuery: string;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  deleteUser: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: User["status"]) => Promise<void>;
}

export default function AdminUsersTab({
  users,
  setEditingUser,
  deleteUser,
}: Props) {
  const statusMap: Record<User["status"], string> = {
    active: "정상",
    inactive: "접속제한",
    banned: "정지",
  };

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
                  onClick={() => setEditingUser(user)}
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
