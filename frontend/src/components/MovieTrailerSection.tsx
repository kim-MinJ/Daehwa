import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, Clock, Eye } from "lucide-react";

interface Trailer {
  id: number;
  title: string;
  type: string;
  duration: string;
  views: string;
  thumbnail: string;
  quality: string;
}

interface MovieTrailerSectionProps {
  trailers?: Trailer[];
}

export function MovieTrailerSection({ trailers }: MovieTrailerSectionProps) {
  const defaultTrailers: Trailer[] = [
    {
      id: 1,
      title: "공식 예고편",
      type: "메인 예고편",
      duration: "2:35",
      views: "1.2M",
      thumbnail: "https://images.unsplash.com/photo-1678329885908-85eb768aa61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRyYWlsZXIlMjB2aWRlbyUyMHRodW1ibmFpbHxlbnwxfHx8fDE3NTY0NTY2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quality: "4K"
    },
    {
      id: 2,
      title: "티저 예고편",
      type: "티저",
      duration: "1:12",
      views: "850K",
      thumbnail: "https://images.unsplash.com/photo-1678329885908-85eb768aa61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRyYWlsZXIlMjB2aWRlbyUyMHRodW1ibmFpbHxlbnwxfHx8fDE3NTY0NTY2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quality: "HD"
    },
    {
      id: 3,
      title: "메이킹 영상",
      type: "비하인드",
      duration: "4:28",
      views: "420K",
      thumbnail: "https://images.unsplash.com/photo-1678329885908-85eb768aa61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRyYWlsZXIlMjB2aWRlbyUyMHRodW1ibmFpbHxlbnwxfHx8fDE3NTY0NTY2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quality: "HD"
    },
    {
      id: 4,
      title: "캐릭터 영상",
      type: "캐릭터 소개",
      duration: "1:45",
      views: "320K",
      thumbnail: "https://images.unsplash.com/photo-1678329885908-85eb768aa61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRyYWlsZXIlMjB2aWRlbyUyMHRodW1ibmFpbHxlbnwxfHx8fDE3NTY0NTY2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quality: "HD"
    }
  ];

  const displayTrailers = trailers || defaultTrailers;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            예고편 & 영상
          </h2>
          <Button variant="outline" size="sm">
            전체 보기
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTrailers.map((trailer) => (
            <div key={trailer.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <ImageWithFallback 
                  src={trailer.thumbnail}
                  alt={trailer.title}
                  className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                />
                
                {/* 재생 오버레이 */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>
                
                {/* 품질 배지 */}
                <Badge className="absolute top-2 right-2 text-xs bg-black/70 text-white">
                  {trailer.quality}
                </Badge>
                
                {/* 영상 길이 */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {trailer.duration}
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                <h4 className="text-sm line-clamp-1">{trailer.title}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{trailer.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {trailer.views}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}