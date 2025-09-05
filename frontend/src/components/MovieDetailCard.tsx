// src/components/MovieDetailCard.tsx
import React from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Star,
  Clock,
  Calendar,
  UserRound,
  Share2,
  Heart,
} from "lucide-react";

type Props = {
  title: string;
  year?: string;
  genre?: string[];
  director?: string;
  runtime?: string;
  description?: string;
  posterUrl?: string;
  userRating?: number; // 0~5 (TMDB 10점 → 5점 환산값)
  movieId?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;

  voteCount?: number;
  ageText?: string;

  onRate?: () => void;
  onShare?: () => void;

  clampLines?: 3 | 4 | 5;
  fullOverviewAnchorId?: string;
};

export function MovieDetailCard({
  title,
  year,
  genre = [],
  director,
  runtime,
  description,
  posterUrl,
  userRating = 0,
  isFavorite,
  onToggleFavorite,
  voteCount,
  ageText,
  onRate,
  onShare,
  clampLines = 3,
  fullOverviewAnchorId = "full-overview",
}: Props) {
  const tenScale = Math.round(userRating * 20) / 10;

  const handleRate = () =>
    onRate ? onRate() : alert("평가하기 기능은 준비 중입니다.");

  const handleShare = () => {
    if (onShare) return onShare();
    const url = window.location.href;
    if ((navigator as any).share) {
      (navigator as any).share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => alert("링크를 복사했어요."));
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 포스터 */}
        <div className="w-full md:w-[260px] shrink-0">
          <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-100">
            {posterUrl ? (
              <ImageWithFallback
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* 정보 */}
        <div className="flex-1">
          {/* 상단 뱃지들 */}
          <div className="flex items-center gap-2 mb-2 sm:px-4 mb-4 space-y-2">
            {year && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200">
                {year}년 작품
              </span>
            )}
            {genre.slice(0, 3).map((g) => (
              <span
                key={g}
                className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-gray-50 text-gray-600 ring-1 ring-gray-200 sm:px-4"
              >
                {g}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 sm:px-4 mb-4 space-y-2">
            {title}
          </h1>

          {/* 감독 */}
          {director && (
            <div className="mb-3 text-[15px] text-gray-700 sm:px-4" >
              감독: <span className="font-medium text-gray-900">{director}</span>
            </div>
          )}

          {/* ===================== 메타 두 줄 정렬 ===================== */}
          <div className="mb-4 space-y-2">
            {/* 1행: 평점(좌) / 상영시간(우) */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:px-4 mb-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 ">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-400 " />
                <span className="font-semibold text-gray-900 ">
                  {tenScale.toFixed(1)}
                </span>
                {typeof voteCount === "number" && (
                  <span className="text-gray-500">
                    ({voteCount.toLocaleString()}명 평가)
                  </span>
                )}
              </div>

              {runtime && (
                <div className="inline-flex items-center gap-1.5 text-gray-700 sm:px-30">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>{runtime}</span>
                </div>
              )}
            </div>

            {/* 2행: 개봉일(좌) / 관람가(우) */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:px-4 mb-4 space-y-2">
              {year && (
                <div className="inline-flex items-center gap-1.5 text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span>{year}년 개봉</span>
                </div>
              )}
              {ageText && (
                <div className="inline-flex items-center gap-1.5 text-gray-700 sm:px-37">
                  <UserRound className="h-4 w-4 text-gray-600" />
                  <span>{ageText}</span>
                </div>
              )}
            </div>
          </div>
          {/* ========================================================== */}

          {/* 줄거리 – 짧게(클램프) */}
          {description && (
            <div className="space-y-2">
              <div className="font-semibold text-[18px] text-sm text-gray-800 sm:px-4">줄거리</div>
              <p
                className={`text-gray-800 leading-7 sm:px-4 ${
                  clampLines === 5
                    ? "line-clamp-5"
                    : clampLines === 4
                    ? "line-clamp-4"
                    : "line-clamp-3"
                }`}
              >
                {description}
              </p>
              <a
                href={`#${fullOverviewAnchorId}`}
                className="inline-block text-sm text-primary hover:underline sm:px-4"
              >
                줄거리 전체 보기
              </a>
            </div>
          )}

          {/* 액션 바 */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRate}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border shadow-sm bg-white hover:bg-gray-50"
            >
              <Star className="h-4 w-4" />
              평가하기
            </button>

            <button
              type="button"
              onClick={onToggleFavorite}
              className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg border shadow-sm ${
                isFavorite
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "찜완료" : "찜하기"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border shadow-sm bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              공유하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailCard;
