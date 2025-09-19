package org.iclass.backend.controller;
import lombok.RequiredArgsConstructor;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.repository.MovieVoteRepository;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.dto.MovieVoteDto;
import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.service.MovieVoteService;
import org.iclass.backend.service.RankingService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RankingController {
    private final UsersRepository usersRepository;
    private final MovieVoteService movieVoteService;
    private final RankingService rankingService;
    /** ✅ 트렌딩 영화 가져오기 */
    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingMovies() {
        return ResponseEntity.ok(rankingService.getTrendingMovies());
    }
    /** ✅ 버튼 클릭 시 vote_count +1 */
    @PostMapping("/vote")
    public ResponseEntity<?> vote(
            @RequestParam Long movieId,
            @RequestParam Long vsIdx, // ⭐ 추가
            @RequestParam String userId) {
        try {
            MovieVoteDto saved = movieVoteService.voteMovie(movieId, userId, vsIdx); // vsId 추가
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }

    }


    private String mapGenreIdToName(int genreId) {
        switch (genreId) {
            case 28:
                return "Action";
            case 12:
                return "Adventure";
            case 16:
                return "Animation";
            case 35:
                return "Comedy";
            case 80:
                return "Crime";
            case 99:
                return "Documentary";
            case 18:
                return "Drama";
            case 10751:
                return "Family";
            case 14:
                return "Fantasy";
            case 36:
                return "History";
            case 27:
                return "Horror";
            case 10402:
                return "Music";
            case 9648:
                return "Mystery";
            case 10749:
                return "Romance";
            case 878:
                return "Science Fiction";
            case 10770:
                return "TV Movie";
            case 53:
                return "Thriller";
            case 10752:
                return "War";
            case 37:
                return "Western";
            default:
                return "Unknown";
        }
    }
}
