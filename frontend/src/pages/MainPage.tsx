// src/pages/MainPage.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Info } from "lucide-react";
import { useMovieStore } from "@/store/movieStore";
import { useTrailersStore } from "@/store/trailersStore";
import { useCreditsStore } from "@/store/creditsStore";
import { getPosterUrl } from "@/utils/getPosterUrl";
import LoadingSpinner from "@/components/public/LoadingSpinner";
import { SectionCarousel } from "@/components/mainPage/SectionCarousel";
import { UiMovie, mapToUiMovie } from "@/types/uiMovie";
import { genreMap } from "@/constants/genres";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";

export default function MainPage() {
  const navigate = useNavigate();
  const { movies } = useMovieStore();

  const onMovieClick = (m: UiMovie) => navigate(`/movie/${m.id}`);

  // -----------------------------
  // 1️⃣ movies -> UiMovie 변환 + 중복 제거
  // -----------------------------
  const uiMovies: UiMovie[] = useMemo(() => {
    const uniqueMovies = Array.from(new Map(movies.map(m => [m.movieIdx, m])).values());
    return uniqueMovies.map((m) => {
      const uiMovie = mapToUiMovie(m);
      const genreString = m.genres?.map((g) => genreMap[g] ?? g).join(", ") ?? "기타";
      return { ...uiMovie, genre: genreString };
    });
  }, [movies]);

  // -----------------------------
  // 2️⃣ 섹션별 필터링 / 무작위 추출
  // -----------------------------
  const weeklyTop10 = useMemo(() => uiMovies.slice(0, 10), [uiMovies]);
  const personalizedTop3 = useMemo(() => [...uiMovies].sort(() => Math.random() - 0.5).slice(0, 3), [uiMovies]);
  const reviewEvent3 = useMemo(() => [...uiMovies].sort(() => Math.random() - 0.5).slice(3, 6), [uiMovies]);
  const latest6 = useMemo(() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const filtered = uiMovies.filter((m) => m.releaseDate && new Date(m.releaseDate) >= sixMonthsAgo);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [uiMovies]);
  const oldPopular = useMemo(() => {
    const filtered = uiMovies.filter((m) => m.year > 1900 && m.year < 2000);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [uiMovies]);

  // -----------------------------
  // 3️⃣ Featured Movie
  // -----------------------------
  const featured = useMemo(() => {
    if (weeklyTop10.length > 0) {
      const randomIndex = Math.floor(Math.random() * weeklyTop10.length);
      return weeklyTop10[randomIndex];
    }
    return personalizedTop3[0] ?? latest6[0];
  }, [weeklyTop10, personalizedTop3, latest6]);

  // -----------------------------
  // 4️⃣ 백그라운드 fetch
  // -----------------------------
  useMemo(() => {
    if (!uiMovies.length) return;

    const movieIds = uiMovies.map((m) => m.id);
    const trailersStore = useTrailersStore.getState();
    const creditsStore = useCreditsStore.getState();

    trailersStore.fetchAllBackground(movieIds);
    creditsStore.fetchAllBackground(movieIds);

    return () => {
      trailersStore.stopBackgroundFetch();
      creditsStore.stopBackgroundFetch();
    };
  }, [uiMovies]);

  if (!uiMovies.length) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {featured && (
          <>
            {/* Featured Movie */}
            <div
              className="relative h-[85vh] mb-8 cursor-pointer"
              onClick={() => onMovieClick(featured)}
            >
              <ImageWithFallback
                src={getPosterUrl(featured.poster, "w500")}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-full">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-8 lg:pb-16">
                  <div className="max-w-lg text-white">
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">{featured.title}</h1>
                    {featured.description && (
                      <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6">
                        {featured.description.slice(0, 200)}...
                      </p>
                    )}
                    <div className="flex items-center gap-4 mb-8 text-white/80">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">{featured.rating.toFixed(1)}</span>
                      </div>
                      <span>•</span>
                      <span>{featured.year}년</span>
                      <span>•</span>
                      <span>{featured.genre}</span>
                    </div>
                    <div className="flex justify-start">
                      <Button className="bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg">
                        <Info className="h-6 w-6 mr-3" />
                        상세 정보
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <section className="max-w-7xl mx-auto px-8 lg:px-16 pt-[100px] space-y-[100px] pb-16">
              <SectionCarousel
                title="당신만을 위한 추천"
                movies={personalizedTop3}
                onClick={onMovieClick}
                badge="맞춤 추천"
              />
              <SectionCarousel
                title="최신 영화"
                movies={latest6}
                onClick={onMovieClick}
                badge="NEW"
              />
              <SectionCarousel
                title="이번주 인기 순위"
                movies={weeklyTop10}
                onClick={onMovieClick}
                rank
              />
              <SectionCarousel
                title="추억의 영화"
                movies={oldPopular}
                onClick={onMovieClick}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
