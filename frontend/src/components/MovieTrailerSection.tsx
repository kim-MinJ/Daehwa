import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, Eye } from "lucide-react";

/** App.tsx에서 넘기는 예고편 아이템 타입 */
export type TrailerItem = {
  id: string | number;
  name: string;
  url: string;         // 유튜브 등 실제 시청 URL
  thumbnail?: string;  // 썸네일 URL(선택)
};

export function MovieTrailerSection({
  trailers = [],
}: {
  trailers?: TrailerItem[];
}) {
  const displayTrailers = trailers;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            예고편 & 영상
          </h2>
          <Button variant="outline" size="sm">
            전체 보기
          </Button>
        </div>

        {displayTrailers.length === 0 ? (
          <div className="text-sm text-muted-foreground">예고편 정보가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayTrailers.map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  {t.thumbnail ? (
                    <ImageWithFallback
                      src={t.thumbnail}
                      alt={t.name}
                      className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-muted" />
                  )}

                  {/* 재생 오버레이 */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h4 className="text-sm line-clamp-1">{t.name}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">Trailer</Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {/* 조회수 정보가 없으니 표시만 */}
                      -
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
