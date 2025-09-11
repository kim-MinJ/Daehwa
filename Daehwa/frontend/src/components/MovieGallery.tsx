import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Movie {
  id: number;
  title: string;
  year: string;
  posterUrl: string;
}

interface MovieGalleryProps {
  title: string;
  movies: Movie[];
}

export function MovieGallery({ title, movies }: MovieGalleryProps) {
  return (
    <Card className="p-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="w-20">
            포스터
          </Button>
          <Button variant="outline" size="sm" className="w-20">
            영화 제목
          </Button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg">{title}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="space-y-2">
            <ImageWithFallback 
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="text-center space-y-1">
              <p className="text-sm">{movie.title}</p>
              <p className="text-xs text-muted-foreground">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}