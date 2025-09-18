package org.iclass.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.iclass.backend.dto.VideosDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.repository.VideosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class VideosService {

    private final VideosRepository videosRepository;

    /** 영화 엔티티 기준 전체 트레일러/영상 조회 */
    public List<VideosDto> getVideosByMovie(MovieInfoEntity movie) {
        return videosRepository.findByMovie(movie)
                .stream()
                .map(VideosDto::of)
                .collect(Collectors.toList());
    }

    /** 영화 ID 기준 전체 트레일러/영상 조회 */
    public List<VideosDto> getVideosByMovieId(Long movieId) {
        return videosRepository.findByMovie_MovieIdx(movieId)
                .stream()
                .map(VideosDto::of)
                .collect(Collectors.toList());
    }
}
