import { TrendingUp } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { TrendingMovie } from '../types/movie';

interface TrendingSectionProps {
  movies: TrendingMovie[];
  onMovieClick: (movie: TrendingMovie) => void;
}

export function TrendingSection({ movies, onMovieClick }: TrendingSectionProps) {
  return (
    <section id="trending" className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">지금 뜨는 영화</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.slice(0, 6).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => onMovieClick(movie)}
              isTrending={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}