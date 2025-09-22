package org.iclass.backend.controller;

import java.util.List;

import org.iclass.backend.dto.VideosDto;
import org.iclass.backend.service.VideosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movie")
public class VideosController {

    private final VideosService videosService;

    public VideosController(VideosService videosService) {
        this.videosService = videosService;
    }

    /**
     * 영화 ID 기준 전체 트레일러/영상 조회
     * GET /api/movies/{id}/videos
     */
    @GetMapping("/{id}/videos")
    public ResponseEntity<List<VideosDto>> getVideos(@PathVariable Long id) {
        List<VideosDto> videos = videosService.getVideosByMovieId(id);
        return ResponseEntity.ok(videos);
    }
}
