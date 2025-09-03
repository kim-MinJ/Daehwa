// src/components/SimilarMoviesSection.tsx
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ 추가

/** App.tsx에서 넘기는 유사 영화 아이템 타입 */
export type SimilarMovie = {
  id: number;
  title: string;
  posterUrl?: string;
  rating?: number;   // 0~5점 (App에서 10점 → 5점 변환)
  year?: string;     // "2019"
  genre?: string[];  // 선택
  matchReason?: string; // 선택(“같은 감독” 등)
};

export function SimilarMoviesSection({
  movies = [],
  onSelect, // ✅ 선택: 외부에서 클릭 인터셉트 가능
}: {
  movies?: SimilarMovie[];
  onSelect?: (movie: SimilarMovie) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayMovies = movies;
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, displayMovies.length - itemsPerPage);

  const goToPrevious = () => setCurrentIndex((v) => Math.max(0, v - 1));
  const goToNext = () => setCurrentIndex((v) => Math.min(maxIndex, v + 1));

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2>비슷한 키워드 영화 추천</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="w-8 h-8 p-0"
              aria-label="이전"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="w-8 h-8 p-0"
              aria-label="다음"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {displayMovies.length === 0 ? (
          <div className="text-sm text-muted-foreground">추천 영화가 없습니다.</div>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {displayMovies.map((m) => {
                const cardInner = (
                  <Card className="p-0 hover:shadow-md transition">
                    <div className="relative overflow-hidden rounded-lg">
                      {m.posterUrl ? (
                        <ImageWithFallback
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-64 bg-muted" />
                      )}

                      {m.matchReason && (
                        <Badge className="absolute top-2 left-2 text-xs bg-primary/90">
                          {m.matchReason}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 p-3">
                      <h4 className="line-clamp-1">{m.title}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{m.year || "-"}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{m.rating?.toFixed?.(1) ?? (m.rating ?? 0)}</span>
                        </div>
                      </div>
                      {m.genre?.length ? (
                        <div className="flex gap-1">
                          {m.genre.slice(0, 2).map((g, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                );

                return (
                  <div key={m.id} className="flex-shrink-0 w-1/4 min-w-0">
                    {/* ✅ 카드 전체를 링크로 감싸 상세 페이지로 이동 */}
                    {onSelect ? (
                      <button
                        type="button"
                        className="group w-full text-left cursor-pointer"
                        onClick={() => onSelect(m)}
                        aria-label={`${m.title} 상세 보기`}
                      >
                        {cardInner}
                      </button>
                    ) : (
                      <Link
                        to={`/movie/${m.id}`}
                        className="group block cursor-pointer"
                        aria-label={`${m.title} 상세 페이지로 이동`}
                        prefetch="intent" // react-router v6.22+ 지원 시
                      >
                        {cardInner}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
