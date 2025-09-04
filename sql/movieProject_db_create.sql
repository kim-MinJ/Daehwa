-- ===========================
-- 1. 테이블 생성 (FK 관계 고려)
-- ===========================

-- 1-1. Users
CREATE TABLE Users (
    user_id  VARCHAR2(100) NOT NULL,
    username VARCHAR2(50 CHAR) NOT NULL,
    password VARCHAR2(100 CHAR) NOT NULL,
    role     VARCHAR2(20) DEFAULT 'user',
    reg_date DATE DEFAULT sysdate,
    status   NUMBER(1) DEFAULT 0,
    CONSTRAINT PK_Users PRIMARY KEY (user_id)
);

ALTER TABLE Users MODIFY (password VARCHAR2(100));

-- 1-2. People
CREATE TABLE People (
    person_idx   NUMBER NOT NULL,
    tmdb_person_id NUMBER,
    name         VARCHAR2(100) NOT NULL,
    gender       NUMBER(1) NOT NULL,
    profile_path VARCHAR2(255),
    popularity   NUMBER,
    CONSTRAINT PK_People PRIMARY KEY (person_idx)
);

-- 1-3. Movie_Info
CREATE TABLE Movie_Info (
    movie_idx     NUMBER NOT NULL,
    tmdb_movie_id NUMBER,
    title         VARCHAR2(100),
    popularity    NUMBER DEFAULT 0,
    vote_count    NUMBER DEFAULT 0,
    vote_average  NUMBER DEFAULT 0,
    adult         NUMBER(1) DEFAULT 0 NOT NULL,
    overview      VARCHAR2(500) NOT NULL,
    backdrop_path VARCHAR2(255),
    poster_path   VARCHAR2(255),
    release_date  DATE,
    CONSTRAINT PK_Movie_Info PRIMARY KEY (movie_idx)
);

-- 1-4. Review
CREATE TABLE Review (
    review_idx NUMBER NOT NULL,
    userid     VARCHAR2(100) NOT NULL,
    content    VARCHAR2(255) NOT NULL,
    rationg    NUMBER DEFAULT 10 CHECK (rationg BETWEEN 1 AND 10),
    created_at DATE DEFAULT sysdate,
    update_at  DATE DEFAULT sysdate,
    isBlind    NUMBER(1) DEFAULT 0,
    CONSTRAINT PK_Review PRIMARY KEY (review_idx),
    CONSTRAINT FK_Users_TO_Review FOREIGN KEY (userid) REFERENCES Users(user_id)
);

-- 1-5. Articles
CREATE TABLE Articles (
    articles_idx NUMBER NOT NULL,
    movie_idx    NUMBER NOT NULL,
    title        VARCHAR2(255),
    source_name  VARCHAR2(255),
    article_url  VARCHAR2(255),
    published_at DATE,
    CONSTRAINT PK_Articles PRIMARY KEY (articles_idx),
    CONSTRAINT FK_Movie_Info_TO_Articles FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx)
);

-- 1-6. Bookmark
CREATE TABLE Bookmark (
    bookmark_idx NUMBER NOT NULL,
    userid       VARCHAR2(100) NOT NULL,
    CONSTRAINT PK_Bookmark PRIMARY KEY (bookmark_idx),
    CONSTRAINT FK_Users_TO_Bookmark FOREIGN KEY (userid) REFERENCES Users(user_id)
);

-- 1-7. Comment
CREATE TABLE Comments (
    comment_idx NUMBER NOT NULL,
    userid      VARCHAR2(100) NOT NULL,
    review_idx  NUMBER NOT NULL,
    content     VARCHAR2(255) NOT NULL,
    created_at  DATE DEFAULT sysdate,
    update_at   DATE DEFAULT sysdate,
    CONSTRAINT PK_Comment PRIMARY KEY (comment_idx),
    CONSTRAINT FK_Users_TO_Comment FOREIGN KEY (userid) REFERENCES Users(user_id),
    CONSTRAINT FK_Review_TO_Comment FOREIGN KEY (review_idx) REFERENCES Review(review_idx)
);

-- 1-8. Notice
CREATE TABLE Notice (
    notice_idx   NUMBER NOT NULL,
    userid       VARCHAR2(100) NOT NULL,
    title        VARCHAR2(255) NOT NULL,
    content      VARCHAR2(255) NOT NULL,
    created_date DATE DEFAULT sysdate,
    CONSTRAINT PK_Notice PRIMARY KEY (notice_idx),
    CONSTRAINT FK_Users_TO_Notice FOREIGN KEY (userid) REFERENCES Users(user_id)
);

-- 1-9. Genres
CREATE TABLE Genres (
    genre_idx NUMBER NOT NULL,
    genre_id  NUMBER NOT NULL,
    name      VARCHAR2(50) NOT NULL,
    CONSTRAINT PK_Genres PRIMARY KEY (genre_idx)
);

