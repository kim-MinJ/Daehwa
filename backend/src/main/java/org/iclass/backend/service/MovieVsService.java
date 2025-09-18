package org.iclass.backend.service;

import java.util.Date;
import java.util.List;

import org.iclass.backend.dto.MovieVsDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.MovieVsEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.MovieVSRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieVsService {

    private final MovieVSRepository movieVSRepository;
    private final MovieInfoRepository movieInfoRepository;

    // 새로운 VS 생성 (pair 자동 증가, round는 프론트에서 전달)
    public MovieVsDto createVs(Long movie1Id, Long movie2Id, Integer round) {
        if (round == null)
            round = 1;

        MovieInfoEntity movie1 = movieInfoRepository.findById(movie1Id)
                .orElseThrow(() -> new IllegalArgumentException("영화1 없음: " + movie1Id));
        MovieInfoEntity movie2 = movieInfoRepository.findById(movie2Id)
                .orElseThrow(() -> new IllegalArgumentException("영화2 없음: " + movie2Id));

        // 현재 round에서 pair 자동 증가
        Integer maxPair = movieVSRepository.findMaxPairByRound(round);
        int pair = (maxPair == null ? 1 : maxPair + 1);

        // ✅ 기존 활성화 VS는 건드리지 않음
        MovieVsEntity entity = MovieVsEntity.builder()
                .movieVs1(movie1)
                .movieVs2(movie2)
                .vsRound(round)
                .pair(pair)
                .active(0) // 기본 비활성
                .startDate(new Date()) // NOT NULL 제약 때문에 생성 시점으로 저장
                .endDate(null) // 아직 종료 안 됨
                .build();

        MovieVsEntity saved = movieVSRepository.saveAndFlush(entity);
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
    public MovieVsEntity getActiveVs() {
        return movieVSRepository.findByActive(1).orElse(null);
    }

    // -------------------- 수정된 updateActive --------------------
    @Transactional
    public void updateActive(Long id, Integer active) {
        MovieVsEntity vs = movieVSRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VS not found with id: " + id));

        if (active == 1 && (vs.getStartDate() == null || vs.getActive() != 1)) {
            // 처음 활성화할 때만 startDate 갱신
            vs.setStartDate(new Date());
            vs.setEndDate(null);
        } else if (active == 0) {
            vs.setEndDate(new Date());
        }

        vs.setActive(active);
        movieVSRepository.save(vs);
    }

    @Transactional
    public void softDeleteVs(Long id) {
        MovieVsEntity vs = movieVSRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VS not found with id: " + id));
        vs.setActive(3);
        movieVSRepository.save(vs);
    }

    // -------------------- 스케줄러: DB startDate 기준으로 만료 --------------------
    @Scheduled(fixedRate = 72 * 60 * 60 * 1000) // 30초마다 체크
    @Transactional
    public void expireOldVs() {
        Date now = new Date();

        List<MovieVsEntity> activeVsList = movieVSRepository.findAllByActive(1);
        for (MovieVsEntity vs : activeVsList) {
            if (vs.getStartDate() == null || vs.getEndDate() != null)
                continue;

            long expireTime = vs.getStartDate().getTime() + 72 * 60 * 60 * 1000;
            if (now.getTime() > expireTime) {
                // ✅ endDate 먼저 저장
                vs.setEndDate(now);
                movieVSRepository.saveAndFlush(vs);

                // ✅ active 나중에 저장
                vs.setActive(0);
                movieVSRepository.saveAndFlush(vs);

                System.out.println("⏰ 만료 처리됨 VS: " + vs.getVsIdx());
            }
        }
    }

    // DTO 변환
    private MovieVsDto toDto(MovieVsEntity entity) {
        return MovieVsDto.builder()
                .vsIdx(entity.getVsIdx())
                .movieVs1Idx(entity.getMovieVs1().getMovieIdx())
                .movieVs2Idx(entity.getMovieVs2().getMovieIdx())
                .vsRound(entity.getVsRound())
                .pair(entity.getPair())
                .active(entity.getActive())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .build();
    }
}
