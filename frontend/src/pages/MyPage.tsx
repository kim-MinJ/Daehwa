import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Settings } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../hooks/useAuth";

interface MyPageProps {
  onNavigate: (page: string) => void;
} 

interface Bookmark {
  bookmarkIdx: number;
  userId: string;
  movieIdx: number;
  title?: string;
  posterPath?: string;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const { token, userInfo } = useAuth();
  const [randomMovie, setRandomMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 랜덤 추천 영화
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get("http://localhost:8080/api/movies/random", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRandomMovie(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // 북마크 목록 가져오기
  const fetchBookmarks = () => {
    if (!token) return;
    axios.get("http://localhost:8080/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setBookmarks(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  // 북마크 토글
  const toggleBookmark = (movieIdx: number) => {
    if (!token) return;

    const existing = bookmarks.find(b => b.movieIdx === movieIdx);

    if (existing) {
      // 삭제
      axios.delete(`http://localhost:8080/api/bookmarks/${existing.bookmarkIdx}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchBookmarks())
        .catch(console.error);
    } else {
      // 추가
      axios.post(`http://localhost:8080/api/bookmarks`, null, {
        params: { movieIdx },
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchBookmarks())
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("main")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 메인으로 돌아가기
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" /> 설정
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 프로필 + 추천 영화 */}
        <Card>
          <CardContent className="p-8 flex items-center space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userInfo?.profileImage || ""} />
              <AvatarFallback className="text-xl">{userInfo?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{userInfo?.username}님</h1>
              <p className="text-muted-foreground">오늘의 추천 영화</p>
            </div>
          </CardContent>
        </Card>

        {/* 추천 영화 카드 */}
        <Card>
          <CardHeader><CardTitle>추천 영화</CardTitle></CardHeader>
          <CardContent className="text-center">
            {loading && <p>Loading...</p>}
            {!loading && randomMovie && (
              <div className="space-y-4">
                <ImageWithFallback
                  src={randomMovie.posterPath ? `https://image.tmdb.org/t/p/w500${randomMovie.posterPath}` : "/fallback-image.png"}
                  alt={randomMovie.title || "추천 영화"}
                  className="w-[300px] rounded-lg mx-auto"
                />
                <h2 className="text-lg font-semibold">{randomMovie.title || "추천 영화 없음"}</h2>
                <Button
                  size="sm"
                  onClick={() => toggleBookmark(randomMovie.movieIdx)}
                  variant={bookmarks.some(b => b.movieIdx === randomMovie.movieIdx) ? "destructive" : "outline"}
                >
                  {bookmarks.some(b => b.movieIdx === randomMovie.movieIdx) ? "북마크 해제" : "북마크"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 북마크 목록 테이블 */}
        <Card>
          <CardHeader><CardTitle>북마크 목록</CardTitle></CardHeader>
          <CardContent>
            {bookmarks.length === 0 ? <p>북마크가 없습니다.</p> : (
              <table className="w-full border-collapse border border-gray-300 text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">영화 포스터</th>
                    <th className="border p-2">영화 제목</th>
                    <th className="border p-2">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {bookmarks.map(b => (
                    <tr key={b.bookmarkIdx}>
                      <td className="border p-2">
                        <img
                          src={b.posterPath ? `https://image.tmdb.org/t/p/w200${b.posterPath}` : "/fallback-image.png"}
                          alt={b.title}
                          className="w-16 rounded"
                        />
                      </td>
                      <td className="border p-2">{b.title}</td>
                      <td className="border p-2">
                        <Button size="sm" variant="destructive" onClick={() => toggleBookmark(b.movieIdx)}>
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
