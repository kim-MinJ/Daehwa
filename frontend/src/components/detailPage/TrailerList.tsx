import { Trailer } from "@/types/movie";

interface Props {
  trailers: any[]; // API 원본 데이터
}

// API 데이터를 Trailer 타입으로 변환
function mapApiToTrailer(apiData: any): Trailer {
  return {
    id: String(apiData.videoIdx),
    title: apiData.title || "영상",
    type: apiData.videoType || "Trailer",
    url: apiData.videoUrl,
    thumbnail: apiData.thumbnailUrl,
  };
}

export function TrailerList({ trailers }: Props) {
  if (!trailers || trailers.length === 0) return null;

  // videoUrl 기준으로 중복 제거
  const trailerItems: Trailer[] = Array.from(
    new Map(trailers.map((t) => [t.videoUrl, mapApiToTrailer(t)])).values()
  );

  return (
    <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">트레일러</h3>
      <div className="space-y-4">
        {trailerItems.map((t) => (
          <a key={t.id} href={t.url} target="_blank" rel="noreferrer">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img
                src={t.thumbnail}
                alt={t.title}
                className="w-28 h-16 object-cover rounded"
              />
              <div>
                <div className="text-gray-900 text-sm font-medium">{t.title}</div>
                <div className="text-gray-500 text-xs">{t.type}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
