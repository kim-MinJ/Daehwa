import { useState } from "react";
import { MovieDetailCard } from "./components/MovieDetailCard";
import { RelatedArticlesSidebar } from "./components/RelatedArticlesSidebar";
import { MovieOSTSection } from "./components/MovieOSTSection";
import { MovieTrailerSection } from "./components/MovieTrailerSection";
import { SimilarMoviesSection } from "./components/SimilarMoviesSection";
import { MyPage } from "./components/MyPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("main");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === "main") {
      setCurrentPage("main");
    } else if (page === "login") {
      setCurrentPage("login");
      if (currentPage === "main") {
        setIsLoggedIn(false);
      }
    } else if (page === "mypage") {
      setCurrentPage("mypage");
      setIsLoggedIn(true);
    }
  };

  // 로그인 페이지
  if (currentPage === "login") {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // 마이페이지
  if (currentPage === "mypage") {
    return <MyPage onNavigate={handleNavigate} />;
  }

  // 메인 페이지
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <Header onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
      
      {/* 메인 컨텐츠 */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 좌측 메인 컨텐츠 영역 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 영화 상세 정보 */}
              <section>
                <MovieDetailCard 
                  title="어벤져스: 엔드게임"
                  year="2019"
                  rating="12세 이상 관람가"
                  genre={["액션", "어드벤처", "드라마", "SF"]}
                  director="안소니 루소, 조 루소"
                  cast={["로버트 다우니 주니어", "크리스 에반스", "마크 러팔로", "크리스 헴스워스", "스칼릿 요한슨"]}
                  runtime="181분"
                  description="타노스에 의해 절반의 생명체가 사라진 지 5년 후, 남은 어벤져스 멤버들이 시간 여행을 통해 인피니티 스톤을 되찾아 사라진 사람들을 되돌리려는 계획을 세운다. 각자의 과거로 돌아가 스톤을 수집하는 과정에서 예상치 못한 위험과 희생이 따르게 되는데..."
                  userRating={4.7}
                />
              </section>
              
              {/* OST 섹션 */}
              <section>
                <MovieOSTSection />
              </section>
              
              {/* 예고편 섹션 */}
              <section>
                <MovieTrailerSection />
              </section>
              
              {/* 비슷한 영화 추천 섹션 */}
              <section>
                <SimilarMoviesSection />
              </section>
            </div>
            
            {/* 우측 사이드바 */}
            <div className="lg:col-span-1">
              <RelatedArticlesSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
