package org.iclass.backend.repository;

import org.iclass.backend.entity.FeelingGenreEntity;
import org.iclass.backend.entity.GenresEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.springframework.data.domain.Pageable; // ★ 수정: 올바른 Pageable
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface FeelingGenreRepository extends JpaRepository<FeelingGenreEntity, Long> {
  List<FeelingGenreEntity> findByFeelingType(String feelingType);

  boolean existsByFeelingTypeAndGenreAndMovie(String feelingType, GenresEntity genre, MovieInfoEntity movie);

  @Query(value = """
                            SELECT DISTINCT m.*
      FROM movie_info m
      JOIN feeling_genres fg ON fg.movieidx = m.movie_idx
      WHERE fg.feelingtype = :feeling
      ORDER BY (COALESCE(m.vote_average, 0) * 0.6
              + COALESCE(m.popularity, 0) * 0.4)
              * dbms_random.value DESC
      FETCH FIRST :limit ROWS ONLY
                        """, nativeQuery = true)
  List<MovieInfoEntity> findDistinctMoviesByFeeling(
      @Param("feeling") String feeling,
      @Param("limit") int limit);

  @Query("select distinct fg.feelingType from FeelingGenreEntity fg order by fg.feelingType")
  List<String> findAllDistinctFeelings();

  List<FeelingGenreEntity> findByFeelingTypeIn(Collection<String> feelingTypes);
}