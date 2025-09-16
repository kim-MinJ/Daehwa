package org.iclass.backend.batch;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.iclass.backend.entity.MovieInfoEntity;
import org.iclass.backend.entity.SoundTrackEntity;
import org.iclass.backend.repository.MovieInfoRepository;
import org.iclass.backend.repository.SoundTrackRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableBatchProcessing
public class SoundTrackBatchConfig {

    private final MovieInfoRepository movieInfoRepository;
    private final SoundTrackRepository soundTrackRepository;
    private final String YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";

    public SoundTrackBatchConfig(MovieInfoRepository movieInfoRepository,
                                 SoundTrackRepository soundTrackRepository) {
        this.movieInfoRepository = movieInfoRepository;
        this.soundTrackRepository = soundTrackRepository;
    }

    @Bean
    public Job saveSoundTrackJob(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new JobBuilder("saveSoundTrackJob", jobRepository)
                .start(saveSoundTrackStep(jobRepository, transactionManager))
                .build();
    }

    @Bean
    public Step saveSoundTrackStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("saveSoundTrackStep", jobRepository)
                .<MovieInfoEntity, List<SoundTrackEntity>>chunk(10, transactionManager)
                .reader(movieReader())
                .processor(movieProcessor())
                .writer(movieWriter())
                .build();
    }

    @Bean
    public ItemReader<MovieInfoEntity> movieReader() {
        RepositoryItemReader<MovieInfoEntity> reader = new RepositoryItemReader<>();
        reader.setRepository(movieInfoRepository);
        reader.setMethodName("findAll");
        reader.setPageSize(10);
        reader.setSort(Map.of("movieIdx", Sort.Direction.ASC));
        return reader;
    }

    @Bean
    public ItemProcessor<MovieInfoEntity, List<SoundTrackEntity>> movieProcessor() {
        return movie -> {
            Long movieIdx = movie.getMovieIdx();
            if (!soundTrackRepository.findByMovieInfo_MovieIdx(movieIdx).isEmpty()) {
                return null;
            }

            // YouTube 검색 + 재시도 적용
            List<YouTubeResult> results = searchYouTubeMultipleWithRetry(movie.getTitle() + " OST", 3);

            List<SoundTrackEntity> soundTracks = new ArrayList<>();
            for (YouTubeResult r : results) {
                SoundTrackEntity ost = SoundTrackEntity.builder()
                        .movieInfo(movie)
                        .youtubeIdx(r.videoId())
                        .title(r.title())
                        .build();
                soundTracks.add(ost);
            }
            return soundTracks.isEmpty() ? null : soundTracks;
        };
    }

    @Bean
    public ItemWriter<List<SoundTrackEntity>> movieWriter() {
        return items -> {
            for (List<SoundTrackEntity> list : items) {
                if (list != null && !list.isEmpty()) {
                    soundTrackRepository.saveAll(list);
                }
            }
        };
    }

    /**
     * YouTube 검색 + 재시도 + Rate 제한 적용
     */
    private List<YouTubeResult> searchYouTubeMultipleWithRetry(String query, int maxResults) {
        int attempts = 0;
        int maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                Thread.sleep(500L); // 요청 간 간격
                String url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults="
                        + maxResults + "&q=" + URLEncoder.encode(query, StandardCharsets.UTF_8)
                        + "&key=" + YOUTUBE_API_KEY;

                RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response != null && response.containsKey("items")) {
                    List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
                    List<YouTubeResult> results = new ArrayList<>();
                    for (Map<String, Object> item : items) {
                        Map<String, Object> id = (Map<String, Object>) item.get("id");
                        Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                        results.add(new YouTubeResult(
                                (String) id.get("videoId"),
                                (String) snippet.get("title")
                        ));
                    }
                    return results;
                }
                return List.of();
            } catch (Exception e) {
                attempts++;
                System.out.println("YouTube 검색 오류: " + query + " / 시도 " + attempts + " / " + e.getMessage());
                try {
                    Thread.sleep(1000L * attempts); // 점진적 backoff
                } catch (InterruptedException ignored) {}
            }
        }
        return List.of(); // 재시도 후 실패 시 빈 리스트 반환
    }

    private record YouTubeResult(String videoId, String title) {}
}
