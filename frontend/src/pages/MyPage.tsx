import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Edit3, Settings, Heart, Calendar, Film } from "lucide-react";
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
    axios
      .get("http://localhost:8080/api/movies/random", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRandomMovie(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // 북마크 목록 가져오기
  const fetchBookmarks = () => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookmarks(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  // 북마크 토글
  const toggleBookmark = (movieIdx: number) => {
    if (!token) return;
    const existing = bookmarks.find((b) => b.movieIdx === movieIdx);

    if (existing) {
      axios
        .delete(`http://localhost:8080/api/bookmarks/${existing.bookmarkIdx}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => fetchBookmarks())
        .catch(console.error);
    } else {
      axios
        .post(`http://localhost:8080/api/bookmarks`, null, {
          params: { movieIdx },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => fetchBookmarks())
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 프로필 카드 */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userInfo?.profileImage || ""} />
                  <AvatarFallback className="text-xl">{userInfo?.username?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{userInfo?.username || "정보 없음"}</h1>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" /> 프로필 편집
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">{userInfo?.username || "정보 없음"}</p>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        가입일: {userInfo?.regDate ? new Date(userInfo.regDate).toLocaleDateString() : "정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>선호 장르:</span>
                      <div className="flex space-x-1">
                        <Badge variant="secondary">액션</Badge>
                        <Badge variant="secondary">SF</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{bookmarks.length}</div>
                      <div className="text-sm text-muted-foreground">즐겨찾기</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 구조 */}
        <Tabs defaultValue="recommend" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommend">추천 영화</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          {/* 추천 영화 탭 */}
          <TabsContent value="recommend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Film className="w-5 h-5 mr-2" /> 오늘의 추천 영화
                </CardTitle>
              </CardHeader>
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
                      variant={bookmarks.some((b) => b.movieIdx === randomMovie.movieIdx) ? "destructive" : "outline"}
                    >
                      {bookmarks.some((b) => b.movieIdx === randomMovie.movieIdx) ? "북마크 해제" : "북마크"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 즐겨찾기 탭 */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" /> 즐겨찾기 영화
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4" />
                    <p>아직 즐겨찾기한 영화가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {bookmarks.map((b) => (
                      <div key={b.bookmarkIdx} className="space-y-2">
                        <ImageWithFallback
                          src={b.posterPath ? `https://image.tmdb.org/t/p/w200${b.posterPath}` : "/fallback-image.png"}
                          alt={b.title}
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold line-clamp-2">{b.title}</p>
                          <Button size="sm" variant="destructive" onClick={() => toggleBookmark(b.movieIdx)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 리뷰 (임시) */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>내가 작성한 리뷰</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">아직 리뷰가 없습니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 계정 설정 */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>계정 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" value={userInfo?.username || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" value={userInfo?.userId || ""} />
                </div>
                <Separator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
