  // package org.iclass.backend.security;

  // import lombok.RequiredArgsConstructor;
  // import org.springframework.context.annotation.Bean;
  // import org.springframework.context.annotation.Configuration;
  // import org.springframework.security.authentication.AuthenticationManager;
  // import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
  // import org.springframework.security.config.annotation.web.builders.HttpSecurity;
  // import org.springframework.security.config.http.SessionCreationPolicy;
  // import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
  // import org.springframework.security.crypto.password.PasswordEncoder;
  // import org.springframework.security.web.SecurityFilterChain;
  // import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
  // import org.springframework.web.cors.CorsConfiguration;
  // import org.springframework.web.cors.CorsConfigurationSource;
  // import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

  // import java.util.List;

  // @Configuration
  // @RequiredArgsConstructor
  // public class SecurityConfig {

  //   private final JwtAuthFilter jwtAuthFilter;

  //   @Bean
  //   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  //     http.csrf(csrf -> csrf.disable())
  //         .cors(cors -> cors.configurationSource(corsConfigurationSource()))
  //         .authorizeHttpRequests(auth -> auth
  //             .requestMatchers("/api/auth/**").permitAll()
  //             .requestMatchers("/api/movies/**", "/error").permitAll()
  //             .anyRequest().authenticated())
  //         .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  //         .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

  //     return http.build();
  //   }

  //   @Bean
  //   public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
  //     return config.getAuthenticationManager();
  //   }

  //   @Bean
  //   public PasswordEncoder passwordEncoder() {
  //     return new BCryptPasswordEncoder();
  //   }

  //   @Bean
  //   public CorsConfigurationSource corsConfigurationSource() {
  //     CorsConfiguration config = new CorsConfiguration();
  //     // 모든 도메인 허용
  //     config.setAllowedOriginPatterns(List.of("http://localhost:5173"));
  //     config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
  //     config.setAllowedHeaders(List.of("*"));
  //     config.setAllowCredentials(true); // 쿠키/인증 허용
  //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  //     source.registerCorsConfiguration("/**", config);
  //     return source;
  //   }
  // }

  package org.iclass.backend.security;

  import java.util.List;

  import org.springframework.context.annotation.Bean;
  import org.springframework.context.annotation.Configuration;
  import org.springframework.http.HttpMethod;
  import org.springframework.security.authentication.AuthenticationManager;
  import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
  import org.springframework.security.config.annotation.web.builders.HttpSecurity;
  import org.springframework.security.config.http.SessionCreationPolicy;
  import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
  import org.springframework.security.crypto.password.PasswordEncoder;
  import org.springframework.security.web.SecurityFilterChain;
  import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
  import org.springframework.web.cors.CorsConfiguration;
  import org.springframework.web.cors.CorsConfigurationSource;
  import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

  import lombok.RequiredArgsConstructor;

  @Configuration
  @RequiredArgsConstructor
  public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.csrf(csrf -> csrf.disable())
          .cors(cors -> cors.configurationSource(corsConfigurationSource()))
          .authorizeHttpRequests(auth -> auth
              .requestMatchers("/api/auth/**").permitAll()
              .requestMatchers("/api/movies/**", "/error").permitAll()
              .requestMatchers(HttpMethod.POST, "/api/review/**").authenticated()
              .anyRequest().authenticated())
          .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

      return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
      return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(List.of("http://localhost:5173"));
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      config.setAllowedHeaders(List.of("*"));
      config.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);
      return source;
    }
  }
