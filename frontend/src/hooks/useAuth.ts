import { useState } from "react";

const API_URL = "http://localhost:8080/api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "로그인 실패");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // JWT 저장
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

const register = async (userId: string, password: string, username: string) => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password, username }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Register failed - Status:", res.status, "Message:", text);
      throw new Error(text || "회원가입 실패");
    }

    const data = await res.json();
    console.log("Register success:", data); // 성공 데이터 로그
    localStorage.setItem("token", data.token);
  } catch (e: any) {
    console.error("Register error:", e);
    setError(e.message);
  } finally {
    setLoading(false);
  }
};


  return { login, register, loading, error };
}
