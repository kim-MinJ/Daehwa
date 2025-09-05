package org.iclass.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                     // 모든 경로 허용
                .allowedOrigins("*")                   // 모든 출처 허용
                .allowedMethods("*")                   // 모든 HTTP 메서드 허용 (GET, POST 등)
                .allowedHeaders("*")                   // 모든 헤더 허용
                .allowCredentials(false);              // 자격 증명은 미허용 (true로 하면 allowedOrigins에 "*" 사용 불가)
    }
}
