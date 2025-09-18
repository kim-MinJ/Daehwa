package org.iclass.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class backendApplication {
    public static void main(String[] args) {
        SpringApplication.run(backendApplication.class, args);
    }
}
