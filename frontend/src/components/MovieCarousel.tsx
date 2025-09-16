import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Movie } from '../types/movie';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  showMoreButton?: boolean;
}

export function MovieCarousel({ title, movies, onMovieClick, showMoreButton = true }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollAmount = 320; // 카드 너비 + 간격
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="space-y-4">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {movies.length}
          </Badge>
        </div>
        {showMoreButton && (
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            더보기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="relative group">
        {/* 스크롤 버튼 */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* 영화 목록 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 cursor-pointer group/card"
              onClick={() => onMovieClick(movie)}
            >
              <div className="relative mb-3">
                <div className="relative w-full h-72 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors" />
                </div>

                {/* 평점 배지 */}
                <div className="absolute top-2 right-2">
                  <Badge variant={movie.rating >= 8 ? "default" : "secondary"} className="bg-black/70 text-white text-xs">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {movie.rating}
                  </Badge>
                </div>
              </div>

              {/* 영화 정보 */}
<div className="space-y-1">
  <h4 className="text-sm line-clamp-2 group-hover/card:text-blue-600 transition-colors">
    {movie.title}
  </h4>
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <span>{movie.year}</span>
    <span>•</span>
    <span>
      {Array.isArray(movie.genre)
        ? movie.genre.slice(0, 2).join(" / ") + (movie.genre.length > 2 ? " …" : "")
        : movie.genre}
    </span>
  </div>
  <div className="flex items-center gap-1 text-xs text-muted-foreground">
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    <span>{movie.rating}</span>
  </div>
</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
