package org.iclass.backend.repository;

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
    List<MovieInfoEntity> findMoviesByGenreName(@Param("genreName") String genreName);

    @Query("SELECT mg.movie FROM MovieGenresEntity mg WHERE mg.genre.genreId = :genreId")
    List<MovieInfoEntity> findMoviesByGenreId(@Param("genreId") Long genreId);

    // 모든 영화 조회 + 장르 페치 + 페이징
    @Query("SELECT DISTINCT m FROM MovieInfoEntity m LEFT JOIN FETCH m.movieGenres mg LEFT JOIN FETCH mg.genre")
    Page<MovieInfoEntity> findAllWithGenres(Pageable pageable);

    // 제목 포함 검색 + 페이징
    Page<MovieInfoEntity> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // 랜덤 영화 조회 (native query 그대로)
    @Query(value = "SELECT * FROM MOVIE_INFO ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 1 ROWS ONLY", nativeQuery = true)
    MovieInfoEntity findRandomMovie();
}
