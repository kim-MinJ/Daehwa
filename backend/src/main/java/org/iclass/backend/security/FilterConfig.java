// package org.iclass.backend.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class FilterConfig {

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http
// .csrf(csrf -> csrf.disable())
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/api/movies").permitAll()
// .anyRequest().authenticated())
// .cors();
// return http.build();
// }

// }