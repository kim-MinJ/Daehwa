import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail';

interface HeaderProps {
  currentPage: Page;
  onNavigation: (page: Page) => void;
}

export default function Header({ currentPage, onNavigation }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigation('home')}
              className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              MovieSSG
            </button>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigation('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              홈
            </button>
            <button 
              onClick={() => onNavigation('movies')}
              className={`font-medium transition-colors ${
                currentPage === 'movies' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              검색
            </button>
            <button 
              onClick={() => onNavigation('ranking')}
              className={`font-medium transition-colors ${
                currentPage === 'ranking' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              랭킹
            </button>
            <button 
              onClick={() => onNavigation('reviews')}
              className={`font-medium transition-colors ${
                currentPage === 'reviews' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              리뷰
            </button>
          </nav>

          {/* 검색바 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="영화 제목, 감독, 배우를 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-red-300"
              />
            </div>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}