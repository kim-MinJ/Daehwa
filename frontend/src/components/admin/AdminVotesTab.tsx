// src/components/admin/AdminVotesTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useVsManager, VsVote } from "../../hooks/useVsManager";

interface AdminVotesTabProps {
  token: string;
}

export default function AdminVotesTab({ token }: AdminVotesTabProps) {
  const {
    votes,
    loading,
    selectedRankingVotes,
    setSelectedRankingVotes,
    deleteVs,
    updateVoteStatus,
    toggleRankingVote,
    saveRankingVotes,
  } = useVsManager(token);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredVotes = votes.filter(
    (v) =>
      v.movie1Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.movie2Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (active: boolean) => (
    <span className={`${active ? "bg-green-600" : "bg-yellow-600"} text-white px-2 py-1 rounded`}>
      {active ? "active" : "inactive"}
    </span>
  );

  if (loading) return <p>로딩 중...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>투표 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        {filteredVotes.length === 0 ? (
          <p className="text-center py-4 text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredVotes.map((vote: VsVote) => (
              <div key={vote.voteIdx} className="flex flex-wrap items-center border p-4 rounded-lg gap-4 hover:shadow-md transition">
                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <img src={vote.movie1Poster} alt={vote.movie1Title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{vote.movie1Title} vs {vote.movie2Title}</h3>
                  <p className="text-sm text-gray-500">
                    {vote.movie1Rating?.toFixed(1)} / {vote.movie1Year} vs {vote.movie2Rating?.toFixed(1)} / {vote.movie2Year}
                  </p>
                  <div className="mt-2">{getStatusBadge(vote.active)}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRankingVotes.includes(vote.voteIdx)}
                    onChange={() => toggleRankingVote(vote.voteIdx)}
                    disabled={!selectedRankingVotes.includes(vote.voteIdx) && selectedRankingVotes.length >= 2}
                  />
                  <span className="text-xs text-gray-500">랭킹 투표</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant={vote.active ? "default" : "outline"} onClick={() => updateVoteStatus(vote.voteIdx, "active")}>활성</Button>
                  <Button size="sm" variant={!vote.active ? "destructive" : "outline"} onClick={() => updateVoteStatus(vote.voteIdx, "inactive")}>비활성</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteVs(vote.voteIdx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={saveRankingVotes} disabled={selectedRankingVotes.length !== 2}>
            선택 완료 / 랭킹 업데이트
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
