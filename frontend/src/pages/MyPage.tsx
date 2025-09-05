import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, Edit3, Settings, Heart, Star, Calendar, Users, Film, Lock, User, Bookmark, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface MyPageProps {
  onNavigate: (page: string) => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const [user] = useState({
    name: "김영화",
    email: "movie.lover@example.com",
    profileImage: "",
    memberSince: "2023.03.15",
    favoriteGenres: ["액션", "SF", "드라마"],
    watchedMovies: 147,
    reviews: 23,
    favorites: 31
  });

  const [currentView, setCurrentView] = useState("profile"); // profile, personal, bookmarks
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [bookmarkedMovies] = useState([
    {
      id: 1,
      title: "어벤져스: 엔드게임",
      poster: "https://images.unsplash.com/photo-1635863138275-d9b33299824b?w=300&h=400&fit=crop&crop=face",
      rating: 4.5,
      year: "2019",
      genre: "액션"
    },
    {
      id: 2,
      title: "인터스텔라",
      poster: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop&crop=face",
      rating: 5.0,
      year: "2014",
      genre: "SF"
    },
    {
      id: 3,
      title: "기생충",
      poster: "https://images.unsplash.com/photo-1489599210097-3c5d2e5e2f26?w=300&h=400&fit=crop&crop=face",
      rating: 4.8,
      year: "2019",
      genre: "드라마"
    },
    {
      id: 4,
      title: "아바타: 물의 길",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=400&fit=crop&crop=face",
      rating: 4.2,
      year: "2022",
      genre: "SF"
    },
    {
      id: 5,
      title: "탑건: 매버릭",
      poster: "https://images.unsplash.com/photo-1478720568477-b0b33fe7b1f8?w=300&h=400&fit=crop&crop=face",
      rating: 4.7,
      year: "2022",
      genre: "액션"
    }
  ]);

  const handlePasswordSubmit = () => {
    if (passwordInput === "1234") { // 간단한 비밀번호 검증
      setIsAuthenticated(true);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("비밀번호가 올바르지 않습니다.");
    }
  };

  const renderPasswordModal = () => {
    if (isAuthenticated) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle>비밀번호 확인</CardTitle>
            <p className="text-sm text-muted-foreground">
              개인정보 및 북마크 목록을 확인하려면 비밀번호를 입력해주세요.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>데모용 비밀번호:</strong> 1234
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCurrentView("profile")}
              >
                취소
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handlePasswordSubmit}
              >
                확인
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const handleSecureAction = (action: string) => {
    if (!isAuthenticated) {
      setCurrentView(action);
      return;
    }
    setCurrentView(action);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("main")}
              className="text-white hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              메인으로 돌아가기
            </Button>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("profile")}
                className={`px-3 py-2 rounded transition-colors ${
                  currentView === "profile" ? "bg-red-700" : "hover:bg-red-700"
                }`}
              >
                프로필
              </button>
              <button
                onClick={() => handleSecureAction("personal")}
                className={`px-3 py-2 rounded transition-colors ${
                  currentView === "personal" ? "bg-red-700" : "hover:bg-red-700"
                }`}
              >
                개인정보수정
              </button>
              <button
                onClick={() => handleSecureAction("bookmarks")}
                className={`px-3 py-2 rounded transition-colors ${
                  currentView === "bookmarks" ? "bg-red-700" : "hover:bg-red-700"
                }`}
              >
                북마크목록
              </button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate("login")}
            className="text-white border-white hover:bg-red-700"
          >
            로그아웃
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 프로필 뷰 */}
        {currentView === "profile" && (
          <div className="space-y-8">
            {/* 프로필 헤더 */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="text-xl bg-red-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold">{user.name}</h1>
                      <Badge className="bg-red-600 text-white">프리미엄 회원</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{user.email}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>가입일: {user.memberSince}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>선호 장르:</span>
                        <div className="flex space-x-1">
                          {user.favoriteGenres.map((genre) => (
                            <Badge key={genre} variant="secondary">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{user.watchedMovies}</div>
                        <div className="text-sm text-muted-foreground">시청한 영화</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{user.reviews}</div>
                        <div className="text-sm text-muted-foreground">작성한 리뷰</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{user.favorites}</div>
                        <div className="text-sm text-muted-foreground">즐겨찾기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Film className="w-5 h-5 mr-2 text-red-600" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">영화 "인터스텔라"에 리뷰를 작성했습니다</p>
                      <p className="text-sm text-muted-foreground">2일 전</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <Bookmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">영화 "아바타: 물의 길"을 북마크했습니다</p>
                      <p className="text-sm text-muted-foreground">5일 전</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 개인정보수정 뷰 */}
        {currentView === "personal" && isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-red-600" />
                개인정보 수정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" value={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" value={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input id="phone" placeholder="010-0000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth">생년월일</Label>
                  <Input id="birth" type="date" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">비밀번호 변경</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">현재 비밀번호</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">선호 설정</h3>
                <div className="space-y-2">
                  <Label>선호 장르</Label>
                  <div className="flex flex-wrap gap-2">
                    {["액션", "코미디", "드라마", "SF", "로맨스", "스릴러", "공포", "애니메이션"].map((genre) => (
                      <Badge 
                        key={genre} 
                        variant={user.favoriteGenres.includes(genre) ? "default" : "outline"}
                        className={user.favoriteGenres.includes(genre) ? "bg-red-600" : ""}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline">취소</Button>
                <Button className="bg-red-600 hover:bg-red-700">저장</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 북마크목록 뷰 */}
        {currentView === "bookmarks" && isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bookmark className="w-5 h-5 mr-2 text-red-600" />
                내 북마크 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {bookmarkedMovies.map((movie) => (
                  <div key={movie.id} className="space-y-3">
                    <div className="relative group cursor-pointer">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full aspect-[3/4] object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center space-y-2">
                          <Star className="w-6 h-6 mx-auto fill-yellow-400 text-yellow-400" />
                          <div className="text-sm font-semibold">{movie.rating}</div>
                          <Badge className="bg-red-600">{movie.genre}</Badge>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold line-clamp-2">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground">{movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 비밀번호 확인 모달 */}
      {(currentView === "personal" || currentView === "bookmarks") && renderPasswordModal()}
    </div>
  );
}