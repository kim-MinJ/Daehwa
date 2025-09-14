import { api } from "../lib/api";

export const createVs = async (movie1Id: number, movie2Id: number, token: string) => {
  try {
    const res = await api.post(
      `/vs`,
      {},
      {
        params: { movie1Id, movie2Id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("VS 생성 실패", err);
    throw err;
  }
};