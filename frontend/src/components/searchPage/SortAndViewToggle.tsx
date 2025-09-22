import { Grid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SortAndViewToggleProps {
  sortBy: 'latest' | 'rating' | 'title';
  handleSortChange: (val: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const SortAndViewToggle = ({ sortBy, handleSortChange, viewMode, setViewMode }: SortAndViewToggleProps) => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold">영화</h1>
    <div className="flex gap-2">
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-32 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="rating">평점순</SelectItem>
          <SelectItem value="title">제목순</SelectItem>
        </SelectContent>
      </Select>
      <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
      <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
    </div>
  </div>
);
