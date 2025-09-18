package org.iclass.backend.init;

import org.iclass.backend.entity.FeelingGenreEntity;
import org.iclass.backend.entity.GenresEntity;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.FeelingGenreRepository;
import org.iclass.backend.repository.GenresRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.Map.entry;

@Component
public class FeelingGenreInitializer implements CommandLineRunner {

  @Autowired
  private FeelingGenreRepository feelingGenreRepository;

  @Autowired
  private MovieInfoRepository movieInfoRepository;

  @Autowired
  private GenresRepository genresRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {

    // 장르-감정 매핑
    Map<String, String[]> genreToFeelingMap = Map.ofEntries(
        entry("액션", new String[] { "화난다", "긴장된다", "놀랐다", "짜릿하다", "흥분된다" }),
        entry("어드벤처", new String[] { "심심하다", "설렌다", "긴장된다", "흥분된다", "즐겁다" }),
        entry("애니메이션", new String[] { "기쁘다", "편안하다", "즐겁다", "설렌다", "심심하다" }),
        entry("코미디", new String[] { "기쁘다", "편안하다", "심심하다", "즐겁다", "설렌다" }),
        entry("범죄", new String[] { "화난다", "긴장된다", "심심하다", "놀랐다", "짜릿하다" }),
        entry("다큐멘터리", new String[] { "슬프다", "피곤하다", "감동이다", "편안하다", "생각난다" }),
        entry("드라마", new String[] { "슬프다", "기쁘다", "편안하다", "감동이다", "설렌다" }),
        entry("가족", new String[] { "기쁘다", "편안하다", "감동이다", "즐겁다", "설렌다" }),
        entry("판타지", new String[] { "슬프다", "편안하다", "흥분된다", "설렌다", "놀랐다" }),
        entry("역사", new String[] { "피곤하다", "감동이다", "슬프다", "생각난다", "설렌다" }),
        entry("공포", new String[] { "긴장된다", "놀랐다", "짜릿하다", "화난다", "심심하다" }),
        entry("음악", new String[] { "기쁘다", "설렌다", "편안하다", "즐겁다", "감동이다" }),
        entry("미스터리", new String[] { "긴장된다", "놀랐다", "심심하다", "짜릿하다", "화난다" }),
        entry("로맨스", new String[] { "기쁘다", "설렌다", "슬프다", "편안하다", "감동이다" }),
        entry("SF", new String[] { "심심하다", "흥분된다", "놀랐다", "설렌다", "짜릿하다" }),
        entry("TV 영화", new String[] { "편안하다", "심심하다", "즐겁다", "설렌다", "감동이다" }),
        entry("스릴러", new String[] { "긴장된다", "놀랐다", "화난다", "짜릿하다", "심심하다" }),
        entry("전쟁", new String[] { "화난다", "긴장된다", "짜릿하다", "슬프다", "감동이다" }),
        entry("서부극", new String[] { "흥분된다", "짜릿하다", "화난다", "놀랐다", "심심하다" }));

    // 영화 + 장르를 fetch join으로 가져오기
    List<MovieInfoEntity> allMovies = movieInfoRepository.findAllWithGenres();

    for (MovieInfoEntity movie : allMovies) {
      List<String> genreNames = movie.getGenres(); // 장르 이름 리스트

      for (String genreName : genreNames) {
        String[] feelings = genreToFeelingMap.get(genreName);

        if (feelings != null) {
          Optional<GenresEntity> optionalGenre = genresRepository.findByName(genreName);
          if (optionalGenre.isEmpty())
            continue;

          GenresEntity genre = optionalGenre.get();

          for (String feeling : feelings) {
            FeelingGenreEntity entity = FeelingGenreEntity.builder()
                .movie(movie)
                .genre(genre)
                .feelingType(feeling)
                .build();
            feelingGenreRepository.save(entity);
          }
        }
      }
    }

    System.out.println("FeelingGenre 초기화 완료!");
  }
}
