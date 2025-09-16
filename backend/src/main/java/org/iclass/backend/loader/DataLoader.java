package org.iclass.backend.loader;

import org.iclass.backend.service.save.GenresSave;
import org.iclass.backend.service.save.MovieCreditSave;
import org.iclass.backend.service.save.MovieInfoSave;
import org.iclass.backend.service.save.MovieVideoSave;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class DataLoader implements CommandLineRunner {

    private final MovieInfoSave movieInfoSave;
    private final GenresSave genresSave;
    private final MovieCreditSave movieCreditSave;
    private final MovieVideoSave movieVideoSave;
    private final JobLauncher jobLauncher;
    private final Job saveSoundTrackJob;

    @Override
    public void run(String... args) throws Exception {
        // genresSave.fetchAndSaveGenres(); // Genres 저장
        // movieInfoSave.fetchAndSaveAllPages(); // MovieInfo, MovieGenres 저장
        // movieCreditSave.fetchAndSaveAllCredits(); // MovieCast, MovieCrew 저장
        // movieVideoSave.fetchAndSaveAllVideos(); // Video 저장
        
        // SoundTrack 저장
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        // Spring Batch Job 실행
        jobLauncher.run(saveSoundTrackJob, jobParameters);
        
        System.out.println("DataLoader.run() 종료됨");

        // DB 에 데이터 저장하고 싶으면 주석 풀기
    }
}