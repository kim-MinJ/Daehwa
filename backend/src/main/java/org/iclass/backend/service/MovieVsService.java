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

    // 새로운 VS 생성
    public MovieVsDto createVs(Long movie1Id, Long movie2Id) {
        // 기존 활성 VS 비활성화
        movieVSRepository.findByActive(1).ifPresent(oldVs -> {
            oldVs.setActive(0);
            movieVSRepository.save(oldVs);
        });

        MovieInfoEntity movie1 = movieInfoRepository.findById(movie1Id)
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + movie1Id));
        MovieInfoEntity movie2 = movieInfoRepository.findById(movie2Id)
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + movie2Id));

        MovieVsEntity entity = MovieVsEntity.builder()
                .movieVs1(movie1)
                .movieVs2(movie2)
                .active(1)
                .build();

        MovieVsEntity saved = movieVSRepository.save(entity);
        return toDto(saved);
    }

    // 모든 VS 조회
    public List<MovieVsEntity> getAllVs() {
        return movieVSRepository.findAll();
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

    // 활성 VS 조회
    public MovieVsEntity getActiveRanking() {
        return movieVSRepository.findByActive(1).orElse(null);
    }

    // DTO 변환
    private MovieVsDto toDto(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Idx(entity.getMovieVs1().getMovieIdx())
                .movieVs2Idx(entity.getMovieVs2().getMovieIdx())
                .active(entity.getActive())
                .build();
    }

    // VS 저장 (프론트에서 movieIds 배열로 호출)
    @Transactional
    public MovieVsDto saveVs(MovieVsDto dto) {
        MovieInfoEntity movie1 = movieInfoRepository.findById(dto.getMovieVs1Idx())
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + dto.getMovieVs1Idx()));
        MovieInfoEntity movie2 = movieInfoRepository.findById(dto.getMovieVs2Idx())
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + dto.getMovieVs2Idx()));

        // 기존 활성 VS 비활성화
        movieVSRepository.findByActive(1).ifPresent(oldVs -> {
            oldVs.setActive(0);
            movieVSRepository.save(oldVs);
        });

        MovieVsEntity newVs = dto.toEntity(movie1, movie2);
        MovieVsEntity saved = movieVSRepository.save(newVs);
        return toDto(saved);
    }

}
