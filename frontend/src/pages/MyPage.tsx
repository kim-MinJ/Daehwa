import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Edit3, Settings, Film, Star, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../hooks/useAuth";

interface MyPageProps {
  onNavigate: (page: string) => void;
}

interface MovieInfo {
  movieIdx: number;
  tmdbMovieId: number;
  title: string;
  posterPath: string;
  overview?: string;
  releaseDate?: string;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const { token, userInfo } = useAuth();
  const [randomMovie, setRandomMovie] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 랜덤 영화 가져오기
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    axios.get("http://localhost:8080/api/movies/random", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRandomMovie(res.data))
    .catch(err => {
      console.error(err);
      if (err.response?.status === 403) onNavigate("login");
    })
    .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("main")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 메인으로 돌아가기
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" /> 설정
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("login")}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* 프로필 + 추천 영화 카드 */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 프로필 카드 */}
        <Card>
          <CardContent className="p-8 flex items-center space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userInfo?.profileImage || ""} />
              <AvatarFallback className="text-xl">{userInfo?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{userInfo?.username}님</h1>
              <p className="text-muted-foreground">오늘의 추천 영화</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>가입일: {userInfo?.regDate ? new Date(userInfo.regDate).toLocaleDateString() : "-"}</span>
                <span>상태: {userInfo?.status === 0 ? "로그인 가능" : "로그아웃"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추천 영화 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>추천 영화</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading && <p>Loading...</p>}
            {!loading && randomMovie && (
              <div className="space-y-4">
                <ImageWithFallback
                  src={`https://image.tmdb.org/t/p/w500${randomMovie.posterPath}`}
                  alt={randomMovie.title}
                  className="w-[300px] rounded-lg mx-auto"
                />
                <h2 className="text-lg font-semibold">{randomMovie.title}</h2>
                {randomMovie.releaseDate && (
                  <p className="text-sm text-muted-foreground">출시일: {new Date(randomMovie.releaseDate).toLocaleDateString()}</p>
                )}
                {randomMovie.overview && <p className="text-sm">{randomMovie.overview}</p>}
              </div>
            )}
            {!loading && !randomMovie && <p>추천 영화가 없습니다.</p>}
          </CardContent>
        </Card>

        {/* Tabs UI */}
        <Tabs defaultValue="watched" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="watched">시청한 영화</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="watched">
            <p>시청한 영화 리스트</p>
          </TabsContent>
          <TabsContent value="reviews">
            <p>작성한 리뷰 리스트</p>
          </TabsContent>
          <TabsContent value="favorites">
            <p>즐겨찾기 영화 리스트</p>
          </TabsContent>
          <TabsContent value="settings">
            <p>계정 설정</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
