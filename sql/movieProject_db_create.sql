-- ===========================
-- 1. 테이블 생성
-- ===========================

-- 1-1. Users
CREATE TABLE Users
(
  user_id  VARCHAR2(100)     NOT NULL,
  username VARCHAR2(50 CHAR) NOT NULL,
  password VARCHAR2(255 CHAR) NOT NULL,
  role     VARCHAR2(20)      DEFAULT 'user',
  reg_date DATE              DEFAULT sysdate,
  status   NUMBER(1)         DEFAULT 0,
  CONSTRAINT PK_Users PRIMARY KEY (user_id)
);

COMMENT ON TABLE Users IS '회원관리';

COMMENT ON COLUMN Users.user_id IS '이메일주소';

COMMENT ON COLUMN Users.username IS '사용자이름';

COMMENT ON COLUMN Users.password IS '비밀번호';

COMMENT ON COLUMN Users.role IS '역할';

COMMENT ON COLUMN Users.reg_date IS '회원가입 날짜';

COMMENT ON COLUMN Users.status IS '로그인(0: off, 1: on)';

-- 1-2. Articles
CREATE TABLE Articles
(
  articles_idx NUMBER        NOT NULL,
  movie_idx    NUMBER        NOT NULL,
  title        VARCHAR2(255),
  source_name  VARCHAR2(255),
  article_url  VARCHAR2(255),
  published_at DATE         ,
  CONSTRAINT PK_Articles PRIMARY KEY (articles_idx)
);

COMMENT ON TABLE Articles IS '관련 기사';

COMMENT ON COLUMN Articles.articles_idx IS '기사 인덱스';

COMMENT ON COLUMN Articles.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Articles.title IS '기사 제목';

COMMENT ON COLUMN Articles.source_name IS '출처';

COMMENT ON COLUMN Articles.article_url IS '기사 링크';

COMMENT ON COLUMN Articles.published_at IS '기사 발행일';

-- 1-3. Bookmark
CREATE TABLE Bookmark
(
  bookmark_idx NUMBER        NOT NULL,
  user_id      VARCHAR2(100) NOT NULL,
  movie_idx    NUMBER        NOT NULL,
  CONSTRAINT PK_Bookmark PRIMARY KEY (bookmark_idx)
);

COMMENT ON TABLE Bookmark IS '북마크';

COMMENT ON COLUMN Bookmark.bookmark_idx IS '북마크 인덱스';

COMMENT ON COLUMN Bookmark.user_id IS '이메일주소';

COMMENT ON COLUMN Bookmark.movie_idx IS '영화 인덱스';

-- 1-4. Comments
CREATE TABLE Comments
(
  comment_idx NUMBER              NOT NULL,
  user_id     VARCHAR2(100)       NOT NULL,
  review_idx  NUMBER              NOT NULL,
  content     VARCHAR2(2000 CHAR) NOT NULL,
  created_at  DATE                DEFAULT sysdate,
  update_at   DATE                DEFAULT sysdate,
  CONSTRAINT PK_Comments PRIMARY KEY (comment_idx)
);

COMMENT ON TABLE Comments IS '댓글';

COMMENT ON COLUMN Comments.comment_idx IS '댓글 인덱스';

COMMENT ON COLUMN Comments.user_id IS '이메일주소';

COMMENT ON COLUMN Comments.review_idx IS '리뷰 인덱스';

COMMENT ON COLUMN Comments.content IS '댓글 내용';

COMMENT ON COLUMN Comments.created_at IS '작성 날짜';

COMMENT ON COLUMN Comments.update_at IS '수정 날짜';

-- 1-5. Movie_Info
CREATE TABLE Movie_Info
(
  movie_idx     NUMBER              NOT NULL,
  tmdb_movie_id NUMBER              NOT NULL,
  title         VARCHAR2(500 CHAR) ,
  popularity    BINARY_DOUBLE       DEFAULT 0,
  vote_count    NUMBER              DEFAULT 0,
  vote_average  BINARY_DOUBLE       DEFAULT 0,
  adult         NUMBER(1)           DEFAULT 0 NOT NULL,
  overview      VARCHAR2(2000 CHAR),
  backdrop_path VARCHAR2(255)      ,
  poster_path   VARCHAR2(255)      ,
  release_date  DATE               ,
  CONSTRAINT PK_Movie_Info PRIMARY KEY (movie_idx)
);

