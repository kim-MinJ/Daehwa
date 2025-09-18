// src/pages/MainPage.tsx
import { useEffect, useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Info } from "lucide-react";
import { useMovieStore } from "@/store/movieStore";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { SectionCarousel } from "@/components/mainPage/SectionCarousel";
import { UiMovie, mapToUiMovie } from "@/types/uiMovie";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";

// 🔹 Skeleton 컴포넌트
function MovieSkeleton({ width, height }: { width: string; height: string }) {
  return <div className={`${width} ${height} bg-gray-200 animate-pulse rounded-md`} />;
}

export default function MainPage() {
  const navigate = useNavigate();
  const movieStore = useMovieStore();

  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 🔹 UI용 데이터
  const uiMovies: UiMovie[] = useMemo(
    () => movieStore.movies.map(mapToUiMovie),
    [movieStore.movies]
  );

  const onMovieClick = (m: UiMovie) => navigate(`/movie/${m.id}`);

  // 🔹 Featured / Sections
  const weeklyTop10 = useMemo(() => uiMovies.slice(0, 10), [uiMovies]);
  const personalizedTop3 = useMemo(
    () => [...uiMovies].sort(() => Math.random() - 0.5).slice(0, 3),
    [uiMovies]
  );
  const latest6 = useMemo(
    () => [...uiMovies].sort(() => Math.random() - 0.5).slice(0, 6),
    [uiMovies]
  );

  const featured = useMemo(() => {
    if (weeklyTop10.length > 0)
      return weeklyTop10[Math.floor(Math.random() * weeklyTop10.length)];
    return personalizedTop3[0] ?? latest6[0];
  }, [weeklyTop10, personalizedTop3, latest6]);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(true);
  }, []);

  const renderMovie = useCallback(
    (movie: UiMovie, size: "w154" | "w92") => (
      <ImageWithFallback
        src={getPosterUrl(movie.poster, size)}
        alt={movie.title}
        className={`${
          size === "w154" ? "w-36 h-52 object-cover" : "w-24 h-36 object-cover"
        } transition-opacity duration-700`}
        onLoad={handleImageLoad}
        placeholder={
          <MovieSkeleton
            width={size === "w154" ? "w-36" : "w-24"}
            height={size === "w154" ? "h-52" : "h-36"}
          />
        }
        loading="eager"
      />
    ),
    [handleImageLoad]
  );

  if (!uiMovies.length) {
    // 초기 Skeleton UI
    return (
      <div className="min-h-screen px-8 lg:px-16 py-12 space-y-12">
        <MovieSkeleton width="w-full" height="h-[85vh]" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 overflow-x-auto">
              {Array.from({ length: 5 }).map((_, j) => (
                <MovieSkeleton key={j} width="w-36" height="h-52" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                className="w-full h-full object-cover transition-opacity duration-700"
                placeholder={<MovieSkeleton width="w-full" height="h-[85vh]" />}
                onLoad={handleImageLoad}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-full">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 pb-8 lg:pb-16">
                  <div className="max-w-lg text-white">
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                      {featured.title}
                    </h1>
                    {featured.description && (
                      <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-6">
                        {featured.description.slice(0, 200)}...
                      </p>
                    )}
                    <div className="flex items-center gap-4 mb-8 text-white/80">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">
                          {featured.rating.toFixed(1)}
                        </span>
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
                renderMovie={(movie) => renderMovie(movie, "w154")}
              />
              <SectionCarousel
                title="최신 영화"
                movies={latest6}
                onClick={onMovieClick}
                badge="NEW"
                renderMovie={(movie) => renderMovie(movie, "w154")}
              />
              <SectionCarousel
                title="이번주 인기 순위"
                movies={weeklyTop10}
                onClick={onMovieClick}
                rank
                renderMovie={(movie) => renderMovie(movie, "w154")}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
