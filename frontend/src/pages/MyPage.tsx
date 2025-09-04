// src/pages/MyPage.tsx
import React from "react";

export function MyPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="mypage" style={{ padding: "20px" }}>
      <h1>마이페이지</h1>
      <p>최근 본 영화, 회원 정보, 설정 등을 표시 가능</p>

      {/* 메인페이지로 이동 */}
      <button onClick={() => onNavigate("main")}>
        메인으로 이동
      </button>

      {/* 로그인 화면으로 돌아가기 */}
      <button onClick={() => onNavigate("login")} style={{ marginLeft: "10px" }}>
        로그아웃 / 로그인 화면
      </button>
    </div>
  );
}