SELECT *
FROM Users AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '10' MINUTE);


ALTER TABLE Movie_Info
  ADD CONSTRAINT UQ_tmdb_movie_id UNIQUE (tmdb_movie_id);

COMMENT ON TABLE Movie_Info IS '영화 정보';

COMMENT ON COLUMN Movie_Info.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Movie_Info.tmdb_movie_id IS 'tmdb_movie_id';

COMMENT ON COLUMN Movie_Info.title IS '영화 제목';

COMMENT ON COLUMN Movie_Info.popularity IS 'tmdb 내부 인기도';

COMMENT ON COLUMN Movie_Info.vote_count IS '투표 숫자';

COMMENT ON COLUMN Movie_Info.vote_average IS '별점 평균';

COMMENT ON COLUMN Movie_Info.adult IS '성인영화 유무 (0: false, 1: true)';

COMMENT ON COLUMN Movie_Info.overview IS '영화 설명';

COMMENT ON COLUMN Movie_Info.backdrop_path IS '영화 상세 배경화면 경로';

COMMENT ON COLUMN Movie_Info.poster_path IS '영화 상세 포스터 경로';

COMMENT ON COLUMN Movie_Info.release_date IS '영화 개봉일';

-- 1-6. Review
CREATE TABLE Review
(
  review_idx NUMBER              NOT NULL,
  movie_idx  NUMBER              NOT NULL,
  user_id     VARCHAR2(100)       NOT NULL,
  content    VARCHAR2(2000 CHAR) NOT NULL,
  rating     NUMBER              DEFAULT 10 CHECK (rating BETWEEN 1 AND 10),
  created_at DATE                DEFAULT sysdate,
  update_at  DATE                DEFAULT sysdate,
  isBlind    NUMBER(1)           DEFAULT 0,
  CONSTRAINT PK_Review PRIMARY KEY (review_idx)
);

COMMENT ON TABLE Review IS '리뷰';

COMMENT ON COLUMN Review.review_idx IS '리뷰 인덱스';

COMMENT ON COLUMN Review.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Review.user_id IS '이메일주소';

COMMENT ON COLUMN Review.content IS '리뷰 내용';

COMMENT ON COLUMN Review.rating IS '별점 (1~10)';

COMMENT ON COLUMN Review.created_at IS '작성 날짜';

COMMENT ON COLUMN Review.update_at IS '수정 날짜';

COMMENT ON COLUMN Review.isBlind IS '블라인드 (0: off, 1: on)';

-- 1-7. Notice
CREATE TABLE Notice
(
  notice_idx   NUMBER              NOT NULL,
  user_id       VARCHAR2(100)       NOT NULL,
  title        VARCHAR2(255)       NOT NULL,
  content      VARCHAR2(2000 CHAR) NOT NULL,
  created_date DATE                DEFAULT sysdate,
  CONSTRAINT PK_Notice PRIMARY KEY (notice_idx)
);

COMMENT ON TABLE Notice IS '공지사항';

COMMENT ON COLUMN Notice.notice_idx IS '공지사항 인덱스';

COMMENT ON COLUMN Notice.user_id IS '이메일주소';

COMMENT ON COLUMN Notice.title IS '공지 제목';

COMMENT ON COLUMN Notice.content IS '공지 내용';

COMMENT ON COLUMN Notice.created_date IS '작성 날짜';

-- 1-8. Genres
CREATE TABLE Genres
(
  genre_idx NUMBER       NOT NULL,
  genre_id  NUMBER       NOT NULL,
  name      VARCHAR2(50) NOT NULL,
  CONSTRAINT PK_Genres PRIMARY KEY (genre_idx)
);

ALTER TABLE Genres
  ADD CONSTRAINT UQ_genre_id UNIQUE (genre_id);

ALTER TABLE Genres
  ADD CONSTRAINT UQ_name UNIQUE (name);

