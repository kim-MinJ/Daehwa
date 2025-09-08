import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Edit3, Calendar, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

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
  const { token, userInfo, setUserInfo, logout, getUserInfo } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recommendMovies, setRecommendMovies] = useState<Movie[]>([]);

  // 계정 정보 수정 상태
  const [username, setUsername] = useState(userInfo?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 관리자 모달 상태
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // 북마크 목록 가져오기
  const fetchBookmarks = () => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/bookmarks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookmarks(res.data))
      .catch(console.error);
  };

  // 추천 영화 가져오기
  const fetchRecommendMovies = () => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/movies/random", {
        headers: { Authorization: `Bearer ${token}` },
        params: { count: 8 },
      })
      .then((res) => setRecommendMovies(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBookmarks();
    fetchRecommendMovies();
  }, [token]);

  useEffect(() => {
    if (userInfo?.username) setUsername(userInfo.username);
  }, [userInfo]);

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

  const isBookmarked = (movieIdx: number) => bookmarks.some((b) => b.movieIdx === movieIdx);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => onNavigate("main")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 메인으로 돌아가기
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setIsAdminModalOpen(true)}>
              <Edit3 className="w-4 h-4 mr-2" /> 관리자 모드
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

      {/* 관리자 모달 */}
      <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>관리자 모드</DialogTitle>
            <DialogDescription>관리자 권한을 부여받기 위해 코드를 입력하세요.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Label htmlFor="adminCode">관리자 코드</Label>
            <Input
              id="adminCode"
              type="text"
              placeholder="관리자 코드를 입력하세요"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => {
                if (!adminCode.trim()) return alert("관리자 코드를 입력해주세요.");

                axios
                  .put("http://localhost:8080/api/admin/grant", null, {
                    params: { adminCode },
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then(async (res) => {
                    alert(res.data.message);
                    setIsAdminModalOpen(false);
                    setAdminCode("");

                    // 관리자 권한 갱신
                    if (getUserInfo && setUserInfo) {
                      const data = await getUserInfo();
                      setUserInfo(data);
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    alert(err.response?.data?.message || "관리자 권한 부여 실패");
                  });
              }}
            >
              권한 부여
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdminModalOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

                    {/* 관리자 빨간 박스 → 검은 박스, 빨간 글씨 */}
{userInfo?.role === "admin" && (
  <span className="bg-black text-red-600 px-3 py-1 text-sm rounded-md font-semibold">
    관리자
  </span>
)}
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        가입일:{" "}
                        {userInfo?.regDate
                          ? new Date(userInfo.regDate).toLocaleDateString()
                          : "정보 없음"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{bookmarks.length}</div>
                      <div className="text-sm text-muted-foreground">북마크</div>
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
            <TabsTrigger value="favorites">북마크</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          {/* 추천 영화 */}
          <TabsContent value="recommend">
            {recommendMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendMovies.map((movie) => (
                  <Card key={movie.movieIdx}>
                    <img
                      src={movie.posterPath ? `${TMDB_BASE_URL}${movie.posterPath}` : "/default.jpg"}
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <CardContent className="flex flex-col gap-2">
                      <h3 className="font-bold">{movie.title}</h3>
                      <Button
                        size="sm"
                        variant={isBookmarked(movie.movieIdx) ? "destructive" : "outline"}
                        onClick={() => toggleBookmark(movie.movieIdx)}
                      >
                        <Heart className="w-4 h-4 mr-1" /> 북마크
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>추천 영화가 없습니다.</p>
            )}
          </TabsContent>

          {/* 북마크 */}
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
                    <CardContent className="flex flex-col gap-2">
                      <h3 className="font-bold">{b.title}</h3>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => toggleBookmark(b.movieIdx)}
                      >
                        <Heart className="w-4 h-4 mr-1" /> 북마크 제거
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>북마크가 없습니다.</p>
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
                          .catch(() => alert("이름 변경에 실패했습니다."));
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
                          .catch(() => alert("비밀번호 변경 실패"));
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
