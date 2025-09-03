import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink, Clock } from "lucide-react";

interface Article {
  id: number;
  title: string;
  source: string;
  publishDate: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

interface RelatedArticlesSidebarProps {
  articles?: Article[];
}

export function RelatedArticlesSidebar({ articles }: RelatedArticlesSidebarProps) {
  const defaultArticles: Article[] = [
    {
      id: 1,
      title: "이 영화가 박스오피스 1위를 차지한 이유",
      source: "영화저널",
      publishDate: "2024.01.15",
      excerpt: "관객들의 마음을 사로잡은 특별한 스토리텔링과 연출에 대해 분석해보았습니다...",
      imageUrl: "https://images.unsplash.com/photo-1635942046031-041e9baea8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYXJ0aWNsZSUyMG5ld3NwYXBlcnxlbnwxfHx8fDE3NTY0NTY2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "박스오피스"
    },
    {
      id: 2,
      title: "감독 인터뷰: 영화 제작 비하인드 스토리",
      source: "시네마투데이",
      publishDate: "2024.01.12",
      excerpt: "제작 과정에서 겪었던 어려움과 배우들과의 협업에 대해 감독이 직접 들려주는 이야기...",
      imageUrl: "https://images.unsplash.com/photo-1635942046031-041e9baea8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYXJ0aWNsZSUyMG5ld3NwYXBlcnxlbnwxfHx8fDE3NTY0NTY2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "인터뷰"
    },
    {
      id: 3,
      title: "주연 배우의 새로운 도전과 변신",
      source: "엔터테인먼트위클리",
      publishDate: "2024.01.10",
      excerpt: "이번 역할을 위해 배우가 준비한 특별한 연기 방법과 캐릭터 해석에 대한 깊이 있는 분석...",
      imageUrl: "https://images.unsplash.com/photo-1635942046031-041e9baea8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYXJ0aWNsZSUyMG5ld3NwYXBlcnxlbnwxfHx8fDE3NTY0NTY2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "배우"
    },
    {
      id: 4,
      title: "영화 속 숨겨진 의미와 상징 분석",
      source: "필름크리틱",
      publishDate: "2024.01.08",
      excerpt: "영화 전문가들이 해석하는 작품 속 깊은 의미와 감독이 전달하고자 한 메시지...",
      imageUrl: "https://images.unsplash.com/photo-1635942046031-041e9baea8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYXJ0aWNsZSUyMG5ld3NwYXBlcnxlbnwxfHx8fDE3NTY0NTY2Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "리뷰"
    }
  ];

  const displayArticles = articles || defaultArticles;

  return (
    <Card className="p-6 h-fit sticky top-6">
      <div className="space-y-6">
        <h2>관련 기사</h2>
        
        <div className="space-y-4">
          {displayArticles.map((article) => (
            <div key={article.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="space-y-3">
                <ImageWithFallback 
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.publishDate}
                    </div>
                  </div>
                  
                  <h3 className="text-sm leading-tight hover:text-primary cursor-pointer transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.source}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
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