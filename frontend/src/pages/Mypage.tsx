import React from "react";

export function MyPage() {
  return (
    <div className="mypage" style={{ padding: "20px" }}>
      <h1>마이페이지</h1>
      <p>최근 본 영화, 회원 정보, 설정 등을 표시 가능</p>
      <button>메인으로 이동</button>
      <button style={{ marginLeft: "10px" }}>로그인 화면으로 돌아가기</button>
    </div>
  );
}