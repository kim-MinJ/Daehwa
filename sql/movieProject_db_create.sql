-- ===========================
-- 1. 테이블 생성
-- ===========================

-- 1-1. Users
CREATE TABLE Users
(
  user_id  VARCHAR2(100)     NOT NULL,
  username VARCHAR2(50 CHAR) NOT NULL,
  password VARCHAR2(16 CHAR) NOT NULL,
  role     VARCHAR2(20)      DEFAULT 'user',
  reg_date DATE              DEFAULT sysdate,
  status   NUMBER(1)         DEFAULT 0,
  CONSTRAINT PK_Users PRIMARY KEY (user_id)
);

ALTER TABLE Users
  ADD CONSTRAINT UQ_user_id UNIQUE (user_id);

COMMENT ON TABLE Users IS '회원관리';

COMMENT ON COLUMN Users.user_id IS '이메일주소';

COMMENT ON COLUMN Users.username IS '사용자이름';

COMMENT ON COLUMN Users.password IS '비밀번호';

COMMENT ON COLUMN Users.role IS '역할';

COMMENT ON COLUMN Users.reg_date IS '회원가입 날짜';

COMMENT ON COLUMN Users.status IS '로그인(0: off, 1: on)';

-- 1-2. People
CREATE TABLE People
(
  person_idx     NUMBER        NOT NULL,
  tmdb_person_id NUMBER       ,
  name           VARCHAR2(100) NOT NULL,
  gender         NUMBER(1)     NOT NULL,
  profile_path   VARCHAR2(255),
  popularity     NUMBER       ,
  CONSTRAINT PK_People PRIMARY KEY (person_idx)
);

ALTER TABLE People
  ADD CONSTRAINT UQ_person_idx UNIQUE (person_idx);

ALTER TABLE People
  ADD CONSTRAINT UQ_tmdb_person_id UNIQUE (tmdb_person_id);

COMMENT ON TABLE People IS '인물 정보';

COMMENT ON COLUMN People.person_idx IS '인물정보 인덱스';

COMMENT ON COLUMN People.tmdb_person_id IS 'tmdb_person_id';

COMMENT ON COLUMN People.name IS '인물 이름';

COMMENT ON COLUMN People.gender IS '성별 (0: 남, 1: 여)';

COMMENT ON COLUMN People.profile_path IS '프로필 이미지 경로';

COMMENT ON COLUMN People.popularity IS '인물 인기도';

-- 1-3. Movie_Info
CREATE TABLE Movie_Info
(
  movie_idx     NUMBER              NOT NULL,
  tmdb_movie_id NUMBER              NOT NULL,
  title         VARCHAR2(500 CHAR) ,
  popularity    NUMBER              DEFAULT 0,
  vote_count    NUMBER              DEFAULT 0,
  vote_average  NUMBER              DEFAULT 0,
  adult         NUMBER(1)           DEFAULT 0 NOT NULL,
  overview      VARCHAR2(2000 CHAR),
  backdrop_path VARCHAR2(255)      ,
  poster_path   VARCHAR2(255)      ,
  release_date  DATE               ,
  CONSTRAINT PK_Movie_Info PRIMARY KEY (movie_idx)
);

ALTER TABLE Movie_Info
  ADD CONSTRAINT UQ_movie_idx UNIQUE (movie_idx);

COMMENT ON TABLE Movie_Info IS '영화 정보';

COMMENT ON COLUMN Movie_Info.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Movie_Info.tmdb_movie_id IS 'tmdb_movie_id';

COMMENT ON COLUMN Movie_Info.title IS '영화 제목';

COMMENT ON COLUMN Movie_Info.popularity IS '별점 합계';

COMMENT ON COLUMN Movie_Info.vote_count IS '투표 숫자';

COMMENT ON COLUMN Movie_Info.vote_average IS '별점 평균';

COMMENT ON COLUMN Movie_Info.adult IS '성인영화 유무 (0: false, 1: true)';

