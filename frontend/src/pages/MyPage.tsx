import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Settings } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../hooks/useAuth";

interface MyPageProps {
  onNavigate: (page: string) => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  const { token, userInfo } = useAuth();
  const [randomMovie, setRandomMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // 추천 영화 가져오기
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get("http://localhost:8080/api/movies/random", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setRandomMovie(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 403) onNavigate("login");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // 북마크 가져오기
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setBookmarks(res.data.map((b: any) => String(b.movieId))))
      .catch(err => console.error(err));
  }, [token]);

  // 북마크 추가/삭제
  const toggleBookmark = async (movieId: number) => {
    if (!token) return;

    const isBookmarked = bookmarks.includes(String(movieId));
    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:8080/api/bookmarks/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(bookmarks.filter(id => id !== String(movieId)));
      } else {
        await axios.post(
          `http://localhost:8080/api/bookmarks`,
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarks([...bookmarks, String(movieId)]);
      }
    } catch (err) {
      console.error(err);
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
          </div>
        </div>
      </div>

      {/* 프로필 + 추천 영화 카드 */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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

        <Card>
          <CardHeader>
            <CardTitle>추천 영화</CardTitle>
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
                  variant={bookmarks.includes(String(randomMovie.movieIdx)) ? "destructive" : "outline"}
                >
                  {bookmarks.includes(String(randomMovie.movieIdx)) ? "북마크 해제" : "북마크"}
                </Button>
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
        </Tabs>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { ArrowLeft, Settings } from "lucide-react";
// import { ImageWithFallback } from "../components/figma/ImageWithFallback";
// import { useAuth } from "../hooks/useAuth";

// interface MyPageProps {
//   onNavigate: (page: string) => void;
// }

// export function MyPage({ onNavigate }: MyPageProps) {
//   const { token, userInfo } = useAuth();
//   const [randomMovie, setRandomMovie] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [bookmarks, setBookmarks] = useState<string[]>([]);

//   // 랜덤 영화 가져오기
//   useEffect(() => {
//     if (!token) return;

//     setLoading(true);
//     axios
//       .get("http://localhost:8080/api/movies/random", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => setRandomMovie(res.data))
//       .catch(err => {
//         console.error(err);
//         if (err.response?.status === 403) {
//           onNavigate("login");
//         }
//       })
//       .finally(() => setLoading(false));
//   }, [token]);

//   // 북마크 가져오기
//   useEffect(() => {
//     if (!token) return;

//     axios
//       .get("http://localhost:8080/api/bookmarks", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => setBookmarks(res.data.map((b: any) => b.movieId)))
//       .catch(err => console.error(err));
//   }, [token]);

//   const toggleBookmark = async (movieId: number) => {
//     if (!token) return;

//     const isBookmarked = bookmarks.includes(String(movieId));
//     try {
//       if (isBookmarked) {
//         await axios.delete(`http://localhost:8080/api/bookmarks/${movieId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarks(bookmarks.filter(id => id !== String(movieId)));
//       } else {
//         await axios.post(
//           `http://localhost:8080/api/bookmarks`,
//           { movieId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setBookmarks([...bookmarks, String(movieId)]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* 헤더 */}
//       <div className="bg-card border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={() => onNavigate("main")}>
//             <ArrowLeft className="w-4 h-4 mr-2" /> 메인으로 돌아가기
//           </Button>
//           <div className="flex items-center space-x-4">
//             <Button variant="outline" size="sm">
//               <Settings className="w-4 h-4 mr-2" /> 설정
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* 프로필 + 추천 영화 카드 */}
//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//         <Card>
//           <CardContent className="p-8 flex items-center space-x-6">
//             <Avatar className="w-24 h-24">
//               <AvatarImage src={userInfo?.profileImage || ""} />
//               <AvatarFallback className="text-xl">{userInfo?.username?.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">{userInfo?.username}님</h1>
//               <p className="text-muted-foreground">오늘의 추천 영화</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>추천 영화</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center">
//             {loading && <p>Loading...</p>}
//             {!loading && randomMovie && (
//               <div className="space-y-4">
//                 <ImageWithFallback
//                   src={randomMovie.posterPath ? `https://image.tmdb.org/t/p/w500${randomMovie.posterPath}` : "/fallback-image.png"}
//                   alt={randomMovie.title || "추천 영화"}
//                   className="w-[300px] rounded-lg mx-auto"
//                 />
//                 <h2 className="text-lg font-semibold">{randomMovie.title || "추천 영화 없음"}</h2>
//                 <Button
//                   size="sm"
//                   onClick={() => toggleBookmark(randomMovie.movieIdx)}
//                   variant={bookmarks.includes(String(randomMovie.movieIdx)) ? "destructive" : "outline"}
//                 >
//                   {bookmarks.includes(String(randomMovie.movieIdx)) ? "북마크 해제" : "북마크"}
//                 </Button>
//               </div>
//             )}
//             {!loading && !randomMovie && <p>추천 영화가 없습니다.</p>}
//           </CardContent>
//         </Card>

//         {/* Tabs UI */}
//         <Tabs defaultValue="watched" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="watched">시청한 영화</TabsTrigger>
//             <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
//             <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
//             <TabsTrigger value="settings">계정 설정</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
