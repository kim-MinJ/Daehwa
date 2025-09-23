package org.iclass.backend.repository;

import java.util.List;
import java.util.Optional;

import org.iclass.backend.entity.MovieInfoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
    
    // tmdb_movie_id로 조회
    Optional<MovieInfoEntity> findByTmdbMovieId(Long tmdbMovieId);

    // 장르 이름으로 영화 조회 + 페이징
    @Query("SELECT mg.movie FROM MovieGenresEntity mg WHERE mg.genre.name = :genreName")
    Page<MovieInfoEntity> findMoviesByGenreName(@Param("genreName") String genreName, Pageable pageable);

    // 모든 영화 조회 + 장르 페치 + 페이징
    @Query("SELECT DISTINCT m FROM MovieInfoEntity m LEFT JOIN FETCH m.movieGenres mg LEFT JOIN FETCH mg.genre")
    Page<MovieInfoEntity> findAllWithGenres(Pageable pageable);

    @Query("SELECT DISTINCT m FROM MovieInfoEntity m LEFT JOIN FETCH m.movieGenres mg LEFT JOIN FETCH mg.genre")
    List<MovieInfoEntity> findAllWithGenresMovies();

    // 제목 포함 검색 + 페이징
    Page<MovieInfoEntity> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // 랜덤 영화 조회 (native query 그대로)
    @Query(value = """
    SELECT *
    FROM (
        SELECT * 
        FROM MOVIE_INFO
        ORDER BY POPULARITY DESC  -- 인기도 기준 정렬
        FETCH FIRST 30 ROWS ONLY   -- 상위 30개
    )
    ORDER BY DBMS_RANDOM.VALUE
    FETCH FIRST 1 ROWS ONLY
    """, nativeQuery = true)
    MovieInfoEntity findRandomMovie();

    // 연도 범위 조회 + 페이징
    @Query("SELECT m FROM MovieInfoEntity m WHERE YEAR(m.releaseDate) BETWEEN :startYear AND :endYear")
    Page<MovieInfoEntity> findByReleaseYearBetween(@Param("startYear") int startYear,
                                                   @Param("endYear") int endYear,
                                                   Pageable pageable);
}