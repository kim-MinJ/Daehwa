// src/pages/FavoritesPage.tsx
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  if (!ids.length) return <div className="p-6">찜한 영화가 없습니다.</div>;

  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ids.map((id) => (
        <Link key={id} to={`/movie/${id}`} className="block">
          <Card className="p-4 hover:shadow-md transition">영화 #{id}</Card>
        </Link>
      ))}
    </div>
  );
}
