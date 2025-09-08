import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api";

export interface UserInfo {
  userId: string;
  username: string;
  role: string;
  regDate: string; // ISO 문자열
  status: number;
  profileImage?: string; // UI fallback용
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 토큰 상태 변화 시 localStorage 업데이트 및 사용자 정보 fetch
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        localStorage.removeItem("token");
        setUserInfo(null);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      try {
        const data = await getUserInfo(token);
        setUserInfo(data);
      } catch (err) {
        console.error(err);
        setUserInfo(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
    // login 후 getUserInfo는 위 useEffect에서 처리됨
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
        Authorization: `Bearer ${t}`,
      },
    });

    if (!res.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");

    const data = await res.json();

    const user: UserInfo = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      regDate: data.regDate,
      status: data.status,
      profileImage: undefined, // fallback 처리
    };

    setUserInfo(user);
    return user;
  };

  // 사용자 정보 업데이트
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
    const updatedUser: UserInfo = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      regDate: data.regDate,
      status: data.status,
      profileImage: undefined,
    };

    setUserInfo(updatedUser);
    return updatedUser;
  };

  return {
    token,
    userInfo,
    loading,
    login,
    register,
    logout,
    getUserInfo,
    updateUser,
    isLoggedIn: !!token,
  };
}
