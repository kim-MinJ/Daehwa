// src/components/mainPage/SectionCarousel.tsx
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/imageFallback/ImageWithFallback";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { UiMovie } from "@/types/uiMovie";
import LazyLoad from "react-lazyload";

interface SectionProps {
  title: string;
  movies: UiMovie[];
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
  renderMovie, // 추가
}: SectionProps) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-medium text-gray-900">{title}</h2>
      </div>
      <div className="w-full h-px bg-gray-200 mb-6" />
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="group cursor-pointer flex-shrink-0 relative"
            onClick={() => onClick(movie)}
          >
            {renderMovie ? (
              // renderMovie가 있으면 LazyLoad와 함께 사용
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
