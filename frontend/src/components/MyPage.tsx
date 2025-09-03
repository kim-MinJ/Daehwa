import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ArrowLeft, Edit3, Settings, Heart, Star, Calendar, Users, Film } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

  const [watchedMovies] = useState([
    {
      id: 1,
      title: "어벤져스: 엔드게임",
      poster: "https://images.unsplash.com/photo-1635863138275-d9b33299824b?w=300&h=400&fit=crop&crop=face",
      rating: 4.5,
      watchedDate: "2024.01.15"
    },
    {
      id: 2,
      title: "인터스텔라",
      poster: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop&crop=face",
      rating: 5.0,
      watchedDate: "2024.01.12"
    },
    {
      id: 3,
      title: "기생충",
      poster: "https://images.unsplash.com/photo-1489599210097-3c5d2e5e2f26?w=300&h=400&fit=crop&crop=face",
      rating: 4.8,
      watchedDate: "2024.01.10"
    }
  ]);

  const [myReviews] = useState([
    {
      id: 1,
      movieTitle: "어벤져스: 엔드게임",
      rating: 4.5,
      review: "완벽한 마블 시네마틱 유니버스의 완결편. 모든 캐릭터들의 여정이 만족스럽게 마무리되었다.",
      date: "2024.01.15",
      likes: 12
    },
    {
      id: 2,
      movieTitle: "인터스텔라",
      rating: 5.0,
      review: "시간과 공간을 초월한 사랑의 이야기. 놀란 감독의 최고작 중 하나.",
      date: "2024.01.12",
      likes: 18
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("main")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로 돌아가기
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate("login")}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 프로필 헤더 */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      프로필 편집
                    </Button>
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
                      <div className="text-2xl font-bold">{user.watchedMovies}</div>
                      <div className="text-sm text-muted-foreground">시청한 영화</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{user.reviews}</div>
                      <div className="text-sm text-muted-foreground">작성한 리뷰</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{user.favorites}</div>
                      <div className="text-sm text-muted-foreground">즐겨찾기</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <Tabs defaultValue="watched" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="watched">시청한 영화</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="watched" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Film className="w-5 h-5 mr-2" />
                  최근 시청한 영화
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {watchedMovies.map((movie) => (
                    <div key={movie.id} className="space-y-2">
                      <div className="relative group cursor-pointer">
                        <ImageWithFallback
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full aspect-[3/4] object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <Star className="w-6 h-6 mx-auto mb-1 fill-yellow-400 text-yellow-400" />
                            <div className="text-sm font-semibold">{movie.rating}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold line-clamp-2">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground">{movie.watchedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  내가 작성한 리뷰
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{review.movieTitle}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.review}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{review.date}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{review.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  즐겨찾기 영화
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4" />
                  <p>아직 즐겨찾기한 영화가 없습니다.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>계정 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" value={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" value={user.email} />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">비밀번호 변경</h3>
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
                <div className="flex justify-end space-x-4">
                  <Button variant="outline">취소</Button>
                  <Button>저장</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}