COMMENT ON TABLE Genres IS '장르';

COMMENT ON COLUMN Genres.genre_idx IS '장르 인덱스';

COMMENT ON COLUMN Genres.genre_id IS '장르 아이디';

COMMENT ON COLUMN Genres.name IS '장르명';

-- 1-9. Movie_Cast
CREATE TABLE Movie_Cast
(
  cast_idx          NUMBER        NOT NULL,
  tmdb_movie_id     NUMBER        NOT NULL,
  tmdb_cast_id      NUMBER        NOT NULL,
  character         VARCHAR2(1000),
  cast_name         VARCHAR2(1000),
  cast_profile_path VARCHAR2(1000),
  credit_order      NUMBER       ,
  CONSTRAINT PK_Movie_Cast PRIMARY KEY (cast_idx)
);

COMMENT ON TABLE Movie_Cast IS '배우 정보';

COMMENT ON COLUMN Movie_Cast.cast_idx IS '캐스 인덱스';

COMMENT ON COLUMN Movie_Cast.tmdb_movie_id IS 'tmdb_movie_id';

COMMENT ON COLUMN Movie_Cast.tmdb_cast_id IS '(CAST) tmdb_cast_id';

COMMENT ON COLUMN Movie_Cast.character IS '(CAST) 배역 이름';

COMMENT ON COLUMN Movie_Cast.cast_name IS '(CAST) 배우 이름';

COMMENT ON COLUMN Movie_Cast.cast_profile_path IS '(CAST) 배우 프로필';

COMMENT ON COLUMN Movie_Cast.credit_order IS '(CAST) 배우 순서';

-- 1-10. Movie_Crew
CREATE TABLE Movie_Crew
(
  credit_idx        NUMBER        NOT NULL,
  tmdb_movie_id     NUMBER        NOT NULL,
  tmdb_crew_id      NUMBER       ,
  crew_name         VARCHAR2(1000),
  crew_profile_path VARCHAR2(1000),
  job               VARCHAR2(1000),
  CONSTRAINT PK_Movie_Crew PRIMARY KEY (credit_idx)
);

COMMENT ON TABLE Movie_Crew IS '감독 정보';

COMMENT ON COLUMN Movie_Crew.credit_idx IS '크루 인덱스';

COMMENT ON COLUMN Movie_Crew.tmdb_movie_id IS 'tmdb_movie_id';

COMMENT ON COLUMN Movie_Crew.tmdb_crew_id IS '(CREW) tmdb_crew_id';

COMMENT ON COLUMN Movie_Crew.crew_name IS '(CREW) 감독이름';

COMMENT ON COLUMN Movie_Crew.crew_profile_path IS '(CREW) 감독 프로필';

COMMENT ON COLUMN Movie_Crew.job IS '(CREW) 직무(Director)';

-- 1-11. Movie_Genres
CREATE TABLE Movie_Genres
(
  MG_idx    NUMBER NOT NULL,
  movie_idx NUMBER NOT NULL,
  genre_id  NUMBER NOT NULL,
  CONSTRAINT PK_Movie_Genres PRIMARY KEY (MG_idx)
);

COMMENT ON TABLE Movie_Genres IS '영화-장르 매핑';

COMMENT ON COLUMN Movie_Genres.MG_idx IS '매핑 인덱스';

COMMENT ON COLUMN Movie_Genres.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Movie_Genres.genre_id IS '장르 아이디';

-- 1-12. Movie_VS
CREATE TABLE Movie_VS
(
  VS_idx     NUMBER    NOT NULL,
  VS_round   NUMBER    NOT NULL,
  pair       NUMBER    NOT NULL,
  movie_VS1  NUMBER    NOT NULL,
  movie_VS2  NUMBER    NOT NULL,
  active     NUMBER(1) DEFAULT 0 NOT NULL,
  start_date DATE      NOT NULL,
  end_date   DATE     ,
  CONSTRAINT PK_Movie_VS PRIMARY KEY (VS_idx)
);

COMMENT ON TABLE Movie_VS IS 'VS 투표하는 영화';

COMMENT ON COLUMN Movie_VS.VS_idx IS 'VS 인덱스';

