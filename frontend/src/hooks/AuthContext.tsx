import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api";
// const API_URL = "http://192.168.0.30:8080/api"

interface UserInfo {
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  userInfo: UserInfo | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  getUserInfo: () => Promise<UserInfo>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
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

  const logout = () => {
    setToken(null);
    setUserInfo(null);
  };

  const getUserInfo = async () => {
    if (!token) throw new Error("로그인 토큰이 없습니다.");
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
    const data = await res.json();
    setUserInfo(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout, getUserInfo, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
