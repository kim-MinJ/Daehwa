// src/hooks/useVsManager.ts
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
  const [selectedRankingVotes, setSelectedRankingVotes] = useState<number[]>([]);

  const fetchVotes = async () => {
    setLoading(true);
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
        { params: { movie1Id, movie2Id }, headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchVotes();
      return res.data;
    } catch (err) {
      console.error("VS 생성 실패", err);
      throw err;
    }
  };

  const deleteVs = async (voteIdx: number) => {
    try {
      await api.delete(`/vs/${voteIdx}`, { headers: { Authorization: `Bearer ${token}` } });
      setVotes(prev => prev.filter(v => v.voteIdx !== voteIdx));
    } catch (err) {
      console.error("VS 삭제 실패", err);
    }
  };

  const updateVoteStatus = async (voteIdx: number, status: "active" | "inactive") => {
    try {
      await api.patch(`/vs/${voteIdx}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setVotes(prev => prev.map(v => (v.voteIdx === voteIdx ? { ...v, active: status === "active" } : v)));
    } catch (err) {
      console.error("VS 상태 변경 실패", err);
    }
  };

  const toggleRankingVote = (voteIdx: number) => {
    if (selectedRankingVotes.includes(voteIdx)) {
      setSelectedRankingVotes(selectedRankingVotes.filter(v => v !== voteIdx));
    } else {
      if (selectedRankingVotes.length >= 2) {
        alert("랭킹 투표 영화는 최대 2개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedRankingVotes([...selectedRankingVotes, voteIdx]);
    }
  };

  const saveRankingVotes = async () => {
    if (selectedRankingVotes.length !== 2) {
      alert("영화 2개를 선택해주세요.");
      return;
    }
    try {
      await api.patch(
        "/vs/ranking",
        { movieIds: selectedRankingVotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("랭킹 투표가 업데이트 되었습니다!");
      fetchVotes();
    } catch (err) {
      console.error(err);
      alert("랭킹 투표 업데이트 실패");
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return {
    votes,
    loading,
    selectedRankingVotes,
    setSelectedRankingVotes,
    fetchVotes,
    createVs,
    deleteVs,
    updateVoteStatus,
    toggleRankingVote,
    saveRankingVotes,
  };
};