COMMENT ON COLUMN Movie_VS.VS_round IS '회차';

COMMENT ON COLUMN Movie_VS.pair IS '회차내 VS 번호';

COMMENT ON COLUMN Movie_VS.movie_VS1 IS '투표 영화1';

COMMENT ON COLUMN Movie_VS.movie_VS2 IS '투표 영화2';

COMMENT ON COLUMN Movie_VS.active IS '투표 진행 유무 (0: no, 1: yes)';

COMMENT ON COLUMN Movie_VS.start_date IS '시작일';

COMMENT ON COLUMN Movie_VS.end_date IS '종료일';

-- 1-13. Movie_Vote
CREATE TABLE Movie_Vote
(
  vote_idx  NUMBER        NOT NULL,
  VS_idx    NUMBER        NOT NULL,
  user_id   VARCHAR2(100) NOT NULL,
  movie_idx NUMBER        NOT NULL,
  VS_date   DATE          DEFAULT sysdate NOT NULL,
  CONSTRAINT PK_Movie_Vote PRIMARY KEY (vote_idx)
);

COMMENT ON TABLE Movie_Vote IS 'VS 투표';

COMMENT ON COLUMN Movie_Vote.vote_idx IS '투표 인덱스';

COMMENT ON COLUMN Movie_Vote.VS_idx IS 'VS 인덱스';

COMMENT ON COLUMN Movie_Vote.user_id IS '투표한 사용자';

COMMENT ON COLUMN Movie_Vote.movie_idx IS '투표하는 영화 인덱스(영화 확인용)';

COMMENT ON COLUMN Movie_Vote.VS_date IS 'VS 투표 날짜';

-- 1-14. Ranking
CREATE TABLE Ranking
(
  ranking_idx   NUMBER NOT NULL,
  movie_idx     NUMBER NOT NULL,
  ranking_count BINARY_DOUBLE,
  created_date  DATE   DEFAULT sysdate,
  CONSTRAINT PK_Ranking PRIMARY KEY (ranking_idx)
);

COMMENT ON TABLE Ranking IS '영화 랭킹';

COMMENT ON COLUMN Ranking.ranking_idx IS '영화 랭킹 인덱스';

COMMENT ON COLUMN Ranking.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Ranking.ranking_count IS '영화 평균 별점';

COMMENT ON COLUMN Ranking.created_date IS '랭킹 기준 날짜';

-- 1-15. Videos
CREATE TABLE Videos
(
  video_idx    NUMBER        NOT NULL,
  movie_idx    NUMBER        NOT NULL,
  title        VARCHAR2(255),
  video_type   VARCHAR2(50) ,
  video_url    VARCHAR2(255),
  thumbnail_url VARCHAR2(255),
  CONSTRAINT PK_Videos PRIMARY KEY (video_idx)
);

COMMENT ON TABLE Videos IS '관련 비디오';

COMMENT ON COLUMN Videos.video_idx IS '비디오 인덱스';

COMMENT ON COLUMN Videos.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Videos.title IS '비디오 제목';

COMMENT ON COLUMN Videos.video_type IS '트레일러, 티저, 메이킹 영상 등';

COMMENT ON COLUMN Videos.video_url IS '영상 링크';

COMMENT ON COLUMN Videos.thumbnail_url IS '영상 썸네일 이미지 주소';

-- 1-16. SoundTrack
CREATE TABLE Sound_Track
(
  soundtrack_idx NUMBER        NOT NULL,
  movie_idx      NUMBER        NOT NULL,
  title          VARCHAR2(100),
  artist         VARCHAR2(255),
  playback_url   VARCHAR2(255),
  CONSTRAINT PK_Sound_Track PRIMARY KEY (soundtrack_idx)
);

COMMENT ON TABLE Sound_Track IS 'OST정보';

COMMENT ON COLUMN Sound_Track.soundtrack_idx IS 'ost 인덱스';

COMMENT ON COLUMN Sound_Track.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Sound_Track.title IS 'ost제목';

COMMENT ON COLUMN Sound_Track.artist IS '작곡가';

