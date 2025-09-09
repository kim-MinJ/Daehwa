// src/components/admin/AdminEditUserModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { User } from "./types";
import { useState, useEffect } from "react";

interface Props {
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  updateUserStatus: (id: string, status: User["status"]) => void;
}

export default function AdminEditUserModal({ editingUser, setEditingUser, updateUserStatus }: Props) {
  const [status, setStatus] = useState<User["status"]>("active");

  useEffect(() => {
    if (editingUser) setStatus(editingUser.status);
  }, [editingUser]);

  const handleSave = () => {
    if (editingUser) {
      updateUserStatus(editingUser.id, status);
      setEditingUser(null);
    }
  };

  if (!editingUser) return null;

  return (
    <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>회원 편집</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="block font-medium text-gray-700">회원ID</label>
            <p>{editingUser.id}</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700">이름</label>
            <p>{editingUser.username}</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700">가입일</label>
            <p>{editingUser.regDate?.slice(0, 10) || "-"}</p>
          </div>

          <div>
            <label className="block font-medium text-gray-700">상태</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as User["status"])}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="banned">차단</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>저장</Button>
          <Button variant="outline" onClick={() => setEditingUser(null)}>취소</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
