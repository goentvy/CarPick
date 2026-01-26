package com.carpick.global.security.jwt;

import static com.carpick.global.exception.enums.ErrorCode.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.carpick.global.exception.AuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

@Component
public class JwtProvider {

    private final Key key;
    private final long expiration;

    public JwtProvider(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration}") long expiration
    ) {
        this.key = Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
        this.expiration = expiration;
    }

    /**
     * ✅ Access Token 생성
     * subject = userId
     */
    public String generateToken(Long userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expiration)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * ✅ 토큰 검증 (예외 기반)
     */
    public void validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

        } catch (ExpiredJwtException e) {
            throw new AuthenticationException(AUTH_TOKEN_EXPIRED);

        } catch (SignatureException e) {
            throw new AuthenticationException(AUTH_TOKEN_SIGNATURE_INVALID);

        } catch (MalformedJwtException e) {
            throw new AuthenticationException(AUTH_TOKEN_MALFORMED);

        } catch (UnsupportedJwtException e) {
            throw new AuthenticationException(AUTH_TOKEN_UNSUPPORTED);

        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthenticationException(AUTH_TOKEN_INVALID);
        }
    }

    /**
     * ✅ 토큰에서 userId 추출
     * ⚠️ validateToken 이후 호출 전제
     */
    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    /**
     * ✅ 토큰에서 role 추출
     */
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * ✅ Authorization 헤더에서 Bearer 토큰 추출
     * (필터에서 사용)
     */
    public String resolveToken(HttpServletRequest request) {
        // 1️⃣ Authorization 헤더 우선
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }

        // 2️⃣ 쿠키 fallback (서버 페이지 접근용)
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    /**
     * 내부 공통 Claims 파싱
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

//	기존 유진님 JwtProvider 삭제 보류

//package com.carpick.global.security.jwt;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.nio.charset.StandardCharsets;
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtProvider {
//
//  private final Key key;
//  private static final long EXPIRATION = 1000L * 60 * 60; // 1시간
//
//  public JwtProvider(@Value("${jwt.secret}") String secretKey) {
//      this.key = Keys.hmacShaKeyFor(
//              secretKey.getBytes(StandardCharsets.UTF_8)
//      );
//  }
//
//  /**
//   * ✅ AuthService와 100% 호환
//   * subject = userId
//   */
//  public String generateToken(Long userId, String role) {
//      return Jwts.builder()
//              .setSubject(String.valueOf(userId))
//              .claim("role", role)
//              .setIssuedAt(new Date())
//              .setExpiration(
//                      new Date(System.currentTimeMillis() + EXPIRATION)
//              )
//              .signWith(key, SignatureAlgorithm.HS256)
//              .compact();
//  }
//
//  /**
//   * ✅ 토큰에서 userId 추출
//   */
//  public Long getUserId(String token) {
//      return Long.parseLong(parseClaims(token).getSubject());
//  }
//
//  /**
//   * ✅ 토큰 검증
//   */
//  public boolean validateToken(String token) {
//      try {
//          Jwts.parserBuilder()
//                  .setSigningKey(key)
//                  .build()
//                  .parseClaimsJws(token);
//          return true;
//      } catch (ExpiredJwtException e) {
//          return false;
//      } catch (JwtException | IllegalArgumentException e) {
//          return false;
//      }
//  }
//
//  /**
//   * ✅ Authorization 헤더에서 Bearer 토큰 추출
//   */
//  public String resolveToken(HttpServletRequest request) {
//      String bearer = request.getHeader("Authorization");
//      if (bearer != null && bearer.startsWith("Bearer ")) {
//          return bearer.substring(7);
//      }
//      return null;
//  }
//
//  private Claims parseClaims(String token) {
//      return Jwts.parserBuilder()
//              .setSigningKey(key)
//              .build()
//              .parseClaimsJws(token)
//              .getBody();
//  }
//}
