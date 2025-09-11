import { User, Review, Post, Notice, Vote } from '../components/admin/type';

// Users
export const sampleUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  joinDate: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    .toISOString().split('T')[0],
  status: ['active', 'inactive', 'banned'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'banned',
  reviewCount: Math.floor(Math.random() * 50),
}));

// Reviews
export const sampleReviews: Review[] = Array.from({ length: 30 }, (_, i) => ({
  id: `review-${i + 1}`,
  movieTitle: ['기생충', '올드보이', '부산행', '신세계', '곡성'][Math.floor(Math.random() * 5)],
  username: `user${Math.floor(Math.random() * 25) + 1}`,
  rating: 1 + Math.floor(Math.random() * 5),
  content: `이 영화는 정말 훌륭했습니다. ${i + 1}번째 리뷰입니다.`,
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    .toISOString().split('T')[0],
  status: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as 'approved' | 'pending' | 'rejected',
}));

// Posts
export const samplePosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: `영화 추천 게시글 ${i + 1}`,
  author: `user${Math.floor(Math.random() * 25) + 1}`,
  category: ['추천', '리뷰', '토론', '질문'][Math.floor(Math.random() * 4)],
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  views: Math.floor(Math.random() * 1000),
  status: ['published', 'draft', 'deleted'][Math.floor(Math.random() * 3)] as 'published' | 'draft' | 'deleted',
}));

// Notices
export const sampleNotices: Notice[] = Array.from({ length: 10 }, (_, i) => ({
  id: `notice-${i + 1}`,
  title: `공지사항 ${i + 1}`,
  content: `이것은 ${i + 1}번째 공지사항의 내용입니다.`,
  author: 'admin',
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    .toISOString().split('T')[0],
  isImportant: Math.random() > 0.7,
  status: ['published', 'draft'][Math.floor(Math.random() * 2)] as 'published' | 'draft',
}));

// Votes
export const sampleVotes: Vote[] = Array.from({ length: 15 }, (_, i) => ({
  id: `vote-${i + 1}`,
  movieTitle: ['기생충', '올드보이', '부산행'][Math.floor(Math.random() * 3)],
  voter: `user${Math.floor(Math.random() * 25) + 1}`,
  voteCount: Math.floor(Math.random() * 100),
  status: ['active', 'inactive'][Math.floor(Math.random() * 2)] as 'active' | 'inactive',
}));
