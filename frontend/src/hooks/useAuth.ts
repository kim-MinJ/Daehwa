// hooks/useAuth.ts
import { useState, useEffect } from "react";

const API_URL = "http://192.168.0.23:8080/api";

export interface UserInfo {
  userId: string;
  username: string;
  role: string;
  regDate: string;
  status: number;
  profileImage?: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

const login = async (userId: string, password: string, rememberMe: boolean = false) => {
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
  
  if (rememberMe) {
    // localStorage: 브라우저를 닫아도 유지
    localStorage.setItem("token", data.token);
  } else {
    // sessionStorage: 브라우저 세션 동안만 유지
    sessionStorage.setItem("token", data.token);
  }

  setToken(data.token);
};

  const register = async (userId: string, username: string, password: string) => {
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

  const getUserInfo = async (overrideToken?: string) => {
    const t = overrideToken || token;
    if (!t) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
    });

    if (!res.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");

    const data = await res.json();
    const user: UserInfo = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      regDate: data.regDate,
      status: data.status,
      profileImage: undefined,
    };

    setUserInfo(user);
    return user;
  };

  const updateUser = async (username: string) => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");

    const res = await fetch(`${API_URL}/users/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "비밀번호 변경 실패");
    }

    return await res.json();
  };

  // ✅ 새로 추가: status 즉시 반영
  const updateStatus = (newStatus: number) => {
    setUserInfo(prev => prev ? { ...prev, status: newStatus } : null);
  };

  return {
    token,
    userInfo,
    setUserInfo,
    updateStatus, // 추가
    loading,
    login,
    register,
    logout,
    getUserInfo,
    updateUser,
    updatePassword,
    isLoggedIn: !!token,
  };
}
