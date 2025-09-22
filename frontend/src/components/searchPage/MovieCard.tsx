// src/components/searchPage/MovieCard.tsx
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../imageFallback/ImageWithFallback";
import { Movie } from "@/types/movie";
import { genreMap } from "@/constants/genres";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const koreanGenres = (movie.genres || [])
    .map((g) => genreMap[g] || g)
    .join(", ");

  return (
    <div
      className="group cursor-pointer w-48 flex-shrink-0 transition-transform duration-300 hover:scale-105"
      onClick={() => navigate(`/movie/${movie.movieIdx}`)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
        <ImageWithFallback
          src={movie.posterPath ? getPosterUrl(movie.posterPath) : "/default-poster.png"}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white rounded-lg">
          <div className="font-semibold line-clamp-1">{movie.title}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{movie.voteAverage?.toFixed(1) || "0.0"}</span>
            <span>•</span>
            <span>{movie.releaseDate?.split("-")[0]}년</span>
          </div>
          <div className="mt-1 text-xs line-clamp-2">{koreanGenres}</div>
        </div>
      </div>
    </div>
  );
};
