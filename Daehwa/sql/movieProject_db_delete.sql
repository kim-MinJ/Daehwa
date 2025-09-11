-- ===========================
-- 0. 기존 테이블, 시퀀스, 트리거 삭제
-- ===========================

-- 트리거 삭제
BEGIN
    FOR t IN (SELECT trigger_name FROM user_triggers WHERE trigger_name LIKE 'TRG_%') LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || t.trigger_name;
    END LOOP;
END;
/

-- 테이블 삭제 (자식 → 부모 순 고려)
BEGIN
    FOR t IN (
        SELECT table_name
        FROM user_tables
        WHERE table_name IN (
            'ARTICLES','BOOKMARK','COMMENTS','MOVIE_INFO','REVIEW',
            'NOTICE','GENRES','MOVIE_CAST','MOVIE_CREW','MOVIE_GENRES',
            'MOVIE_VS','MOVIE_VOTE','RANKING','VIDEOS','SOUND_TRACK','USERS'
        )
    ) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
END;
/

-- 시퀀스 삭제
BEGIN
    FOR s IN (SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'SEQ_%') LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/

-- 중복 데이터 검사
SELECT *
FROM movie_info
WHERE tmdb_movie_id IN (
    SELECT tmdb_movie_id
    FROM movie_info
    GROUP BY tmdb_movie_id
    HAVING COUNT(*) > 1
)
ORDER BY tmdb_movie_id;

-- 중복 데이터 삭제
DELETE FROM movie_info
WHERE id NOT IN (
    SELECT MIN(id)
    FROM movie_info
    GROUP BY tmdb_movie_id
);

DELETE FROM Movie_Genres
WHERE movie_idx IN (
    SELECT movie_idx
    FROM (
        SELECT movie_idx,
               ROW_NUMBER() OVER (PARTITION BY tmdb_movie_id ORDER BY movie_idx) AS rn
        FROM Movie_Info
    )
    WHERE rn > 1
);

DELETE FROM Movie_Info
WHERE movie_idx IN (
    SELECT movie_idx
    FROM (
        SELECT movie_idx,
               ROW_NUMBER() OVER (PARTITION BY tmdb_movie_id ORDER BY movie_idx) AS rn
        FROM Movie_Info
    )
    WHERE rn > 1
);