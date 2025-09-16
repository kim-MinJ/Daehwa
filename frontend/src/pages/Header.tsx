import { useState } from 'react';
import { Search, Bell, User, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // 검색 처리: URL 쿼리 반영
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors"
            >
              MovieSSG
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`font-medium transition-colors ${
                location.pathname === '/' ? 'text-red-500' : 'text-white/80 hover:text-white'
              }`}
            >
              홈
            </button>
            <button
              onClick={() => navigate('/search')}
              className={`font-medium transition-colors ${
                location.pathname.startsWith('/search') ? 'text-red-500' : 'text-white/80 hover:text-white'
              }`}
            >
              검색
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className={`font-medium transition-colors ${
                location.pathname === '/ranking' ? 'text-red-500' : 'text-white/80 hover:text-white'
              }`}
            >
              랭킹/투표
            </button>
            <button
              onClick={() => navigate('/reviews')}
              className={`font-medium transition-colors ${
                location.pathname === '/reviews' ? 'text-red-500' : 'text-white/80 hover:text-white'
              }`}
            >
              리뷰
            </button>
          </nav>

          {/* 검색창 */}
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

                // /movies 로 시작하는 URL에서는 이동 안 함
                onFocus={() => {
                  if (
                    !location.pathname.startsWith('/search') &&
                    !location.pathname.startsWith('/movies')
                  ) {
                    navigate('/search');
                  }
                }}
                className="pl-10 bg-gray-900/50 border-gray-700 focus:border-red-500 text-white placeholder:text-white/50"
              />
            </form>
          </div>

          {/* 알림 / 관리자 */}
          <div className="flex items-center space-x-4">

  {location.pathname !== '/login' && (
    !token ? (
      // 로그인 버튼
      <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
        <LogIn className="h-5 w-5 text-white/80 hover:text-white" />
      </Button>
    ) : (
      // 로그아웃 버튼
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          localStorage.removeItem('token'); // 토큰 삭제
          navigate('/login'); // 로그인 페이지로 이동
          window.location.reload(); // 페이지 새로고침 (optional, 상태 초기화용)
        }}
      >
        <LogIn className="h-5 w-5 text-white/80 hover:text-white rotate-180" /> 
        {/* 화살표 회전으로 로그아웃 느낌 */}
      </Button>
    )
  )}

  {/* 마이페이지 버튼은 로그인 여부와 관계없이 항상 표시 */}
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
