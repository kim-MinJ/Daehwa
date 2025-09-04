// src/services/AuthService.ts
export interface AuthResponse {
  userId: string;
  username: string;
  token: string;
}

export class AuthService {
  static async login(userId: string, password: string): Promise<AuthResponse> {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "로그인 실패");
    }
    return res.json();
  }

  static async register(userId: string, password: string, username: string): Promise<AuthResponse> {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password, username }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "회원가입 실패");
    }
    return res.json();
  }
}