COMMENT ON COLUMN Movie_Info.overview IS '영화 설명';

COMMENT ON COLUMN Movie_Info.backdrop_path IS '영화 상세 배경화면 경로';

COMMENT ON COLUMN Movie_Info.poster_path IS '영화 상세 포스터 경로';

COMMENT ON COLUMN Movie_Info.release_date IS '영화 개봉일';

-- 1-4. Review
CREATE TABLE Review
(
  review_idx NUMBER              NOT NULL,
  userid     VARCHAR2(100)       NOT NULL,
  content    VARCHAR2(2000 CHAR) NOT NULL,
  rating     NUMBER              DEFAULT 10 CHECK (rating BETWEEN 1 AND 10),
  created_at DATE                DEFAULT sysdate,
  update_at  DATE                DEFAULT sysdate,
  isBlind    NUMBER(1)           DEFAULT 0,
  CONSTRAINT PK_Review PRIMARY KEY (review_idx)
);

ALTER TABLE Review
  ADD CONSTRAINT UQ_review_idx UNIQUE (review_idx);

COMMENT ON TABLE Review IS '리뷰';

COMMENT ON COLUMN Review.review_idx IS '리뷰 인덱스';

COMMENT ON COLUMN Review.userid IS '이메일주소';

COMMENT ON COLUMN Review.content IS '리뷰 내용';

COMMENT ON COLUMN Review.rating IS '별점 (1~10)';

COMMENT ON COLUMN Review.created_at IS '작성 날짜';

COMMENT ON COLUMN Review.update_at IS '수정 날짜';

COMMENT ON COLUMN Review.isBlind IS '블라인드 (0: off, 1: on)';

-- 1-5. Articles
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

ALTER TABLE Articles
  ADD CONSTRAINT UQ_articles_idx UNIQUE (articles_idx);

COMMENT ON TABLE Articles IS '관련 기사';

COMMENT ON COLUMN Articles.articles_idx IS '기사 인덱스';

COMMENT ON COLUMN Articles.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Articles.title IS '기사 제목';

COMMENT ON COLUMN Articles.source_name IS '출처';

COMMENT ON COLUMN Articles.article_url IS '기사 링크';

COMMENT ON COLUMN Articles.published_at IS '기사 발행일';

-- 1-6. Bookmark
CREATE TABLE Bookmark
(
  bookmark_idx NUMBER        NOT NULL,
  userid       VARCHAR2(100) NOT NULL,
  CONSTRAINT PK_Bookmark PRIMARY KEY (bookmark_idx)
);

ALTER TABLE Bookmark
  ADD CONSTRAINT UQ_bookmark_idx UNIQUE (bookmark_idx);

COMMENT ON TABLE Bookmark IS '북마크';

COMMENT ON COLUMN Bookmark.bookmark_idx IS '북마크 인덱스';

COMMENT ON COLUMN Bookmark.userid IS '이메일주소';

-- 1-7. Comments
CREATE TABLE Comments
(
  comment_idx NUMBER              NOT NULL,
  userid      VARCHAR2(100)       NOT NULL,
  review_idx  NUMBER              NOT NULL,
  content     VARCHAR2(2000 CHAR) NOT NULL,
  created_at  DATE                DEFAULT sysdate,
  update_at   DATE                DEFAULT sysdate,
  CONSTRAINT PK_Comments PRIMARY KEY (comment_idx)
);

ALTER TABLE Comments
  ADD CONSTRAINT UQ_comment_idx UNIQUE (comment_idx);

COMMENT ON TABLE Comments IS '댓글';

COMMENT ON COLUMN Comments.comment_idx IS '댓글 인덱스';

COMMENT ON COLUMN Comments.userid IS '이메일주소';

COMMENT ON COLUMN Comments.review_idx IS '리뷰 인덱스';

COMMENT ON COLUMN Comments.content IS '댓글 내용';

COMMENT ON COLUMN Comments.created_at IS '작성 날짜';

