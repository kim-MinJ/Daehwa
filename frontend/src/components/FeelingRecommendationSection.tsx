import { useEffect, useState } from "react";
import axios from "axios";
import { HorizontalScrollList } from "@/components/HorizontalScrollList";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UiMovie } from "@/types/uiMovie";
import { useFeeling } from "@/context/FeelingContext";
import { normalizeFeeling } from "@/components/utils/FeelingDictionary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FEELING_MENTIONS: Record<string, string> = {
  "슬픔": "위로가 되는 이야기😢",
  "기쁨": "즐겁고 행복한 순간😄",
  "즐거움": "함께 웃을 수 있는 순간🎉",
  "흥분됨": "짜릿한 액션이 필요할 때!⚡",
  "짜릿함" : "짜릿한 액션이 필요할 때!🥳",
  "설렘" : "두근두근 설레고 싶을 때💖",
  "화남" : "박진감 넘치는 액션과 모험이 필요할 때😡",
  "심심함" : "심심할 때 가볍게 즐길 이야기😴",
  "놀람" : "예상을 뒤엎는 반전이 필요할 때😱",
  "피곤함": "지친 하루에 편히 볼 수 있는 영화😪",
  "편안함": "마음을 편안하게 해주는 이야기🛋️",
  "감동적임": "진한 감동이 필요할 때😭",
  "긴장됨": "손에 땀을 쥐게 하는 순간😬",
  "생각남": "추억과 회상이 필요할 때🤔",
  // 필요에 따라 계속 추가
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
          <div className="mt-1 text-[11px] opacity-90">{movie.genre ?? "기타"}</div>
        </div>
      </div>
    </div>
  );
}

export function FeelingRecommendationSection({
  onMovieClick,
  showFeelingButtons = true,   // 기본값 true
}: { 
  onMovieClick: (m: UiMovie) => void; 
  showFeelingButtons?: boolean;
}) {
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
      const normalized = raw.map(normalizeFeeling); // ✅ 공용 함수 사용
      const unique = Array.from(new Set(normalized));
      setFeelings(unique.length ? unique : ["편안함", "흥분됨", "슬픔", "즐거움"]);

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
      <div className="flex items-center gap-3">
        <h2 className="text-xl lg:text-2xl font-medium text-gray-900">
          당신만을 위한 추천
        </h2>

        {/* 감정 멘트 + 말풍선 */}
        {selectedFeeling && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-pink-500 font-semibold cursor-pointer">
                  {FEELING_MENTIONS[selectedFeeling] ?? ""}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="p-4 bg-gradient-to-br from-pink-50 to-white border border-pink-200 
                           shadow-xl rounded-xl flex gap-2 flex-wrap max-w-[280px]"
              >
                {feelings.map((f) => {
                  const isSelected = selectedFeeling === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFeeling(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition
                        ${
                          isSelected
                            ? "bg-pink-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                        }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>

    {/* 추천 영화 리스트 */}
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