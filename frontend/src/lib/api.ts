// frontend/src/lib/api.ts  (REPLACE ALL)
import axios from "axios";

// 백엔드 프록시를 기본 경로로 사용합니다. (Vite dev 서버에서 /api → 8080으로 프록시)
export const api = axios.create({
  baseURL: "/api",
});

// 이미지 URL 도우미 (TMDB 이미지 서버는 공개 URL이라 그대로 사용 가능)
export const imgUrl = (
  path?: string,
  size: "w200" | "w300" | "w500" | "original" = "w500"
) => (path ? `${import.meta.env.VITE_TMDB_IMG}/${size}${path}` : "");