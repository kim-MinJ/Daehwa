import { useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/auth";

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
      localStorage.setItem("token", data.token);
    } catch (e: any) {
      setError(e.message);
      throw e;
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
        throw new Error(text || "회원가입 실패");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, register, logout, loading, error };
}
