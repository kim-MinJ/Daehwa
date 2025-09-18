import { useState } from 'react';
import { Search, User, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // -----------------------------
  // 헤더 검색창 입력 상태
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");

  // -----------------------------
  // 검색 실행
  // -----------------------------
  const goToSearch = (query: string) => {
    if (!query.trim()) return;

    // SearchPage 이동 + URL query 설정
    navigate(`/search?query=${encodeURIComponent(query.trim())}`, { replace: false });

    // 검색 후 입력창 초기화
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') goToSearch(searchQuery);
  };

  // -----------------------------
  // 검색창 클릭 시 이동 (상세페이지 제외)
  // -----------------------------
  const handleSearchClick = () => {
    if (!location.pathname.startsWith('/movie')) {
      navigate('/search');
    }
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
              MovieSSG
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`font-medium transition-colors ${location.pathname === '/' ? 'text-red-500' : 'text-white/80 hover:text-white'}`}
            >
              홈
            </button>
            <button
              onClick={() => navigate('/search')}
              className={`font-medium transition-colors ${location.pathname.startsWith('/search') ? 'text-red-500' : 'text-white/80 hover:text-white'}`}
            >
              검색
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className={`font-medium transition-colors ${location.pathname === '/ranking' ? 'text-red-500' : 'text-white/80 hover:text-white'}`}
            >
              랭킹
            </button>
            <button
              onClick={() => navigate('/reviews')}
              className={`font-medium transition-colors ${location.pathname === '/reviews' ? 'text-red-500' : 'text-white/80 hover:text-white'}`}
            >
              리뷰
            </button>
          </nav>

          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4 cursor-pointer hover:text-white transition-colors"
                onClick={handleSearchClick}
              />
              <Input
                type="text"
                placeholder="영화 제목을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (!location.pathname.startsWith('/movie')) navigate('/search'); }}
                className="pl-10 bg-gray-900/50 border-gray-700 focus:border-red-500 text-white placeholder:text-white/50"
              />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {location.pathname !== '/login' && (!token ? (
              <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
                <LogIn className="h-5 w-5 text-white/80 hover:text-white" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
                window.location.reload();
              }}>
                <LogIn className="h-5 w-5 text-white/80 hover:text-white rotate-180" />
              </Button>
            ))}
            {token && (
              <Button variant="ghost" size="icon" onClick={() => navigate('/mypage')}>
                <User className="h-5 w-5 text-white/80 hover:text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
