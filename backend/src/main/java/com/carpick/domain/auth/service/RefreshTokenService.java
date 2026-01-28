package com.carpick.domain.auth.service;

import com.carpick.domain.auth.mapper.RefreshTokenMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenMapper refreshTokenMapper;

    /* =====================
       저장 (로그인 시)
       ===================== */
    @Transactional
    public void save(Long userId, String token) {
        refreshTokenMapper.save(userId, token);
    }

    /* =====================
       검증 (재발급 시)
       ===================== */
    @Transactional(readOnly = true)
    public boolean validate(Long userId, String token) {
        String stored = refreshTokenMapper.findByUserId(userId);
        return stored != null && stored.equals(token);
    }

    /* =====================
       로그아웃/탈취 대응
       ===================== */
    @Transactional
    public void delete(Long userId) {
        refreshTokenMapper.deleteByUserId(userId);
    }
}
