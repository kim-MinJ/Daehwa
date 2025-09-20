import { useEffect, useState } from "react";
import axios from "axios";
import { HorizontalScrollList } from "@/components/HorizontalScrollList";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UiMovie } from "@/components/types";
import { useFeeling } from "@/context/FeelingContext";

// 🔹 감정 매핑 (동의어 → 통일)
const normalizeFeeling = (feeling: string): string => {
  const base = feeling.trim();
  const synonymMap: Record<string, string> = {
    "슬프다": "슬픔",
    "슬퍼요": "슬픔",
    "기쁘다": "기쁨",
    "기뻐요": "기쁨",
    "편안하다": "편안함",
    "흥분된다": "흥분됨",
    "짜릿하다": "짜릿함",
    "즐겁다": "즐거움",
    "설렌다": "설렘",
    "심심하다": "심심함",
    "놀랐다": "놀람",
    "화난다": "화남",
  };
  return synonymMap[base] || base;
};

// 🔹 공용 포스터 URL
const getPosterUrl = (path: string | undefined, size: string = "w500") => {
  if (!path || path.trim() === "") return "/fallback.png";
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`;
};

// 🔹 로딩 스켈레톤
function CardSkeleton() {
  return (
    <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden">
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

// 🔹 개별 영화 카드
function MovieCard({ movie, onClick }: { movie: UiMovie; onClick: (m: UiMovie) => void }) {
  return (
    <div className="group cursor-pointer flex-shrink-0 relative" onClick={() => onClick(movie)}>
      <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
        <ImageWithFallback src={getPosterUrl(movie.poster, "w500")} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded-md flex flex-col">
          <div className="font-semibold text-sm line-clamp-1">{movie.title}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Star className="h-3 w-3" />
            <span>{(movie.rating ?? 0).toFixed(1)}</span>
            <span>•</span>
            <span>{movie.year}년</span>
          </div>
          <div className="mt-1 text-[11px] opacity-90">{movie.genres?.join(", ") ?? "기타"}</div>
        </div>
      </div>
    </div>
  );
}

export function FeelingRecommendationSection({ onMovieClick }: { onMovieClick: (m: UiMovie) => void }) {
  const { token } = useAuth();
  const { selectedFeeling, setSelectedFeeling } = useFeeling();

  const [feelings, setFeelings] = useState<string[]>([]);
  const [feelingMovies, setFeelingMovies] = useState<UiMovie[]>([]);
  const [feelingLoading, setFeelingLoading] = useState<boolean>(false);

  // 1) 감정 키워드 목록 로드 (처음 1회)
  useEffect(() => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get("/api/feelings/all", { headers: authHeader })
      .then(res => {
        const raw: string[] = res.data || [];
        const normalized = raw.map(normalizeFeeling);
        const unique = Array.from(new Set(normalized));
        setFeelings(unique.length ? unique : ["편안함", "흥분됨", "슬픔", "즐거움"]);

        // Context에 아직 선택된 감정이 없다면, 랜덤으로 하나 세팅
        if (!selectedFeeling) {
          const list = unique.length ? unique : ["편안함", "흥분됨", "슬픔", "즐거움"];
          const random = list[Math.floor(Math.random() * list.length)];
          setSelectedFeeling(random);
        }
      })
      .catch(() => {
        const fallback = ["편안함", "흥분됨", "슬픔", "즐거움"];
        setFeelings(fallback);
        if (!selectedFeeling) {
          const random = fallback[Math.floor(Math.random() * fallback.length)];
          setSelectedFeeling(random);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // selectedFeeling에 의존하면 무한루프 가능—의도적으로 제외

  // 2) 선택된 감정이 바뀌면 영화 로드
  useEffect(() => {
    if (!selectedFeeling) return;
    const fetch = async () => {
      setFeelingLoading(true);
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const res = await axios.get("/api/feelings", {
          headers: authHeader,
          params: { feelingType: selectedFeeling, count: 10 },
        });
        const movies: UiMovie[] = (res.data || []).map((m: any) => ({
          id: m.movieIdx,
          title: m.title ?? "제목 없음",
          poster: m.posterPath ?? "",
          backdropPath: m.backdropPath ?? "",
          year: m.releaseDate ? Number(String(m.releaseDate).slice(0, 4)) : 0,
          genres: m.genres?.length ? m.genres : ["기타"],
          rating: m.voteAverage ?? 0,
          description: m.overview ?? "",
          releaseDate: m.releaseDate ?? null,
        }));
        const unique = Array.from(new Map(movies.map(m => [m.id, m])).values());
        setFeelingMovies(unique.slice(0, 10));
      } catch (e) {
        setFeelingMovies([]);
      } finally {
        setFeelingLoading(false);
      }
    };
    fetch();
  }, [selectedFeeling, token]);

  return (
    <div>
      {/* 타이틀 */}
      <div className="flex flex-col mb-6">
        <h2 className="text-xl lg:text-2xl font-medium text-gray-900">당신만을 위한 추천</h2>
      </div>

      {/* 감정 뱃지들 */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
        {feelings.map((f) => {
          const isSelected = selectedFeeling === f;
          return (
            <button
              key={f}
              onClick={() => setSelectedFeeling(f)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition
                ${isSelected ? "bg-pink-300 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="w-full h-px bg-gray-200 mb-6" />

      {/* 추천 영화 */}
      {selectedFeeling && (
        <>
          {feelingLoading ? (
            <HorizontalScrollList>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-shrink-0">
                  <CardSkeleton />
                </div>
              ))}
            </HorizontalScrollList>
          ) : (
            <HorizontalScrollList>
              {feelingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
              ))}
            </HorizontalScrollList>
          )}
        </>
      )}
    </div>
  );
}