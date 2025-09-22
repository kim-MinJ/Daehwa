// src/constants/genres.ts
export const genreMap: Record<string, string> = {
  Action: '액션',
  Adventure: '모험',
  Animation: '애니메이션',
  Comedy: '코미디',
  Crime: '범죄',
  Documentary: '다큐멘터리',
  Drama: '드라마',
  Family: '가족',
  Fantasy: '판타지',
  History: '역사',
  Horror: '공포',
  Music: '음악',
  Mystery: '미스터리',
  Romance: '로맨스',
  'Science Fiction': 'SF',
  'TV Movie': 'TV 영화',
  Thriller: '스릴러',
  War: '전쟁',
  Western: '서부극',
};

// 미리 연도 그룹 정의
export const YEAR_GROUPS: Record<string, string[]> = {
  '2020년대': Array.from({ length: 6 }, (_, i) => `${2020 + i}`), // 2020~2025
  '2010년대': Array.from({ length: 10 }, (_, i) => `${2010 + i}`), // 2010~2019
  '2000년대': Array.from({ length: 10 }, (_, i) => `${2000 + i}`), // 2000~2009
  '2000년대 이전': Array.from({ length: 5 }, (_, i) => `${1995 + i}`), // 1995~1999
};