COMMENT ON COLUMN Comments.update_at IS '수정 날짜';


-- 1-8. Notice
CREATE TABLE Notice
(
  notice_idx   NUMBER              NOT NULL,
  userid       VARCHAR2(100)       NOT NULL,
  title        VARCHAR2(255)       NOT NULL,
  content      VARCHAR2(2000 CHAR) NOT NULL,
  created_date DATE                DEFAULT sysdate,
  CONSTRAINT PK_Notice PRIMARY KEY (notice_idx)
);

ALTER TABLE Notice
  ADD CONSTRAINT UQ_notice_idx UNIQUE (notice_idx);

COMMENT ON TABLE Notice IS '공지사항';

COMMENT ON COLUMN Notice.notice_idx IS '공지사항 인덱스';

COMMENT ON COLUMN Notice.userid IS '이메일주소';

COMMENT ON COLUMN Notice.title IS '공지 제목';

COMMENT ON COLUMN Notice.content IS '공지 내용';

COMMENT ON COLUMN Notice.created_date IS '작성 날짜';

-- 1-9. Genres
CREATE TABLE Genres
(
  genre_idx NUMBER       NOT NULL,
  genre_id  NUMBER       NOT NULL,
  name      VARCHAR2(50) NOT NULL,
  CONSTRAINT PK_Genres PRIMARY KEY (genre_idx)
);

ALTER TABLE Genres
  ADD CONSTRAINT UQ_genre_idx UNIQUE (genre_idx);

ALTER TABLE Genres
  ADD CONSTRAINT UQ_genre_id UNIQUE (genre_id);

ALTER TABLE Genres
  ADD CONSTRAINT UQ_name UNIQUE (name);

COMMENT ON TABLE Genres IS '장르';

COMMENT ON COLUMN Genres.genre_idx IS '장르 인덱스';

COMMENT ON COLUMN Genres.genre_id IS '장르 아이디';

COMMENT ON COLUMN Genres.name IS '장르명';

-- 1-10. Movie_Genres
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

-- 1-11. Movie_Credits
CREATE TABLE Movie_Credits
(
  credit_idx   NUMBER        NOT NULL,
  movie_idx    NUMBER        NOT NULL,
  person_idx   NUMBER        NOT NULL,
  role_type    VARCHAR2(10) ,
  character    VARCHAR2(255),
  credit_order NUMBER       ,
  department   VARCHAR2(255),
  job          VARCHAR2(255),
  CONSTRAINT PK_Movie_Credits PRIMARY KEY (credit_idx)
);

ALTER TABLE Movie_Credits
  ADD CONSTRAINT UQ_credit_idx UNIQUE (credit_idx);

COMMENT ON TABLE Movie_Credits IS '영화 참여 정보';

COMMENT ON COLUMN Movie_Credits.credit_idx IS '크레딧 인덱스';

COMMENT ON COLUMN Movie_Credits.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Movie_Credits.person_idx IS '인물정보 인덱스';

COMMENT ON COLUMN Movie_Credits.role_type IS 'CAST or CREW 구분';

COMMENT ON COLUMN Movie_Credits.character IS '(CAST) 배역 이름';

COMMENT ON COLUMN Movie_Credits.credit_order IS '(CAST) 크레딧 순서';

COMMENT ON COLUMN Movie_Credits.department IS '(CREW) 소속 부서';

COMMENT ON COLUMN Movie_Credits.job IS '(CREW) 직무';


-- 1-12. Movie_VS
CREATE TABLE Movie_VS
(
  VS_idx    NUMBER    NOT NULL,
  movie_VS1 NUMBER    NOT NULL,
  movie_VS2 NUMBER    NOT NULL,
  active    NUMBER(1) DEFAULT 0,
  CONSTRAINT PK_Movie_VS PRIMARY KEY (VS_idx)
);

ALTER TABLE Movie_VS
  ADD CONSTRAINT UQ_VS_idx UNIQUE (VS_idx);

