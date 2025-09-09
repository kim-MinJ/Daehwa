// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MessageSquare, FileText, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { User, Review, Post, Notice, Vote } from './admin/types';

import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminReviewsTab from '../components/admin/AdminReviewsTab';
import AdminPostsTab from '../components/admin/AdminPostsTab';
import AdminVotesTab from '../components/admin/AdminVotesTab';
import AdminEditUserModal from '../components/admin/AdminEditUserModal';
import AdminEditReviewModal from '../components/admin/AdminEditReviewModal';

// 샘플 데이터 가져오기 (기존 코드 그대로)
import { sampleUsers, sampleReviews, samplePosts, sampleVotes, sampleNotices } from '../data/sampleData';

type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin';

interface AdminPageProps {
  onNavigation: (page: Page) => void;
  onBack: () => void;
}

export default function AdminPage({ onNavigation, onBack }: AdminPageProps) {
  const { userInfo, loading } = useAuth();
  const navigate = useNavigate();

  // --- admin 접근 제한 ---
  useEffect(() => {
    if (!loading && (!userInfo || userInfo.role !== 'admin')) {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
    }
  }, [userInfo, loading, navigate]);

  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  // 상태 관리
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [votes, setVotes] = useState<Vote[]>(sampleVotes);

  // 편집 모달 상태
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // 삭제 / 상태 변경
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));
  const deleteReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));
  const deletePost = (id: string) => setPosts(posts.filter(p => p.id !== id));
  const deleteVote = (id: string) => setVotes(votes.filter(v => v.id !== id));

  const updateUserStatus = (id: string, status: 'active' | 'inactive' | 'banned') =>
    setUsers(users.map(u => (u.id === id ? { ...u, status } : u)));

  const updateReviewStatus = (id: string, status: 'approved' | 'pending' | 'rejected') =>
    setReviews(reviews.map(r => (r.id === id ? { ...r, status } : r)));

  const updateVoteStatus = (id: string, status: 'active' | 'inactive') =>
    setVotes(votes.map(v => (v.id === id ? { ...v, status } : v)));

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="admin" onNavigation={onNavigation} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">MovieSSG 사이트 관리 시스템</p>
          </div>
          <Button onClick={onBack} variant="outline">
            메인으로 돌아가기
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card onClick={() => setActiveTab('users')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">총 회원수</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card onClick={() => setActiveTab('reviews')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">총 리뷰수</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card onClick={() => setActiveTab('posts')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">총 게시글수</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card onClick={() => setActiveTab('votes')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <Bell className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">투표수</p>
                <p className="text-2xl font-bold text-gray-900">{votes.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색바 */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="reviews">리뷰 관리</TabsTrigger>
            <TabsTrigger value="posts">게시글 관리</TabsTrigger>
            <TabsTrigger value="votes">투표 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab
              users={users}
              searchQuery={searchQuery}
              setEditingUser={setEditingUser}
              deleteUser={deleteUser}
              updateUserStatus={updateUserStatus}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviewsTab
              reviews={reviews}
              searchQuery={searchQuery}
              setEditingReview={setEditingReview}
              deleteReview={deleteReview}
              updateReviewStatus={updateReviewStatus}
            />
          </TabsContent>

          <TabsContent value="posts">
            <AdminPostsTab
              posts={posts}
              searchQuery={searchQuery}
              setEditingPost={() => {}}
              deletePost={deletePost}
            />
          </TabsContent>

          <TabsContent value="votes">
            <AdminVotesTab
              votes={votes}
              searchQuery={searchQuery}
              updateVoteStatus={updateVoteStatus}
              deleteVote={deleteVote}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 편집 모달 */}
      <AdminEditUserModal
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        updateUserStatus={updateUserStatus}
      />

      <AdminEditReviewModal
        editingReview={editingReview}
        setEditingReview={setEditingReview}
        updateReviewStatus={updateReviewStatus}
      />

      <Footer />
    </div>
  );
}
