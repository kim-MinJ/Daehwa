import { MovieCard } from './SearchCard';
import { Movie } from '@/types/movie';
import { Button } from '../ui/button';

interface MovieListProps {
  movies: Movie[];
  genreMap: Record<string, string>;
  displayCount: number;
  setDisplayCount: (count: number) => void;
  viewMode: 'grid' | 'list';
}

export const MovieList = ({ movies, genreMap, displayCount, setDisplayCount, viewMode }: MovieListProps) => (
  <>
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
      {movies.slice(0, displayCount).map((movie, idx) => (
        <MovieCard key={`${movie.movieIdx}-${idx}`} movie={movie} genreMap={genreMap} />
      ))}
    </div>
    {displayCount < movies.length && (
      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="px-8 bg-white border-gray-400 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => setDisplayCount(displayCount + 12)}
        >
          더 많은 결과 보기
        </Button>
      </div>
    )}
  </>
);
