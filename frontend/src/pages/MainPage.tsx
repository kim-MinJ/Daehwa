// src/pages/MainPage.tsx
import React from "react";

export function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="main-page" style={{ padding: "20px" }}>
      <h1>메인페이지</h1>
      <p>인기 영화 리스트나 추천 영화 표시 가능</p>

      {/* 마이페이지로 이동 */}
      <button onClick={() => onNavigate("mypage")}>
        마이페이지로 이동
      </button>

      {/* 로그인 화면으로 돌아가기 */}
      <button onClick={() => onNavigate("login")} style={{ marginLeft: "10px" }}>
        로그아웃 / 로그인 화면
      </button>
    </div>
  );
}