COMMENT ON COLUMN Sound_Track.playback_url IS 'ost 링크';

-- ===========================
-- 2. FK 생성
-- ===========================

ALTER TABLE Review
  ADD CONSTRAINT FK_Users_TO_Review
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id);

ALTER TABLE Bookmark
  ADD CONSTRAINT FK_Users_TO_Bookmark
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id);

ALTER TABLE Comments
  ADD CONSTRAINT FK_Users_TO_Comments
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id);

ALTER TABLE Comments
  ADD CONSTRAINT FK_Review_TO_Comments
    FOREIGN KEY (review_idx)
    REFERENCES Review (review_idx);

ALTER TABLE Notice
  ADD CONSTRAINT FK_Users_TO_Notice
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id);

ALTER TABLE Ranking
  ADD CONSTRAINT FK_Movie_Info_TO_Ranking
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_VS
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_VS
    FOREIGN KEY (movie_VS2)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Vote
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Users_TO_Movie_Vote
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Movie_VS_TO_Movie_Vote
    FOREIGN KEY (VS_idx)
    REFERENCES Movie_VS (VS_idx);

ALTER TABLE Videos
  ADD CONSTRAINT FK_Movie_Info_TO_Videos
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Articles
  ADD CONSTRAINT FK_Movie_Info_TO_Articles
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Genres
  ADD CONSTRAINT FK_Genres_TO_Movie_Genres
    FOREIGN KEY (genre_id)
    REFERENCES Genres (genre_idx);

ALTER TABLE Movie_Genres
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Genres
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_VS
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_VS1
    FOREIGN KEY (movie_VS1)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Sound_Track
  ADD CONSTRAINT FK_Movie_Info_TO_Sound_Track
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Cast
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Cast
    FOREIGN KEY (tmdb_movie_id)
    REFERENCES Movie_Info (tmdb_movie_id);

ALTER TABLE Movie_Crew
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Crew
    FOREIGN KEY (tmdb_movie_id)
    REFERENCES Movie_Info (tmdb_movie_id);

ALTER TABLE Review
  ADD CONSTRAINT FK_Movie_Info_TO_Review
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Bookmark
  ADD CONSTRAINT FK_Movie_Info_TO_Bookmark
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

-- ===========================
-- 3. 시퀀스 생성
-- ===========================

CREATE SEQUENCE SEQ_Articles START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Bookmark START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Comments START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_Info START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Review START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Notice START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Genres START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_Cast START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_Crew START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_Genres START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_VS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Movie_Vote START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Ranking START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Videos START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_Sound_Track START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- ===========================
-- 4. 트리거 생성 (PK 자동 증가)
-- ===========================

-- Articles
CREATE OR REPLACE TRIGGER TRG_Articles
BEFORE INSERT ON Articles
FOR EACH ROW
BEGIN
  IF :NEW.articles_idx IS NULL THEN
    :NEW.articles_idx := SEQ_Articles.NEXTVAL;
  END IF;
END;
/

-- Bookmark
CREATE OR REPLACE TRIGGER TRG_Bookmark
BEFORE INSERT ON Bookmark
FOR EACH ROW
BEGIN
  IF :NEW.bookmark_idx IS NULL THEN
    :NEW.bookmark_idx := SEQ_Bookmark.NEXTVAL;
  END IF;
END;
/

-- Comments
CREATE OR REPLACE TRIGGER TRG_Comments
BEFORE INSERT ON Comments
FOR EACH ROW
BEGIN
  IF :NEW.comment_idx IS NULL THEN
    :NEW.comment_idx := SEQ_Comments.NEXTVAL;
  END IF;
END;
/

-- Movie_Info
CREATE OR REPLACE TRIGGER TRG_Movie_Info
BEFORE INSERT ON Movie_Info
FOR EACH ROW
BEGIN
  IF :NEW.movie_idx IS NULL THEN
    :NEW.movie_idx := SEQ_Movie_Info.NEXTVAL;
  END IF;
END;
/

-- Review
CREATE OR REPLACE TRIGGER TRG_Review
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
  IF :NEW.review_idx IS NULL THEN
    :NEW.review_idx := SEQ_Review.NEXTVAL;
  END IF;
