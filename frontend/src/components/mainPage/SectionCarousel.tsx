// src/components/mainPage/SectionCarousel.tsx
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { UiMovie } from "@/types/uiMovie";
import LazyLoad from "react-lazyload";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionProps {
  title: React.ReactNode;
  movies: UiMovie[];
  subtitle?: React.ReactNode;
  onClick: (m: UiMovie) => void;
  badge?: string;
  rank?: boolean;
  renderMovie?: (movie: UiMovie) => JSX.Element;
}

export const SectionCarousel = ({
  title,
  movies,
  onClick,
  badge,
  rank,
  renderMovie,
  subtitle,
}: SectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative">
      {/* 제목 + 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <span className="text-sm lg:text-base font-bold text-gray-700">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-sm transition"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-sm transition"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 mb-6" />

      {/* 영화 목록 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="group cursor-pointer flex-shrink-0 relative"
            onClick={() => onClick(movie)}
          >
            {renderMovie ? (
              <LazyLoad height={180} offset={100} once>
                {renderMovie(movie)}
              </LazyLoad>
            ) : (
              <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                <ImageWithFallback
                  src={getPosterUrl(movie.poster, "w500")}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 text-white text-xs">{badge}</Badge>
                  </div>
                )}
                {rank && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
