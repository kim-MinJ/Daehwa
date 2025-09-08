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
import { ArrowLeft, Edit3, Settings, Calendar, Heart, Film } from "lucide-react";
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

interface Movie {
  movieIdx: number;
  title: string;
  posterPath?: string;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const { token, userInfo, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recommendMovie, setRecommendMovie] = useState<Movie | null>(null);

  // 계정 정보 수정 상태
  const [username, setUsername] = useState(userInfo?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500"; // 포스터 절대 URL

  // 즐겨찾기 목록 가져오기
  const fetchBookmarks = () => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookmarks(res.data))
      .catch(console.error);
  };

  // 추천 영화 가져오기
  const fetchRecommendMovie = () => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/movies/random", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecommendMovie(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBookmarks();
    fetchRecommendMovie();
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
        .post(
          `http://localhost:8080/api/bookmarks`,
          null,
          {
            params: { movieIdx },
            headers: { Authorization: `Bearer ${token}` },
          }
        )
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                onNavigate("login");
              }}
            >
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
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommend">추천 영화</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          {/* 추천 영화 */}
          <TabsContent value="recommend">
            {recommendMovie ? (
              <Card>
                <CardContent className="flex items-center space-x-4">
                  <img
                    src={recommendMovie.posterPath ? `${TMDB_BASE_URL}${recommendMovie.posterPath}` : "/default.jpg"}
                    alt={recommendMovie.title}
                    className="w-32 h-48 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{recommendMovie.title}</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => toggleBookmark(recommendMovie.movieIdx)}
                    >
                      <Heart className="w-4 h-4 mr-1" /> 즐겨찾기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p>추천 영화가 없습니다.</p>
            )}
          </TabsContent>

          {/* 즐겨찾기 */}
          <TabsContent value="favorites">
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bookmarks.map((b) => (
                  <Card key={b.bookmarkIdx}>
                    <img
                      src={b.posterPath ? `${TMDB_BASE_URL}${b.posterPath}` : "/default.jpg"}
                      alt={b.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <CardContent>
                      <h3 className="font-bold">{b.title}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleBookmark(b.movieIdx)}
                      >
                        <Heart className="w-4 h-4 mr-1" /> 삭제
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>즐겨찾기가 없습니다.</p>
            )}
          </TabsContent>

          {/* 계정 설정 */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>계정 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userid">아이디</Label>
                  <Input id="userid" value={userInfo?.userId || ""} readOnly />
                </div>

                {/* 이름 수정 */}
                <div className="space-y-2">
                  <Label htmlFor="username">이름</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (!username.trim()) return alert("이름을 입력해주세요.");
                        axios
                          .put(
                            "http://localhost:8080/api/users/update",
                            { username },
                            { headers: { Authorization: `Bearer ${token}` } }
                          )
                          .then(() => alert("이름이 변경되었습니다."))
                          .catch((err) => {
                            console.error(err);
                            alert("이름 변경에 실패했습니다.");
                          });
                      }}
                    >
                      변경
                    </Button>
                  </div>
                </div>

                {/* 비밀번호 변경 */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호 변경</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="password"
                      placeholder="현재 비밀번호"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="비밀번호 확인"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (!currentPassword || !newPassword || !confirmPassword)
                          return alert("모든 필드를 입력해주세요.");
                        if (newPassword !== confirmPassword)
                          return alert("비밀번호 확인이 일치하지 않습니다.");

                        axios
                          .put(
                            "http://localhost:8080/api/users/password",
                            { currentPassword, newPassword },
                            { headers: { Authorization: `Bearer ${token}` } }
                          )
                          .then(() => {
                            alert("비밀번호가 변경되었습니다.");
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          })
                          .catch((err) => {
                            console.error(err);
                            alert(err.response?.data || "비밀번호 변경 실패");
                          });
                      }}
                    >
                      변경
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
