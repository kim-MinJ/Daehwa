import { useState, useEffect } from "react";
import { api } from "../lib/api";

export interface VsVote {
  voteIdx: number;
  movie1Title: string;
  movie1Poster: string;
  movie1Rating: number;
  movie1Year: number;
  movie2Title: string;
  movie2Poster: string;
  movie2Rating: number;
  movie2Year: number;
  active: boolean;
}

export const useVsManager = (token: string) => {
  const [votes, setVotes] = useState<VsVote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVotes = async () => {
    try {
      const res = await api.get<VsVote[]>("/vs/votes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotes(res.data);
    } catch (err) {
      console.error("VS 투표 목록 가져오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const createVs = async (movie1Id: number, movie2Id: number) => {
    try {
      const res = await api.post(
        "/vs",
        {},
        {
          params: { movie1Id, movie2Id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // 새로 생성된 VS를 목록에 추가
      await fetchVotes(); // 생성 후 목록 갱신
      return res.data;
    } catch (err) {
      console.error("VS 생성 실패", err);
      throw err;
    }
  };

  const deleteVs = async (voteIdx: number) => {
    try {
      await api.delete(`/vs/${voteIdx}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotes(prev => prev.filter(v => v.voteIdx !== voteIdx));
    } catch (err) {
      console.error("VS 삭제 실패", err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return { votes, loading, fetchVotes, createVs, deleteVs };
};
