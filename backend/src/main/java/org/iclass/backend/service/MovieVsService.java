package org.iclass.backend.service;

import java.util.List;

import org.iclass.backend.dto.MovieVsDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVSRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieVsService {

    private final MovieVSRepository movieVSRepository;
    private final MovieInfoRepository movieInfoRepository;

    // VS 생성
    public MovieVsDto createVs(Long movie1Id, Long movie2Id) {
        movieVSRepository.findByActive(1).ifPresent(oldVs -> {
            oldVs.setActive(0);
            movieVSRepository.save(oldVs);
        });

        MovieInfoEntity movie1 = movieInfoRepository.findById(movie1Id)
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + movie1Id));
        MovieInfoEntity movie2 = movieInfoRepository.findById(movie2Id)
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + movie2Id));

        MovieVsEntity entity = new MovieVsEntity();
        entity.setMovieVs1(movie1);
        entity.setMovieVs2(movie2);
        entity.setActive(1);

        MovieVsEntity saved = movieVSRepository.save(entity);
        return toDto(saved);
    }

    // 전체 VS 조회
    public List<MovieVsEntity> getAllVs() {
        return movieVSRepository.findAll(); // DTO 변환 없이 엔티티 그대로 반환
    }

    // 단일 VS 조회
    public MovieVsDto getVs(Long id) {
        return movieVSRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("VS 없음: " + id));
    }

    // VS 삭제
    public void deleteVs(Long id) {
        movieVSRepository.deleteById(id);
    }

    // 활성화된 VS 조회
    public MovieVsEntity getActiveRanking() {
        return movieVSRepository.findByActive(1).orElse(null);
    }

    // DTO 변환 (필요 시만 사용)
    private MovieVsDto toDto(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Idx(entity.getMovieVs1().getMovieIdx())
                .movieVs2Idx(entity.getMovieVs2().getMovieIdx())
                .active(entity.getActive())
                .build();
    }

    // 랭킹 페이지에서 VS 영화 변경
    public void setRankingVotes(Long movie1Id, Long movie2Id) {
        MovieInfoEntity movie1 = movieInfoRepository.findById(movie1Id)
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + movie1Id));
        MovieInfoEntity movie2 = movieInfoRepository.findById(movie2Id)
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + movie2Id));

        MovieVsEntity vs = movieVSRepository.findByActive(1).orElse(new MovieVsEntity());
        vs.setMovieVs1(movie1);
        vs.setMovieVs2(movie2);
        vs.setActive(1);

        movieVSRepository.save(vs);
    }
}
