// src/components/admin/AdminDashboardCards.tsx
import { Card, CardContent } from '../ui/card';
import { Users, MessageSquare, FileText, Bell } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminDashboardCardsProps {
  usersCount: number;
  reviewsCount: number;
  postsCount: number;
  votesCount: number;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboardCards({
  usersCount,
  reviewsCount,
  postsCount,
  votesCount,
  setActiveTab,
}: AdminDashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('users')}>
        <CardContent className="p-6 flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">총 회원수</p>
            <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('reviews')}>
        <CardContent className="p-6 flex items-center">
          <MessageSquare className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">총 리뷰수</p>
            <p className="text-2xl font-bold text-gray-900">{reviewsCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('comments')}>
        <CardContent className="p-6 flex items-center">
          <FileText className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">총 댓글 수</p>
            <p className="text-2xl font-bold text-gray-900">{postsCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('votes')}>
        <CardContent className="p-6 flex items-center">
          <Bell className="h-8 w-8 text-orange-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">투표수</p>
            <p className="text-2xl font-bold text-gray-900">{votesCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
