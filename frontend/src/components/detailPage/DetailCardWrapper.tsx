import { useMemo } from "react";
import { Movie, Credits } from "@/types/movie";
import { genreMap } from "@/constants/genres";
import { getPosterUrl } from "@/utils/getPosterUrl";
import { DetailCard, DetailCardProps } from "./DetailCard";

interface Props {
  movie: Movie;
  credits: Credits;
  movieIdx?: number;      // ✅ 북마크/리뷰용 ID
  token?: string | null;  // ✅ JWT 토큰
}

export function DetailCardWrapper({ movie, credits, movieIdx, token }: Props) {
  // 연도
  const year = useMemo(
    () => (movie?.releaseDate ? movie.releaseDate.slice(0, 4) : "정보 없음"),
    [movie]
  );

  // 장르
  const genres = useMemo(
    () => movie?.genres?.map((g) => genreMap[g] || g) || [],
    [movie]
  );

  // 감독
  const director = useMemo(
    () => credits?.crew?.find((c) => c.job === "Director" || c.job === "감독")?.name || "",
    [credits]
  );

  // 상위 출연진
  const castTop = useMemo(() => {
    const cast = credits?.cast ?? [];

    // id 또는 name+character 기준으로 중복 제거
    const uniqueMap = new Map<string, typeof cast[0]>();
    for (const c of cast.slice(0, 20)) {
      if (!c.name) continue;
      const key = c.id?.toString() || `${c.name}-${c.character ?? ""}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, c);
    }

    return Array.from(uniqueMap.values())
      .slice(0, 8)
      .map((c) => ({
        id: c.id ?? Number(`${c.name?.replace(/\s+/g, "_")}-${c.character ?? ""}`),
        name: c.name,
        character: c.character ?? "",
        photo: getPosterUrl(c.profile_path, "w185"),
      }));
  }, [credits]);

  // DetailCard Props
  const cardProps: DetailCardProps = useMemo(() => {
    const vote10 = Number(movie?.voteAverage ?? 0);

    return {
      title: movie?.title ?? "",
      year,
      adultText: movie?.adult ? "청소년 관람불가" : "",
      genre: genres,
      director,
      description: movie?.overview || "줄거리 정보가 없습니다.",
      posterUrl: getPosterUrl(movie?.posterPath, "w500"),
      userRating: vote10,
      movieIdx, // ✅ 북마크/리뷰용
      token,    // ✅ JWT 토큰
    };
  }, [movie, year, genres, director, movieIdx, token]);

  return (
    <>
      {/* 영화 정보 카드 */}
      <section className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100">
        <DetailCard {...cardProps} />
      </section>

      {/* 주요 출연진 카드 */}
      {castTop.length > 0 && (
        <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 출연진</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {castTop.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img
                  src={p.photo}
                  alt={p.name}
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="text-gray-900 text-sm font-medium line-clamp-1">{p.name}</div>
                  {p.character && (
                    <div className="text-gray-500 text-xs line-clamp-1">{p.character}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
