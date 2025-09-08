import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, Pause, Volume2, Heart } from "lucide-react";
import { useState } from "react";

interface OSTTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  albumCover: string;
}

interface MovieOSTSectionProps {
  tracks?: OSTTrack[];
}

export function MovieOSTSection({ tracks }: MovieOSTSectionProps) {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  
  const defaultTracks: OSTTrack[] = [
    {
      id: 1,
      title: "Main Theme",
      artist: "영화음악 작곡가",
      duration: "3:45",
      albumCover: "https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBzb3VuZHRyYWNrfGVufDF8fHx8MTc1NjQ1NjY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      title: "Love Theme",
      artist: "가수명",
      duration: "4:12",
      albumCover: "https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBzb3VuZHRyYWNrfGVufDF8fHx8MTc1NjQ1NjY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 3,
      title: "Action Sequence",
      artist: "오케스트라",
      duration: "2:58",
      albumCover: "https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBzb3VuZHRyYWNrfGVufDF8fHx8MTc1NjQ1NjY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 4,
      title: "Ending Credits",
      artist: "메인 가수",
      duration: "5:23",
      albumCover: "https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjBzb3VuZHRyYWNrfGVufDF8fHx8MTc1NjQ1NjY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const displayTracks = tracks || defaultTracks;

  const togglePlay = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            영화 OST
          </h2>
          <Button variant="outline" size="sm">
            전체 재생목록
          </Button>
        </div>
        
        <div className="space-y-3">
          {displayTracks.map((track) => (
            <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              {/* 앨범 커버 */}
              <ImageWithFallback 
                src={track.albumCover}
                alt={track.title}
                className="w-12 h-12 object-cover rounded-md"
              />
              
              {/* 트랙 정보 */}
              <div className="flex-1 min-w-0">
                <h4 className="truncate">{track.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              
              {/* 재생 시간 */}
              <div className="text-sm text-muted-foreground">
                {track.duration}
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePlay(track.id)}
                  className="w-8 h-8 p-0"
                >
                  {playingTrack === track.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}