COMMENT ON TABLE Movie_VS IS 'VS 투표하는 영화';

COMMENT ON COLUMN Movie_VS.VS_idx IS 'VS 인덱스';

COMMENT ON COLUMN Movie_VS.movie_VS1 IS '투표 영화1';

COMMENT ON COLUMN Movie_VS.movie_VS2 IS '투표 영화2';

COMMENT ON COLUMN Movie_VS.active IS '투표 진행 유무 (0: no, 1: yes)';

-- 1-13. Movie_Vote
CREATE TABLE Movie_Vote
(
  vote_idx  NUMBER        NOT NULL,
  movie_idx NUMBER        NOT NULL,
  userid    VARCHAR2(100) NOT NULL,
  VS_idx    NUMBER        NOT NULL,
  CONSTRAINT PK_Movie_Vote PRIMARY KEY (vote_idx)
);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT UQ_vote_idx UNIQUE (vote_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT UQ_movie_idx UNIQUE (movie_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT UQ_userid UNIQUE (userid);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT UQ_VS_idx UNIQUE (VS_idx);

COMMENT ON TABLE Movie_Vote IS 'VS 투표';

COMMENT ON COLUMN Movie_Vote.vote_idx IS '투표 인덱스';

COMMENT ON COLUMN Movie_Vote.movie_idx IS '투표하는 영화 인덱스';

COMMENT ON COLUMN Movie_Vote.userid IS '투표한 사용자';

COMMENT ON COLUMN Movie_Vote.VS_idx IS '중복 투표 확인';

-- 1-14. Ranking
CREATE TABLE Ranking
(
  ranking_idx   NUMBER NOT NULL,
  movie_idx     NUMBER NOT NULL,
  ranking_count NUMBER,
  created_date  DATE   DEFAULT sysdate,
  CONSTRAINT PK_Ranking PRIMARY KEY (ranking_idx)
);

ALTER TABLE Ranking
  ADD CONSTRAINT UQ_ranking_idx UNIQUE (ranking_idx);

COMMENT ON TABLE Ranking IS '영화 랭킹';

COMMENT ON COLUMN Ranking.ranking_idx IS '영화 랭킹 인덱스';

COMMENT ON COLUMN Ranking.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Ranking.ranking_count IS 'Movie_Info의 popularity 값 (트리거로 연동)';

COMMENT ON COLUMN Ranking.created_date IS '랭킹 기준 날짜';


-- 1-15. Videos
CREATE TABLE Videos
(
  video_idx    NUMBER        NOT NULL,
  movie_idx    NUMBER        NOT NULL,
  title        VARCHAR2(255),
  video_type   VARCHAR2(50) ,
  video_url    VARCHAR2(255),
  thumnail_url VARCHAR2(255),
  CONSTRAINT PK_Videos PRIMARY KEY (video_idx)
);

COMMENT ON TABLE Videos IS '관련 비디오';

COMMENT ON COLUMN Videos.video_idx IS '비디오 인덱스';

COMMENT ON COLUMN Videos.movie_idx IS '영화 인덱스';

COMMENT ON COLUMN Videos.title IS '비디오 제목';

COMMENT ON COLUMN Videos.video_type IS '트레일러, 티저, 메이킹 영상 등';

COMMENT ON COLUMN Videos.video_url IS '영상 링크';

COMMENT ON COLUMN Videos.thumnail_url IS '영상 썸네일 이미지 주소';

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

ALTER TABLE Sound_Track
  ADD CONSTRAINT UQ_soundtrack_idx UNIQUE (soundtrack_idx);

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
    FOREIGN KEY (userid)
    REFERENCES Users (user_id);

ALTER TABLE Bookmark
  ADD CONSTRAINT FK_Users_TO_Bookmark
    FOREIGN KEY (userid)
    REFERENCES Users (user_id);

ALTER TABLE Comments
  ADD CONSTRAINT FK_Users_TO_Comments
    FOREIGN KEY (userid)
    REFERENCES Users (user_id);

ALTER TABLE Comments
  ADD CONSTRAINT FK_Review_TO_Comments
    FOREIGN KEY (review_idx)
    REFERENCES Review (review_idx);

ALTER TABLE Notice
  ADD CONSTRAINT FK_Users_TO_Notice
    FOREIGN KEY (userid)
    REFERENCES Users (user_id);

ALTER TABLE Ranking
  ADD CONSTRAINT FK_Movie_Info_TO_Ranking
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_VS
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_VS
    FOREIGN KEY (movie_VS1)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_VS
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_VS1
    FOREIGN KEY (movie_VS2)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Vote
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Users_TO_Movie_Vote
    FOREIGN KEY (userid)
    REFERENCES Users (user_id);

ALTER TABLE Movie_Vote
  ADD CONSTRAINT FK_Movie_VS_TO_Movie_Vote
    FOREIGN KEY (VS_idx)
    REFERENCES Movie_VS (VS_idx);

ALTER TABLE Movie_Credits
  ADD CONSTRAINT FK_Movie_Info_TO_Movie_Credits
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

ALTER TABLE Movie_Credits
  ADD CONSTRAINT FK_People_TO_Movie_Credits
    FOREIGN KEY (person_idx)
    REFERENCES People (person_idx);

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

ALTER TABLE Sound_Track
  ADD CONSTRAINT FK_Movie_Info_TO_Sound_Track
    FOREIGN KEY (movie_idx)
    REFERENCES Movie_Info (movie_idx);

-- ===========================
-- 3. 시퀀스 생성
-- ===========================

CREATE SEQUENCE SEQ_Articles START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Bookmark START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Comments START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Genres START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Movie_Genres START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Movie_Credits START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Movie_Info START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Movie_Vote START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Movie_VS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Notice START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_People START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Ranking START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Review START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Videos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_SoundTrack START WITH 1 INCREMENT BY 1;

-- ===========================
-- 4. 트리거 생성 (PK 자동 증가)
-- ===========================

-- Articles
CREATE OR REPLACE TRIGGER TRG_Articles
BEFORE INSERT ON Articles
FOR EACH ROW
BEGIN
    IF :NEW.articles_idx IS NULL THEN
        SELECT SEQ_Articles.NEXTVAL INTO :NEW.articles_idx FROM dual;
    END IF;
END;
/

-- Bookmark
CREATE OR REPLACE TRIGGER TRG_Bookmark
BEFORE INSERT ON Bookmark
FOR EACH ROW
BEGIN
    IF :NEW.bookmark_idx IS NULL THEN
        SELECT SEQ_Bookmark.NEXTVAL INTO :NEW.bookmark_idx FROM dual;
    END IF;
END;
/

-- Comments
CREATE OR REPLACE TRIGGER TRG_Comments
BEFORE INSERT ON Comments
FOR EACH ROW
BEGIN
    IF :NEW.comment_idx IS NULL THEN
        SELECT SEQ_Comments.NEXTVAL INTO :NEW.comment_idx FROM dual;
    END IF;
END;
/

-- Genres
CREATE OR REPLACE TRIGGER TRG_Genres
BEFORE INSERT ON Genres
FOR EACH ROW
BEGIN
    IF :NEW.genre_idx IS NULL THEN
        SELECT SEQ_Genres.NEXTVAL INTO :NEW.genre_idx FROM dual;
    END IF;
END;
/

-- Movie_Genres
CREATE OR REPLACE TRIGGER TRG_Movie_Genres
BEFORE INSERT ON Movie_Genres
FOR EACH ROW
BEGIN
    IF :NEW.MG_idx IS NULL THEN
        SELECT SEQ_Movie_Genres.NEXTVAL INTO :NEW.MG_idx FROM dual;
    END IF;
END;
/

-- Movie_Credits
CREATE OR REPLACE TRIGGER TRG_Movie_Credits
BEFORE INSERT ON Movie_Credits
FOR EACH ROW
BEGIN
    IF :NEW.credit_idx IS NULL THEN
        SELECT SEQ_Movie_Credits.NEXTVAL INTO :NEW.credit_idx FROM dual;
    END IF;
END;
/

-- Movie_Info
CREATE OR REPLACE TRIGGER TRG_Movie_Info
BEFORE INSERT ON Movie_Info
FOR EACH ROW
BEGIN
    IF :NEW.movie_idx IS NULL THEN
        SELECT SEQ_Movie_Info.NEXTVAL INTO :NEW.movie_idx FROM dual;
    END IF;
END;
/

-- Movie_Vote
CREATE OR REPLACE TRIGGER TRG_Movie_Vote
BEFORE INSERT ON Movie_Vote
FOR EACH ROW
BEGIN
    IF :NEW.vote_idx IS NULL THEN
        SELECT SEQ_Movie_Vote.NEXTVAL INTO :NEW.vote_idx FROM dual;
    END IF;
END;
/

-- Movie_VS
CREATE OR REPLACE TRIGGER TRG_Movie_VS
BEFORE INSERT ON Movie_VS
FOR EACH ROW
BEGIN
    IF :NEW.VS_idx IS NULL THEN
        SELECT SEQ_Movie_VS.NEXTVAL INTO :NEW.VS_idx FROM dual;
    END IF;
END;
/

-- Notice
CREATE OR REPLACE TRIGGER TRG_Notice
BEFORE INSERT ON Notice
FOR EACH ROW
BEGIN
    IF :NEW.notice_idx IS NULL THEN
        SELECT SEQ_Notice.NEXTVAL INTO :NEW.notice_idx FROM dual;
    END IF;
END;
/

-- People
CREATE OR REPLACE TRIGGER TRG_People
BEFORE INSERT ON People
FOR EACH ROW
BEGIN
    IF :NEW.person_idx IS NULL THEN
        SELECT SEQ_People.NEXTVAL INTO :NEW.person_idx FROM dual;
    END IF;
END;
/

-- Ranking
CREATE OR REPLACE TRIGGER TRG_Ranking
BEFORE INSERT ON Ranking
FOR EACH ROW
BEGIN
    IF :NEW.ranking_idx IS NULL THEN
        SELECT SEQ_Ranking.NEXTVAL INTO :NEW.ranking_idx FROM dual;
    END IF;
END;
/

-- Review
CREATE OR REPLACE TRIGGER TRG_Review
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    IF :NEW.review_idx IS NULL THEN
        SELECT SEQ_Review.NEXTVAL INTO :NEW.review_idx FROM dual;
    END IF;
END;
/

-- Videos
CREATE OR REPLACE TRIGGER TRG_Videos
BEFORE INSERT ON Videos
FOR EACH ROW
BEGIN
    IF :NEW.video_idx IS NULL THEN
        SELECT SEQ_Videos.NEXTVAL INTO :NEW.video_idx FROM dual;
    END IF;
END;
/

-- SoundTrack
CREATE OR REPLACE TRIGGER TRG_SoundTrack
BEFORE INSERT ON SoundTrack
FOR EACH ROW
BEGIN
    IF :NEW.soundtrack_idx IS NULL THEN
        SELECT SEQ_SoundTrack.NEXTVAL 
        INTO :NEW.soundtrack_idx 
        FROM dual;
    END IF;
END;
/

-- Movie_Info.popularity -> Ranking.ranking_count 연동 트리거
CREATE OR REPLACE TRIGGER trg_update_ranking
AFTER UPDATE OF popularity ON Movie_Info
FOR EACH ROW
BEGIN
    -- Ranking 테이블에 해당 movie_idx가 있으면 업데이트
    UPDATE Ranking
       SET ranking_count = :NEW.popularity,
           created_date  = SYSDATE
     WHERE movie_idx = :NEW.movie_idx;
    -- 없으면 아무것도 하지 않음 (0행이면 그냥 넘어감)
END;
/