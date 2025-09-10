// src/components/admin/AdminPostsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Post } from './types';

interface AdminPostsTabProps {
  posts: Post[];
  searchQuery: string;
  setEditingPost: (post: Post | null) => void;
  deletePost: (id: string) => void;
}

export default function AdminPostsTab({
  posts,
  searchQuery,
  setEditingPost,
  deletePost,
}: AdminPostsTabProps) {
  const filterPosts = () =>
    posts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    const colorMap = { published: 'bg-green-600', draft: 'bg-yellow-600', deleted: 'bg-red-600' };
    return <Badge className={`${colorMap[status as keyof typeof colorMap]} text-white`}>{status}</Badge>;
  };

  return (
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
              {filterPosts().map(post => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4">{post.author}</td>
                  <td className="p-4">
                    <Badge variant="outline">{post.category}</Badge>
                  </td>
                  <td className="p-4">{post.date}</td>
                  <td className="p-4">{post.views}</td>
                  <td className="p-4">{getStatusBadge(post.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
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
  );
}
