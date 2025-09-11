import { X, Star, Clock, Calendar, Globe, Heart, Share2, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Movie } from '../types/movie';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Hero Section */}
          <div className="relative h-96 overflow-hidden">
            <ImageWithFallback
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                  {movie.titleEn && (
                    <p className="text-xl text-gray-200 mb-4">{movie.titleEn}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{movie.rating}</span>
                      <span className="text-gray-300">/ 10</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duration}분</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{movie.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button variant="default" size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    예고편
                  </Button>
                  <Button variant="outline" size="icon" className="text-white border-white">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-white border-white">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Plot */}
            <section>
              <h3 className="text-lg font-semibold mb-3">줄거리</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.plot}</p>
            </section>
            
            {/* Cast & Crew */}
            <section>
              <h3 className="text-lg font-semibold mb-3">출연진 및 제작진</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">감독</h4>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">주요 출연진</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor, index) => (
                      <Badge key={index} variant="outline">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Reviews */}
            {movie.reviews && movie.reviews.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-3">관람평</h3>
                <div className="space-y-4">
                  {movie.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          👍 {review.likes}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}