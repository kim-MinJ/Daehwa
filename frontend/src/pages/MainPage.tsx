// src/pages/MainPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Info } from "lucide-react";
import { useMovieStore } from "@/store/movieStore";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { UiMovie, mapToUiMovie } from "@/types/uiMovie";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";
import { shuffle } from "@/utils/shuffle";
import { SectionCarousel } from "@/components/mainPage/SectionCarousel";
import { genreMap } from "@/constants/genres";

// 🔹 MovieCard
function MovieCard({ movie, onClick }: { movie: UiMovie; onClick: (m: UiMovie) => void }) {
  const koreanGenres = movie.genre
    .split(",")
    .map((g) => genreMap[g.trim()] || g.trim())
    .join(", ");

  return (
    <div
      className="group cursor-pointer flex-shrink-0 w-48 transition-transform duration-300 hover:scale-105"
      onClick={() => onClick(movie)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
        <ImageWithFallback
          src={getPosterUrl(movie.poster, "w500")}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white rounded-lg">
          <div className="font-semibold line-clamp-1">{movie.title}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{movie.year}년</span>
          </div>
          <div className="mt-1 text-xs line-clamp-2">{koreanGenres}</div>
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  const navigate = useNavigate();
  const movieStore = useMovieStore();

  const [latestMovies, setLatestMovies] = useState<UiMovie[]>([]);
  const [weeklyMovies, setWeeklyMovies] = useState<UiMovie[]>([]);
  const [nostalgicMovies, setNostalgicMovies] = useState<UiMovie[]>([]);
  const [featured, setFeatured] = useState<UiMovie | undefined>();

  // 🔹 초기 데이터 fetch
  useEffect(() => {
    let mounted = true;

    const initData = async () => {
      try {
        const latest = await movieStore.fetchFirstPage(20);
        const shuffledLatest = shuffle(latest.map(mapToUiMovie));
        if (mounted) setLatestMovies(shuffledLatest);

        const weekly = await movieStore.fetchWeeklyMovies();
        if (mounted) setWeeklyMovies(weekly.map(mapToUiMovie));

        const nostalgic = await movieStore.fetchNostalgicMovies();
        const shuffledNostalgic = shuffle(nostalgic.map(mapToUiMovie));
        if (mounted) setNostalgicMovies(shuffledNostalgic);

        movieStore.fetchAllBackground();

        // 🔹 Featured 한 번만 설정
        if (mounted) {
          if (shuffledLatest.length > 0) setFeatured(shuffledLatest[0]);
          else if (weekly.length > 0) setFeatured(mapToUiMovie(weekly[0]));
          else if (shuffledNostalgic.length > 0) setFeatured(shuffledNostalgic[0]);
        }
      } catch (err) {
        console.error("MainPage 초기화 에러:", err);
      }
    };

    initData();
    return () => {
      mounted = false;
    };
  }, []);

  const onMovieClick = (m: UiMovie) => navigate(`/movie/${m.id}`);

  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {/* Featured Movie */}
        {featured && (
          <div
            className="relative h-[85vh] mb-12 cursor-pointer"
            onClick={() => onMovieClick(featured)}
          >
            <ImageWithFallback
              src={getPosterUrl(featured.backdropPath ?? featured.backdropPath, "original")}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
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
                    <span>
                      {featured.genre
                        .split(",")
                        .map((g) => genreMap[g.trim()] || g.trim())
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <button className="flex items-center bg-white text-black hover:bg-white/90 px-12 py-4 text-xl font-semibold shadow-lg rounded-xl">
                      <Info className="h-6 w-6 mr-3" />
                      상세 정보
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 space-y-16 pb-16">
          <SectionCarousel
            title="최신 영화"
            subtitle="이거? 지금 볼만한데? 도전? ㄱ?"
            movies={latestMovies}
            onClick={onMovieClick}
            renderMovie={(movie) => <MovieCard movie={movie} onClick={onMovieClick} />}
          />
          <SectionCarousel
            title="이번주 인기 순위"
            subtitle="지금 이거 놓치면 후회합니다?"
            movies={weeklyMovies}
            onClick={onMovieClick}
            renderMovie={(movie) => <MovieCard movie={movie} onClick={onMovieClick} />}
          />
          <SectionCarousel
            title="추억의 영화"
            subtitle="옛날 그 감성, 그 기분 지금 다시 느껴보시는건 어떨까요?"
            movies={nostalgicMovies}
            onClick={onMovieClick}
            renderMovie={(movie) => <MovieCard movie={movie} onClick={onMovieClick} />}
          />
        </section>
      </main>
    </div>
  );
}
