import { useState } from "react";

const API_URL = "http://localhost:8080/api/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const login = async (userId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "로그인 실패");
      saveToken(data.token);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      throw e;
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "회원가입 실패");
      saveToken(data.token);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return { token, login, register, logout, loading, error };
}
