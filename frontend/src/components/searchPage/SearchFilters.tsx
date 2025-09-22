// src/components/searchPage/SearchFilters.tsx
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  yearGroups: Record<string, string[]>;
  selectedYears: string[];
  toggleYearGroup: (group: string) => void;
  genres: string[];
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  clearAllFilters: () => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  genreMap: Record<string, string>;
}

// 공통 체크박스 컴포넌트
const FilterCheckbox = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center space-x-3">
    <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
    <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
      {label}
    </label>
  </div>
);

// named export로 변경
export const SearchFilters = ({
  query,
  setQuery,
  yearGroups,
  selectedYears,
  toggleYearGroup,
  genres,
  selectedGenres,
  toggleGenre,
  clearAllFilters,
  handleSearchSubmit,
  genreMap,
}: SearchFiltersProps) => (
  <div className="w-64 flex-shrink-0">
    <div className="bg-gray-100/50 rounded-2xl p-6 shadow-lg border sticky top-24 space-y-6">
      {/* 검색 Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
          onClick={handleSearchSubmit}
        />
        <form onSubmit={handleSearchSubmit}>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="영화 제목 검색"
            className="pl-10"
          />
        </form>
      </div>

      {/* 연도 필터 */}
      <div className="space-y-2">
        {yearGroups &&
          Object.entries(yearGroups).map(([label, groupYears]) => (
            <FilterCheckbox
              key={label}
              id={`group-${label}`}
              label={label}
              checked={groupYears.every(y => selectedYears.includes(y))}
              onChange={() => toggleYearGroup(label)}
            />
          ))}
      </div>

      {/* 장르 필터 */}
      <div className="space-y-2">
        {Array.isArray(genres) &&
          genres.map((genre, idx) => (
            <FilterCheckbox
              key={`${genre}-${idx}`}
              id={`genre-${genre}`}
              label={genreMap[genre] ?? genre}
              checked={selectedGenres.includes(genre)}
              onChange={() => toggleGenre(genre)}
            />
          ))}
      </div>

      <Button variant="outline" onClick={clearAllFilters} className="w-full">
        필터 초기화
      </Button>
    </div>
  </div>
);