END;
/

-- Notice
CREATE OR REPLACE TRIGGER TRG_Notice
BEFORE INSERT ON Notice
FOR EACH ROW
BEGIN
  IF :NEW.notice_idx IS NULL THEN
    :NEW.notice_idx := SEQ_Notice.NEXTVAL;
  END IF;
END;
/

-- Genres
CREATE OR REPLACE TRIGGER TRG_Genres
BEFORE INSERT ON Genres
FOR EACH ROW
BEGIN
  IF :NEW.genre_idx IS NULL THEN
    :NEW.genre_idx := SEQ_Genres.NEXTVAL;
  END IF;
END;
/

-- Movie_Cast
CREATE OR REPLACE TRIGGER TRG_Movie_Cast
BEFORE INSERT ON Movie_Cast
FOR EACH ROW
BEGIN
  IF :NEW.cast_idx IS NULL THEN
    :NEW.cast_idx := SEQ_Movie_Cast.NEXTVAL;
  END IF;
END;
/

-- Movie_Crew
CREATE OR REPLACE TRIGGER TRG_Movie_Crew
BEFORE INSERT ON Movie_Crew
FOR EACH ROW
BEGIN
  IF :NEW.credit_idx IS NULL THEN
    :NEW.credit_idx := SEQ_Movie_Crew.NEXTVAL;
  END IF;
END;
/

-- Movie_Genres
CREATE OR REPLACE TRIGGER TRG_Movie_Genres
BEFORE INSERT ON Movie_Genres
FOR EACH ROW
BEGIN
  IF :NEW.MG_idx IS NULL THEN
    :NEW.MG_idx := SEQ_Movie_Genres.NEXTVAL;
  END IF;
END;
/

-- Movie_VS
CREATE OR REPLACE TRIGGER TRG_Movie_VS
BEFORE INSERT ON Movie_VS
FOR EACH ROW
BEGIN
  IF :NEW.VS_idx IS NULL THEN
    :NEW.VS_idx := SEQ_Movie_VS.NEXTVAL;
  END IF;
END;
/

-- Movie_Vote
CREATE OR REPLACE TRIGGER TRG_Movie_Vote
BEFORE INSERT ON Movie_Vote
FOR EACH ROW
BEGIN
  IF :NEW.vote_idx IS NULL THEN
    :NEW.vote_idx := SEQ_Movie_Vote.NEXTVAL;
  END IF;
END;
/

-- Ranking
CREATE OR REPLACE TRIGGER TRG_Ranking
BEFORE INSERT ON Ranking
FOR EACH ROW
BEGIN
  IF :NEW.ranking_idx IS NULL THEN
    :NEW.ranking_idx := SEQ_Ranking.NEXTVAL;
  END IF;
END;
/

-- Videos
CREATE OR REPLACE TRIGGER TRG_Videos
BEFORE INSERT ON Videos
FOR EACH ROW
BEGIN
  IF :NEW.video_idx IS NULL THEN
    :NEW.video_idx := SEQ_Videos.NEXTVAL;
  END IF;
END;
/

-- Sound_Track
CREATE OR REPLACE TRIGGER TRG_Sound_Track
BEFORE INSERT ON Sound_Track
FOR EACH ROW
BEGIN
  IF :NEW.soundtrack_idx IS NULL THEN
    :NEW.soundtrack_idx := SEQ_Sound_Track.NEXTVAL;
  END IF;
END;
/


-- -- Movie_Info.popularity -> Ranking.ranking_count 연동 트리거
-- CREATE OR REPLACE TRIGGER trg_update_ranking
-- AFTER UPDATE OF popularity ON Movie_Info
-- FOR EACH ROW
-- BEGIN
--     -- Ranking 테이블에 해당 movie_idx가 있으면 업데이트
--     UPDATE Ranking
--        SET ranking_count = :NEW.popularity,
--            created_date  = SYSDATE
--      WHERE movie_idx = :NEW.movie_idx;
--     -- 없으면 아무것도 하지 않음 (0행이면 그냥 넘어감)
-- END;
-- /