-- 1-10. Movie_Genres
CREATE TABLE Movie_Genres (
    MG_idx    NUMBER NOT NULL,
    movie_idx NUMBER NOT NULL,
    genre_id  NUMBER NOT NULL,
    CONSTRAINT PK_Movie_Genres PRIMARY KEY (MG_idx),
    CONSTRAINT FK_Genres_TO_Movie_Genres FOREIGN KEY (genre_id) REFERENCES Genres(genre_idx),
    CONSTRAINT FK_Movie_Info_TO_Movie_Genres FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx)
);

-- 1-11. Movie_Credits
CREATE TABLE Movie_Credits (
    credit_idx   NUMBER NOT NULL,
    movie_idx    NUMBER NOT NULL,
    person_idx   NUMBER NOT NULL,
    role_type    VARCHAR2(10),
    character    VARCHAR2(255),
    credit_order NUMBER,
    department   VARCHAR2(255),
    job          VARCHAR2(255),
    CONSTRAINT PK_Movie_Credits PRIMARY KEY (credit_idx),
    CONSTRAINT FK_Movie_Info_TO_Movie_Credits FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx),
    CONSTRAINT FK_People_TO_Movie_Credits FOREIGN KEY (person_idx) REFERENCES People(person_idx)
);

-- 1-12. Movie_VS
CREATE TABLE Movie_VS (
    VS_idx    NUMBER NOT NULL,
    movie_VS1 NUMBER NOT NULL,
    movie_VS2 NUMBER NOT NULL,
    actice    NUMBER(1) DEFAULT 0,
    CONSTRAINT PK_Movie_VS PRIMARY KEY (VS_idx),
    CONSTRAINT FK_Movie_Info_TO_Movie_VS FOREIGN KEY (movie_VS1) REFERENCES Movie_Info(movie_idx),
    CONSTRAINT FK_Movie_Info_TO_Movie_VS1 FOREIGN KEY (movie_VS2) REFERENCES Movie_Info(movie_idx)
);

-- 1-13. Movie_Vote
CREATE TABLE Movie_Vote (
    vote_idx  NUMBER NOT NULL,
    movie_idx NUMBER NOT NULL,
    userid    VARCHAR2(100) NOT NULL,
    VS_idx    NUMBER NOT NULL,
    CONSTRAINT PK_Movie_Vote PRIMARY KEY (vote_idx),
    CONSTRAINT FK_Movie_Info_TO_Movie_Vote FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx),
    CONSTRAINT FK_Users_TO_Movie_Vote FOREIGN KEY (userid) REFERENCES Users(user_id),
    CONSTRAINT FK_Movie_VS_TO_Movie_Vote FOREIGN KEY (VS_idx) REFERENCES Movie_VS(VS_idx)
);

-- 1-14. Ranking
CREATE TABLE Ranking (
    ranking_idx   NUMBER NOT NULL,
    movie_idx     NUMBER NOT NULL,
    ranking_count NUMBER,
    created_date  DATE DEFAULT sysdate,
    CONSTRAINT PK_Ranking PRIMARY KEY (ranking_idx),
    CONSTRAINT FK_Movie_Info_TO_Ranking FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx)
);

-- 1-15. Videos
CREATE TABLE Videos (
    video_idx    NUMBER NOT NULL,
    movie_idx    NUMBER NOT NULL,
    title        VARCHAR2(255),
    video_type   VARCHAR2(50),
    video_url    VARCHAR2(255),
    thumnail_url VARCHAR2(255),
    CONSTRAINT PK_Videos PRIMARY KEY (video_idx),
    CONSTRAINT FK_Movie_Info_TO_Videos FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx)
);

-- 1-16. SoundTrack
CREATE TABLE SoundTrack (
    soundtrack_id NUMBER NOT NULL,   -- ost 인덱스
    movie_idx     NUMBER NOT NULL,   -- 영화 인덱스 (FK)
    title         VARCHAR2(255),     -- ost 제목
    artist        VARCHAR2(255),     -- 작곡가
    playback_url  VARCHAR2(500),     -- ost 링크
    CONSTRAINT PK_SoundTrack PRIMARY KEY (soundtrack_id),
    CONSTRAINT FK_Movie_Info_TO_SoundTrack FOREIGN KEY (movie_idx) REFERENCES Movie_Info(movie_idx)
);

-- ===========================
-- 2. 시퀀스 생성
-- ===========================

CREATE SEQUENCE SEQ_Articles START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Bookmark START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_Comment START WITH 1 INCREMENT BY 1;
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
-- 3. 트리거 생성 (PK 자동 증가)
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

-- Comment
CREATE OR REPLACE TRIGGER TRG_Comment
BEFORE INSERT ON Comment
FOR EACH ROW
BEGIN
    IF :NEW.comment_idx IS NULL THEN
        SELECT SEQ_Comment.NEXTVAL INTO :NEW.comment_idx FROM dual;
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
    IF :NEW.soundtrack_id IS NULL THEN
        SELECT SEQ_SoundTrack.NEXTVAL 
        INTO :NEW.soundtrack_id 
        FROM dual;
    END IF;
END;