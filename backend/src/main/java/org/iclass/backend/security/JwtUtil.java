package org.iclass.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration}")
  private long expiration;

  // 서명용 키 객체 생성
  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  // JWT 토큰 생성
  public String generateToken(String userId) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .setSubject(userId)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  // 토큰에서 userId 추출
  public String getUserId(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  // 토큰 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(getSigningKey())
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}