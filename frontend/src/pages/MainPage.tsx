import React from "react";

interface MainPageProps {
  onNavigate: (page: string) => void;
}

export function MainPage({ onNavigate }: MainPageProps) {
  return (
    <div className="main-page" style={{ padding: "20px" }}>
      <h1>메인페이지</h1>
      <p>인기 영화 리스트나 추천 영화 표시 가능</p>
      <button onClick={() => onNavigate("mypage")}>마이페이지로 이동</button>
      <button style={{ marginLeft: "10px" }} onClick={() => onNavigate("login")}>
        로그인 화면으로 돌아가기
      </button>
    </div>
  );
}