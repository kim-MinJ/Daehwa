package org.iclass.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class FilterConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())       // CSRF 보호 비활성화
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()       // 모든 요청 허용
            )
            .cors();                            // CORS 설정 사용 (필요 시)

        return http.build();
    }
}
