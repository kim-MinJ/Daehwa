import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../imageFallback/ImageWithFallback';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  genreMap: Record<string, string>;
}

export const MovieCard = ({ movie, genreMap }: MovieCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer" onClick={() => navigate(`/movie/${movie.movieIdx}`)}>
      <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
        <ImageWithFallback
          src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/default-poster.png'}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-2 font-semibold text-gray-800 line-clamp-1">{movie.title}</h3>
      <p className="text-gray-600 text-xs">
        {movie.releaseDate?.split('-')[0]}년 • {(movie.genres || []).map(g => genreMap[g] || g).join(', ')}
      </p>
    </div>
  );
};
