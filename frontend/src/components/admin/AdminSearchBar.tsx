// src/components/admin/AdminSearchBar.tsx
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminSearchBar({ searchQuery, setSearchQuery }: AdminSearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
