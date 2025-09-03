import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
    language: import.meta.env.VITE_TMDB_LANG ?? "ko-KR",
  },
});

// 이미지 helper
export const imgUrl = (path?: string, size: "w200"|"w300"|"w500"|"original"="w500") =>
  path ? `${import.meta.env.VITE_TMDB_IMG}/${size}${path}` : "";
