// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
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
      setToken(data.token);
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
      const res = await fetch("http://localhost:8080/register", {
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
      setToken(data.token);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isLoggedIn = !!token;

  return { token, isLoggedIn, login, register, logout, loading, error };
}
