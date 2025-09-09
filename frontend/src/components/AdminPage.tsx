import { useState } from 'react';
import { Search, Edit, Trash2, Plus, Users, MessageSquare, FileText, Bell, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import Header from './Header';
import Footer from './Footer';

type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin';

interface AdminPageProps {
  onNavigation: (page: Page) => void;
  onBack: () => void;
}

// 모든 데이터 타입 정의
interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'banned';
  reviewCount: number;
}

interface Review {
  id: string;
  movieTitle: string;
  username: string;
  rating: number;
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  views: number;
  status: 'published' | 'draft' | 'deleted';
}

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isImportant: boolean;
  status: 'published' | 'draft';
}

// 샘플 데이터
const sampleUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  joinDate: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  status: ['active', 'inactive', 'banned'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'banned',
  reviewCount: Math.floor(Math.random() * 50)
}));

const sampleReviews: Review[] = Array.from({ length: 30 }, (_, i) => ({
  id: `review-${i + 1}`,
  movieTitle: ['기생충', '올드보이', '부산행', '신세계', '곡성'][Math.floor(Math.random() * 5)],
  username: `user${Math.floor(Math.random() * 25) + 1}`,
  rating: 1 + Math.floor(Math.random() * 5),
  content: `이 영화는 정말 훌륭했습니다. 연출과 연기 모든 면에서 완벽했어요. ${i + 1}번째 리뷰입니다.`,
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  status: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as 'approved' | 'pending' | 'rejected'
}));

const samplePosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: `영화 추천 게시글 ${i + 1}`,
  author: `user${Math.floor(Math.random() * 25) + 1}`,
  category: ['추천', '리뷰', '토론', '질문'][Math.floor(Math.random() * 4)],
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  views: Math.floor(Math.random() * 1000),
  status: ['published', 'draft', 'deleted'][Math.floor(Math.random() * 3)] as 'published' | 'draft' | 'deleted'
}));

const sampleNotices: Notice[] = Array.from({ length: 10 }, (_, i) => ({
  id: `notice-${i + 1}`,
  title: `공지사항 ${i + 1}`,
  content: `이것은 ${i + 1}번째 공지사항의 내용입니다. 중요한 안내사항을 포함하고 있습니다.`,
  author: 'admin',
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  isImportant: Math.random() > 0.7,
  status: ['published', 'draft'][Math.floor(Math.random() * 2)] as 'published' | 'draft'
}));

