import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (userId: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "로그인 실패");
    }

    const data = await res.json();
    setToken(data.token);
  };

  const register = async (userId: string, password: string, username: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password, username }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "회원가입 실패");
    }

    return await res.json();
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null);
  };

  const getUserInfo = async () => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (!res.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");

    const data = await res.json();
    setUserInfo(data);
    return data;
  };

  const updateUser = async (username: string, email: string) => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "수정 실패");
    }

    const data = await res.json();
    setUserInfo(data);
    return data;
  };

  return {
    token,
    userInfo,
    login,
    register,
    logout,
    getUserInfo,
    updateUser,
    isLoggedIn: !!token,
  };
}
