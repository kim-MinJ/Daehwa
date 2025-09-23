import React, { useState } from "react";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

          console.log("📡 로그인 응답 status:", response.status);

      if (!response.ok) throw new Error("로그인 실패");

      const data = await response.json();

      
      // ✅ 디버깅 로그
      console.log("📌 로그인 응답 전체:", data);
      console.log("📌 서버에서 내려온 userId:", data.userId, "typeof:", typeof data.userId);
      console.log("📌 서버에서 내려온 username:", data.username);

      // ✅ localStorage 저장
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(data.userId));   // 👈 추가
    localStorage.setItem("username", data.username);       // 👈 필요시 추가
      alert("로그인 성공!");
      window.location.href = "/"; // 메인 페이지로 이동
    } catch (err) {
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          로그인
        </button>

        <p className="text-center mt-4 text-gray-500">
          아직 회원이 아니신가요?{" "}
          <a href="/signup" className="text-red-500 hover:underline">
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