export default function AdminPage({ onNavigation, onBack }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 상태 관리
  const [users, setUsers] = useState(sampleUsers);
  const [reviews, setReviews] = useState(sampleReviews);
  const [posts, setPosts] = useState(samplePosts);
  const [notices, setNotices] = useState(sampleNotices);
  
  // 편집 모달 상태
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  
  // 새 공지사항 작성 상태
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isImportant: false });

  // 검색 필터링 함수
  const filterUsers = () => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterReviews = () => {
    return reviews.filter(review => 
      review.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterPosts = () => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterNotices = () => {
    return notices.filter(notice => 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // 삭제 함수들
  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const deleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  // 상태 업데이트 함수들
  const updateUserStatus = (id: string, status: 'active' | 'inactive' | 'banned') => {
    setUsers(users.map(user => user.id === id ? { ...user, status } : user));
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'pending' | 'rejected') => {
    setReviews(reviews.map(review => review.id === id ? { ...review, status } : review));
  };

  // 새 공지사항 작성
  const createNotice = () => {
    if (newNotice.title && newNotice.content) {
      const notice: Notice = {
        id: `notice-${Date.now()}`,
        title: newNotice.title,
        content: newNotice.content,
        author: 'admin',
        date: new Date().toISOString().split('T')[0],
        isImportant: newNotice.isImportant,
        status: 'published'
      };
      setNotices([notice, ...notices]);
      setNewNotice({ title: '', content: '', isImportant: false });
    }
  };

  const getStatusBadge = (status: string, type: 'user' | 'review' | 'post' | 'notice') => {
    const colorMap = {
      user: {
        active: 'bg-green-600',
        inactive: 'bg-yellow-600',
        banned: 'bg-red-600'
      },
      review: {
        approved: 'bg-green-600',
        pending: 'bg-yellow-600',
        rejected: 'bg-red-600'
      },
      post: {
        published: 'bg-green-600',
        draft: 'bg-yellow-600',
        deleted: 'bg-red-600'
      },
      notice: {
        published: 'bg-green-600',
        draft: 'bg-yellow-600'
      }
    };

    return (
      <Badge className={`${colorMap[type][status as keyof typeof colorMap[typeof type]]} text-white hover:${colorMap[type][status as keyof typeof colorMap[typeof type]]}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 헤더 */}
      <Header currentPage="admin" onNavigation={onNavigation} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-2">MovieSSG 사이트 관리 시스템</p>
            </div>
            <Button onClick={onBack} variant="outline">
              메인으로 돌아가기
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 회원수</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 리뷰수</p>
                  <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 게시글수</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">공지사항</p>
                  <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색바 */}
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

        {/* 메인 탭 컨텐츠 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="reviews">리뷰 관리</TabsTrigger>
            <TabsTrigger value="posts">게시글 관리</TabsTrigger>
            <TabsTrigger value="notices">공지사항 관리</TabsTrigger>
          </TabsList>

          {/* 회원 관리 탭 */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>회원 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">사용자명</th>
                        <th className="text-left p-4">이메일</th>
                        <th className="text-left p-4">가입일</th>
                        <th className="text-left p-4">상태</th>
                        <th className="text-left p-4">리뷰수</th>
                        <th className="text-left p-4">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterUsers().map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{user.username}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">{user.joinDate}</td>
                          <td className="p-4">{getStatusBadge(user.status, 'user')}</td>
                          <td className="p-4">{user.reviewCount}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 리뷰 관리 탭 */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>리뷰 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">영화</th>
                        <th className="text-left p-4">작성자</th>
                        <th className="text-left p-4">평점</th>
                        <th className="text-left p-4">내용</th>
                        <th className="text-left p-4">작성일</th>
                        <th className="text-left p-4">상태</th>
                        <th className="text-left p-4">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterReviews().map((review) => (
                        <tr key={review.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{review.movieTitle}</td>
                          <td className="p-4">{review.username}</td>
                          <td className="p-4">⭐ {review.rating}</td>
                          <td className="p-4 max-w-xs truncate">{review.content}</td>
                          <td className="p-4">{review.date}</td>
                          <td className="p-4">{getStatusBadge(review.status, 'review')}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingReview(review)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteReview(review.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 게시글 관리 탭 */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>게시글 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">제목</th>
                        <th className="text-left p-4">작성자</th>
                        <th className="text-left p-4">카테고리</th>
                        <th className="text-left p-4">작성일</th>
                        <th className="text-left p-4">조회수</th>
                        <th className="text-left p-4">상태</th>
                        <th className="text-left p-4">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterPosts().map((post) => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{post.title}</td>
                          <td className="p-4">{post.author}</td>
                          <td className="p-4">
                            <Badge variant="outline">{post.category}</Badge>
                          </td>
                          <td className="p-4">{post.date}</td>
                          <td className="p-4">{post.views}</td>
                          <td className="p-4">{getStatusBadge(post.status, 'post')}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 공지사항 관리 탭 */}
          <TabsContent value="notices">
            <div className="space-y-6">
              {/* 새 공지사항 작성 */}
              <Card>
                <CardHeader>
                  <CardTitle>새 공지사항 작성</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notice-title">제목</Label>
                    <Input
                      id="notice-title"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      placeholder="공지사항 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notice-content">내용</Label>
                    <Textarea
                      id="notice-content"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      placeholder="공지사항 내용을 입력하세요"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="important"
                      checked={newNotice.isImportant}
                      onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                    />
                    <Label htmlFor="important">중요 공��사항</Label>
                  </div>
                  <Button onClick={createNotice} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    공지사항 작성
                  </Button>
                </CardContent>
              </Card>

              {/* 공지사항 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>공지사항 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">제목</th>
                          <th className="text-left p-4">작성자</th>
                          <th className="text-left p-4">작성일</th>
                          <th className="text-left p-4">중요</th>
                          <th className="text-left p-4">상태</th>
                          <th className="text-left p-4">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterNotices().map((notice) => (
                          <tr key={notice.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{notice.title}</td>
                            <td className="p-4">{notice.author}</td>
                            <td className="p-4">{notice.date}</td>
                            <td className="p-4">
                              {notice.isImportant && <Badge className="bg-red-600 text-white hover:bg-red-600">중요</Badge>}
                            </td>
                            <td className="p-4">{getStatusBadge(notice.status, 'notice')}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingNotice(notice)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteNotice(notice.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 편집 모달들 */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>회원 정보 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>상태 변경</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={editingUser.status === 'active' ? 'default' : 'outline'}
                    onClick={() => updateUserStatus(editingUser.id, 'active')}
                  >
                    활성
                  </Button>
                  <Button
                    size="sm"
                    variant={editingUser.status === 'inactive' ? 'default' : 'outline'}
                    onClick={() => updateUserStatus(editingUser.id, 'inactive')}
                  >
                    비활성
                  </Button>
                  <Button
                    size="sm"
                    variant={editingUser.status === 'banned' ? 'destructive' : 'outline'}
                    onClick={() => updateUserStatus(editingUser.id, 'banned')}
                  >
                    차단
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingReview && (
        <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>리뷰 상태 변경</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>상태 변경</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={editingReview.status === 'approved' ? 'default' : 'outline'}
                    onClick={() => updateReviewStatus(editingReview.id, 'approved')}
                  >
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant={editingReview.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => updateReviewStatus(editingReview.id, 'pending')}
                  >
                    대기
                  </Button>
                  <Button
                    size="sm"
                    variant={editingReview.status === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => updateReviewStatus(editingReview.id, 'rejected')}
                  >
                    거부
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}