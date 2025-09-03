package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.Entity.MovieInfoEntity;
import org.iclass.backend.Entity.MovieVsEntity;
import org.iclass.backend.dto.MovieVsDto;
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
        MovieInfoEntity movie1 = movieInfoRepository.findById(movie1Id)
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + movie1Id));
        MovieInfoEntity movie2 = movieInfoRepository.findById(movie2Id)
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + movie2Id));

        MovieVsEntity entity = new MovieVsEntity();
        entity.setMovieVs1(movie1);
        entity.setMovieVs2(movie2);
        entity.setActice(1);

        MovieVsEntity saved = movieVSRepository.save(entity);

        return toDto(saved);
    }

    // VS 전체 조회
    public List<MovieVsDto> getAllVs() {
        return movieVSRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
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

    private MovieVsDto toDto(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Id(entity.getMovieVs1().getMovieIdx())
                .movieVs2Id(entity.getMovieVs2().getMovieIdx())
                .active(entity.getActice())
                .build();
    }
}