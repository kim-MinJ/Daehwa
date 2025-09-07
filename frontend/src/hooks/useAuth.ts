import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api";

interface UserInfo {
  userId: string;
  username: string;
  role: string;
  regDate: string; // ISO 문자열
  status: number;
  profileImage?: string; // DB에는 없지만 UI fallback용
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // token을 localStorage에 저장
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setUserInfo(null);
    }
  }, [token]);

  // 로그인
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

    // 로그인 직후 사용자 정보 가져오기
    await getUserInfo(data.token);
  };

  // 회원가입
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

  // 로그아웃
  const logout = () => {
    setToken(null);
    setUserInfo(null);
  };

  // 사용자 정보 가져오기
  const getUserInfo = async (overrideToken?: string) => {
    const t = overrideToken || token;
    if (!t) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`
      },
    });

    if (!res.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");

    const data = await res.json();

    setUserInfo({
      userId: data.userId,
      username: data.username,
      role: data.role,
      regDate: data.regDate,
      status: data.status,
      profileImage: undefined, // fallback 처리
    });

    return data;
  };

  // 사용자 정보 업데이트 (이름 변경 등)
  const updateUser = async (username: string) => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "수정 실패");
    }

    const data = await res.json();

    setUserInfo({
      userId: data.userId,
      username: data.username,
      role: data.role,
      regDate: data.regDate,
      status: data.status,
      profileImage: undefined,
    });

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
