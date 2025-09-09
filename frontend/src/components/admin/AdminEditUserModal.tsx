import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "./types";
import "/src/assets/AdminEditUserModal.css";

interface Props {
  editingUser: User | null;
  setEditingUser: Dispatch<SetStateAction<User | null>>;
  updateUserStatus: (id: string, status: User["status"]) => void;
}

export default function AdminEditUserModal({
  editingUser,
  setEditingUser,
  updateUserStatus,
}: Props) {
  const [status, setStatus] = useState<User["status"]>("active");

  // editingUser가 바뀔 때만 초기화
  useEffect(() => {
    if (editingUser) {
      setStatus(editingUser.status);
    }
  }, [editingUser?.id]);

 const handleSave = async () => {
  if (editingUser) {
    await updateUserStatus(editingUser.id, status); // 서버 반영 후
    setEditingUser(null); // 모달 닫기
  }
};

  if (!editingUser) return null;

  return (
    <div className="modal-overlay">
      {/* 배경 */}
      <div className="modal-backdrop"></div>

      {/* 모달 박스 */}
      <div className="modal-box">
        <h2 className="modal-title">회원 편집</h2>

        <div className="modal-field">
          <div>
            <label>회원ID</label>
            <p>{editingUser.id}</p>
          </div>

          <div>
            <label>이름</label>
            <p>{editingUser.username}</p>
          </div>

          <div>
            <label>가입일</label>
            <p>{editingUser.regDate?.slice(0, 10) || "-"}</p>
          </div>

          <div>
            <label>상태</label>
            <select
              value={status}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "active" || value === "inactive" || value === "banned") {
                  setStatus(value);
                }
              }}
            >
              <option value="active">정상</option>
              <option value="inactive">접속제한</option>
              <option value="banned">정지</option>
            </select>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="modal-save-btn" onClick={handleSave}>
            저장
          </button>
          <button className="modal-cancel-btn" onClick={() => setEditingUser(null)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
