import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Edit3, Calendar, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

interface MyPageProps {}

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

interface Review {
  reviewIdx: number;
  userId: string;
  movieIdx: number;
  content: string;
  rating: number;
  createdAt: string; // 작성일
  updateAt: string;  // 수정일
  movieTitle?: string; // 화면용
}

export default function MyPage({}: MyPageProps) {
  const navigate = useNavigate();
  const { token, userInfo, setUserInfo, logout, getUserInfo } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recommendMovies, setRecommendMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState(userInfo?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchBookmarks = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/bookmarks", { headers: authHeader });
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendMovies = async () => {
  if (!token) return;
  try {
    const res = await axios.get("/api/movies/popular", {
        headers: authHeader,
        params: { count: 40 }, // 40개 가져오기
    });

    const movies40: Movie[] = res.data;

    // 40개 중 랜덤으로 12개 선택
    const shuffled = [...movies40].sort(() => 0.5 - Math.random());
    const selected12 = shuffled.slice(0, 12);

    setRecommendMovies(selected12);
  } catch (err) {
    console.error(err);
  }
};

  const fetchReviews = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/reviews/myreview", { headers: authHeader });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchRecommendMovies();
    fetchReviews();
  }, [token]);

  useEffect(() => {
    if (userInfo?.username) setUsername(userInfo.username);
  }, [userInfo]);

  const toggleBookmark = async (movieIdx: number) => {
    if (!token) return;
    const existing = bookmarks.find((b) => b.movieIdx === movieIdx);
    try {
      if (existing) {
        await axios.delete(`/api/bookmarks/${existing.bookmarkIdx}`, { headers: authHeader });
      } else {
        await axios.post(`/api/bookmarks`, null, {
          params: { movieIdx },
          headers: authHeader,
        });
      }
      await fetchBookmarks();
    } catch (err) {
      console.error(err);
    }
  };

  const isBookmarked = (movieIdx: number) => bookmarks.some((b) => b.movieIdx === movieIdx);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="bg-red-600 text-white border-b border-red-700">
          <div className="px-6 py-4 flex items-center">
            <div className="ml-auto flex items-center space-x-4">
              {userInfo?.role === "admin" ? (
                <Button variant="default" size="sm" onClick={() => navigate("/admin")}>
                  관리자 모드
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsAdminModalOpen(true)}>
                  <Edit3 className="w-4 h-4 mr-2" /> 관리자 코드
                </Button>
              )}
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
                onClick={async () => {
                  if (!adminCode.trim()) return alert("관리자 코드를 입력해주세요.");
                  try {
                    const res = await axios.put(
                      "/api/admin/grant",
                      null,
                      { params: { adminCode }, headers: authHeader }
                    );
                    alert(res.data.message);
                    setIsAdminModalOpen(false);
                    setAdminCode("");
                    if (getUserInfo && setUserInfo) {
                      const data = await getUserInfo();
                      setUserInfo(data);
                    }
                  } catch (err: any) {
                    console.error(err);
                    alert(err.response?.data?.message || "관리자 권한 부여 실패");
                  }
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

        {/* 삭제 모달 */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>계정 삭제 확인</DialogTitle>
              <DialogDescription>
                계정을 삭제하려면 아래 입력란에 <strong>삭제합니다</strong> 를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <Input
                placeholder="삭제합니다"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
              <Button
  className="w-full"
  variant="destructive"
  onClick={async () => {
    if (deleteConfirmText !== "삭제합니다") {
      return alert("정확히 '삭제합니다' 를 입력해야 합니다.");
    }
    try {
      // 하드삭제용
      const res = await axios.delete("/api/users/me", { headers: authHeader });

      setIsDeleteModalOpen(false);
      setDeleteConfirmText("");
      logout();
      alert(res.data?.message || "계정 삭제가 완료되었습니다!");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "계정 삭제에 실패했습니다.";
      alert(msg);
    }
  }}
>
  삭제
</Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 컨텐츠 영역 */}
        <div className="bg-white px-6 py-8">
          {/* 프로필 카드 */}
          <Card className="mb-8">
            <CardContent className="p-8 flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userInfo?.profileImage || ""} />
                <AvatarFallback className="text-xl">{userInfo?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold">{userInfo?.username || "정보 없음"}</h1>
                  {userInfo?.role === "admin" && (
                    <span
                      style={{ backgroundColor: "black", color: "#f87171" }}
                      className="px-3 py-1 text-sm rounded-md font-semibold"
                    >
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
              <div className="flex justify-end">
                <div className="grid grid-cols-1 gap-4 text-center mr-6">
                  <div>
                    <div className="text-2xl font-bold">{bookmarks.length}</div>
                    <div className="text-sm text-muted-foreground">북마크</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="recommend" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommend">추천 영화</TabsTrigger>
              <TabsTrigger value="favorites">북마크</TabsTrigger>
              <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
              <TabsTrigger value="settings">계정 설정</TabsTrigger>
            </TabsList>

            {/* 추천 영화 탭 */}
            <TabsContent value="recommend">
              {recommendMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendMovies.map((movie) => (
                    <Card
                      key={movie.movieIdx}
                      className="cursor-pointer"
                      onClick={() => navigate(`/movies/${movie.movieIdx}`)}
                    >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(movie.movieIdx);
                          }}
                        >
                          <Heart
                            className="w-4 h-4 mr-1"
                            fill={isBookmarked(movie.movieIdx) ? "white" : "none"}
                            stroke="currentColor"
                          />{" "}
                          {isBookmarked(movie.movieIdx) ? "찜안해!" : "찜하기"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>추천 영화가 없습니다.</p>
              )}
            </TabsContent>

            {/* 북마크 탭 */}
            <TabsContent value="favorites">
              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bookmarks.map((b) => (
                    <Card
                      key={b.bookmarkIdx}
                      className="cursor-pointer"
                      onClick={() => navigate(`/movies/${b.movieIdx}`)}
                    >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(b.movieIdx);
                          }}
                        >
                          <Heart className="w-4 h-4 mr-1" fill="white" stroke="currentColor" />
                          찜안해!
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>북마크가 없습니다.</p>
              )}
            </TabsContent>

            {/* 리뷰 탭 */}
            <TabsContent value="reviews">
              {reviews.length ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.reviewIdx} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">
                          영화 이름 : {r.movieTitle || `영화 #${r.movieIdx}`}
                        </h3>
                        <div className="text-sm text-gray-500 flex flex-col">
                          <span>
                            작성일 : {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                          </span>
                          <span>
                            수정일 : {r.updateAt ? new Date(r.updateAt).toLocaleDateString()
                              : r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 text-gray-800">{r.content}</p>
                      <div className="text-sm text-gray-600 mb-2">평점: {r.rating} / 10</div>
                      <Button
  size="sm"
  variant="outline"
  onClick={() => navigate(`/movies/${r.movieIdx}/review#review-${r.reviewIdx}`)}
>
  리뷰 보러가기
</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>작성한 리뷰가 없습니다.</p>
              )}
            </TabsContent>

            {/* 계정 설정 탭 */}
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

                  <div className="space-y-2">
                    <Label htmlFor="username">이름</Label>
                    <div className="flex gap-2">
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                      <Button onClick={async () => {
                        if (!username.trim()) return alert("이름을 입력해주세요.");
                        try {
                          await axios.put("/api/users/update", { username }, { headers: authHeader });
                          alert("이름이 변경되었습니다.");
                        } catch {
                          alert("이름 변경에 실패했습니다.");
                        }
                      }}>변경</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호 변경</Label>
                    <div className="flex flex-col gap-2">
                      <Input type="password" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                      <Input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <Input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <Button onClick={async () => {
                        if (!currentPassword || !newPassword || !confirmPassword) return alert("모든 필드를 입력해주세요.");
                        if (newPassword !== confirmPassword) return alert("비밀번호 확인이 일치하지 않습니다.");
                        try {
                          await axios.put("/api/users/password", { currentPassword, newPassword }, { headers: authHeader });
                          alert("비밀번호가 변경되었습니다.");
                          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                        } catch {
                          alert("비밀번호 변경에 실패했습니다.");
                        }
                      }}>변경</Button>
                    </div>
                  </div>

                  {/* 계정 삭제 버튼 */}
<div className="flex flex-col items-end mt-4">
  <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
    계정 삭제
  </Button>
  <span className="text-sm text-red-300 mt-1">
    계정 삭제 시 모든 리뷰, 댓글이 삭제됩니다.
  </span>
</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
