// src/components/admin/AdminVotesTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { Vote } from './types';
import { useState } from 'react';

interface AdminVotesTabProps {
  votes?: Vote[];
  searchQuery?: string;
  updateVoteStatus: (id: string, status: 'active' | 'inactive') => void;
  deleteVote: (id: string) => void;
  selectedRankingVotes: string[]; // 선택된 투표영화 id 배열
  setSelectedRankingVotes: (ids: string[]) => void; // 선택 상태 변경
}

export default function AdminVotesTab({
  votes = [],
  searchQuery = '',
  updateVoteStatus,
  deleteVote,
  selectedRankingVotes,
  setSelectedRankingVotes,
}: AdminVotesTabProps) {
  const filterVotes = () =>
    votes.filter(v =>
      (v.movieTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.voter || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const colorMap = { active: 'bg-green-600', inactive: 'bg-yellow-600' };
    return (
      <span className={`${colorMap[status as keyof typeof colorMap]} text-white px-2 py-1 rounded`}>
        {status}
      </span>
    );
  };

  const toggleRankingVote = (id: string) => {
    if (selectedRankingVotes.includes(id)) {
      setSelectedRankingVotes(selectedRankingVotes.filter(v => v !== id));
    } else {
      if (selectedRankingVotes.length >= 2) {
        alert('랭킹 투표 영화는 최대 2개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedRankingVotes([...selectedRankingVotes, id]);
    }
  };

  const filtered = filterVotes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>투표 관리</CardTitle>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-center py-4 text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">영화</th>
                  <th className="text-left p-4">투표자</th>
                  <th className="text-left p-4">투표수</th>
                  <th className="text-left p-4">상태</th>
                  <th className="text-left p-4">랭킹 투표</th>
                  <th className="text-left p-4">관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(vote => (
                  <tr key={vote.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{vote.movieTitle || '-'}</td>
                    <td className="p-4">{vote.voter || '-'}</td>
                    <td className="p-4">{vote.voteCount ?? 0}</td>
                    <td className="p-4">{getStatusBadge(vote.status)}</td>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRankingVotes.includes(vote.id)}
                        onChange={() => toggleRankingVote(vote.id)}
                        disabled={
                          !selectedRankingVotes.includes(vote.id) &&
                          selectedRankingVotes.length >= 2
                        }
                      />
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant={vote.status === 'active' ? 'default' : 'outline'}
                        onClick={() => updateVoteStatus(vote.id, 'active')}
                      >
                        활성
                      </Button>
                      <Button
                        size="sm"
                        variant={vote.status === 'inactive' ? 'destructive' : 'outline'}
                        onClick={() => updateVoteStatus(vote.id, 'inactive')}
                      >
                        비활성
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteVote(vote.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
