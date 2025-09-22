// src/components/searchPage/SectionCarousel.tsx
import { Movie } from "@/types/movie";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionProps {
  title: string;
  movies: Movie[];
  subtitle?: string;
  renderMovie: (movie: Movie) => React.ReactNode;
}

export const SectionCarousel = ({ title, movies, subtitle, renderMovie }: SectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-sm lg:text-base font-semibold text-gray-700">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-sm transition">
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button onClick={scrollRight} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-sm transition">
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 mb-6" />

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
        {movies.map((movie, idx) => (
          <div key={movie.movieIdx ?? idx}>{renderMovie(movie)}</div>
        ))}
      </div>
    </div>
  );
};
