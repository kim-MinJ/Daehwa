-- ===========================
-- 0. 기존 테이블, 시퀀스, 트리거 삭제
-- ===========================

-- 트리거 삭제
BEGIN
    FOR t IN (SELECT trigger_name FROM user_triggers) LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || t.trigger_name;
    END LOOP;
END;
/

-- 테이블 삭제 (FK 고려: 자식 테이블 먼저)
BEGIN
    FOR t IN (
        SELECT table_name
        FROM user_tables
        WHERE table_name IN (
            'ARTICLES','BOOKMARK','COMMENT','GENRES','MOVIE_GENRES',
            'MOVIE_CREDITS','MOVIE_INFO','MOVIE_VOTE','MOVIE_VS','NOTICE',
            'PEOPLE','RANKING','REVIEW','USERS','VIDEOS'
        )
    )
    LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
END;
/

-- 시퀀스 삭제
BEGIN
    FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/