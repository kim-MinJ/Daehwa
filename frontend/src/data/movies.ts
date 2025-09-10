import { Movie, TrendingMovie } from '../types/movie';

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: '대도 엄마 재단',
    titleEn: 'Mother Foundation',
    year: 2024,
    genre: ['드라마', '가족'],
    rating: 8.2,
    poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkcmFtYSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjQ0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '이준익',
    cast: ['김혜수', '박해일', '이제훈', '김고은'],
    plot: '어려운 환경에서도 아이들을 위해 헌신하는 한 어머니의 감동적인 이야기를 그린 휴먼 드라마',
    duration: 128,
    country: '한국',
    releaseDate: '2024-03-15',
    boxOfficeRank: 1,
    reviews: [
      {
        id: 'r1',
        author: '영화마니아',
        rating: 9,
        content: '가족의 소중함을 일깨워주는 따뜻한 작품. 김혜수의 연기가 압권이다.',
        date: '2024-03-20',
        likes: 256
      }
    ]
  },
  {
    id: '2',
    title: '기생충',
    titleEn: 'Parasite',
    year: 2019,
    genre: ['드라마', '스릴러', '코미디'],
    rating: 8.6,
    poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkcmFtYSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjQ0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '봉준호',
    cast: ['송강호', '이선균', '조여정', '최우식', '박소담'],
    plot: '반지하에 살고 있는 기택네 가족이 우연한 기회로 고액의 과외를 하게 되면서 벌어지는 예측 불가능한 사건들을 그린 작품',
    duration: 132,
    country: '한국',
    releaseDate: '2019-05-30',
    boxOfficeRank: 2,
    reviews: [
      {
        id: 'r2',
        author: '영화마니아',
        rating: 9,
        content: '봉준호 감독의 최고작. 계급 갈등을 예술적으로 표현한 걸작',
        date: '2024-01-15',
        likes: 128
      }
    ]
  },
  {
    id: '3',
    title: '올드보이',
    titleEn: 'Oldboy',
    year: 2003,
    genre: ['스릴러', '미스터리', '드라마'],
    rating: 8.4,
    poster: 'https://images.unsplash.com/photo-1595171694538-beb81da39d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMG1vdmllJTIwZGFya3xlbnwxfHx8fDE3NTY5NjQ0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '박찬욱',
    cast: ['최민식', '유지태', '강혜정'],
    plot: '15년간 감금된 남자가 복수를 위해 벌이는 처절한 이야기',
    duration: 120,
    country: '한국',
    releaseDate: '2003-11-21',
    boxOfficeRank: 3
  },
  {
    id: '4',
    title: '부산행',
    titleEn: 'Train to Busan',
    year: 2016,
    genre: ['액션', '스릴러', '호러'],
    rating: 7.6,
    poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '연상호',
    cast: ['공유', '정유미', '마동석', '김수안'],
    plot: '좀비 바이러스가 전국으로 확산되고, KTX를 탄 사람들의 생존기를 그린 작품',
    duration: 118,
    country: '한국',
    releaseDate: '2016-07-20',
    boxOfficeRank: 4
  },
  {
    id: '5',
    title: '미나리',
    titleEn: 'Minari',
    year: 2020,
    genre: ['드라마', '가족'],
    rating: 7.4,
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '정이삭',
    cast: ['스티븐 연', '한예리', '윤여정', '앨런 킴'],
    plot: '1980년대 미국으로 이주한 한국 가족의 아메리칸 드림을 그린 이야기',
    duration: 115,
    country: '미국',
    releaseDate: '2020-12-11',
    boxOfficeRank: 5
  },
  {
    id: '6',
    title: '극장판 스파이 패밀리',
    titleEn: 'Spy Family Movie',
    year: 2024,
    genre: ['액션', '코미디', '가족'],
    rating: 8.0,
    poster: 'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '후루하시 카즈히로',
    cast: ['나리타 카지', '야마구치 유키코', '사토 아츠미'],
    plot: '가짜 가족으로 이뤄진 스파이 패밀리의 새로운 모험을 그린 극장판',
    duration: 105,
    country: '일본',
    releaseDate: '2024-02-14',
    boxOfficeRank: 6
  },
  {
    id: '7',
    title: '웡카',
    titleEn: 'Wonka',
    year: 2023,
    genre: ['가족', '판타지', '뮤지컬'],
    rating: 7.8,
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTY4ODI5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '폴 킹',
    cast: ['티모시 샬라메', '칼라 레인', '올리비아 콜먼'],
    plot: '윌리 웡카의 젊은 시절을 그린 판타지 뮤지컬',
    duration: 116,
    country: '미국',
    releaseDate: '2023-12-15',
    boxOfficeRank: 7
  },
  {
    id: '8',
    title: '콘크리트 유토피아',
    titleEn: 'Concrete Utopia',
    year: 2023,
    genre: ['드라마', '스릴러'],
    rating: 7.9,
    poster: 'https://images.unsplash.com/photo-1594181985790-4ad34b333bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkcmFtYSUyMHBvc3RlcnxlbnwxfHx8fDE3NTY5NjQ0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    director: '엄태화',
    cast: ['이병헌', '박서준', '박보영'],
    plot: '대지진 후 유일하게 남은 아파트에서 벌어지는 생존 이야기',
    duration: 130,
    country: '한국',
    releaseDate: '2023-08-09',
    boxOfficeRank: 8
  }
];

export const trendingMovies: TrendingMovie[] = mockMovies.map((movie, index) => ({
  ...movie,
  trendRank: index + 1,
  trendChange: index === 0 ? 'up' : index === 1 ? 'same' : index === 2 ? 'down' : 'new'
}));

export const genreList = ['전체', '드라마', '액션', '코미디', '스릴러', '호러', '로맨스', 'SF', '판타지', '애니메이션'];

export const getMoviesByGenre = (genre: string): Movie[] => {
  if (genre === '전체') return mockMovies;
  return mockMovies.filter(movie => movie.genre.includes(genre));
};

export const searchMovies = (query: string): Movie[] => {
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    (movie.titleEn && movie.titleEn.toLowerCase().includes(query.toLowerCase())) ||
    movie.director.toLowerCase().includes(query.toLowerCase()) ||
    movie.cast.some(actor => actor.toLowerCase().includes(query.toLowerCase()))
  );
};