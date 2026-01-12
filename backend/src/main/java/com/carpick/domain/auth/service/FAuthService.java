package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.find.FAuthRequest;
import com.carpick.domain.auth.dto.find.FAuthResponse;
import com.carpick.domain.auth.mapper.UserFindMapper;
import com.carpick.global.util.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class FAuthService {

    private final UserFindMapper userFindMapper;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    /* 아이디(이메일) 찾기 ======================================= */
    @Transactional(readOnly = true)
    public FAuthResponse.FindId findId(FAuthRequest.FindId dto) {
        String email = userFindMapper.findEmailByNameAndPhone(
                dto.getName(),
                dto.getPhone()
        );

        if (email == null) {
            throw new IllegalArgumentException("일치하는 회원 정보가 없습니다.");
        }

        return new FAuthResponse.FindId(true, "아이디 조회 성공", maskEmail(email));
    }

    // 이메일 마스킹 헬퍼 메서드
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return null;
        String[] parts = email.split("@");
        String local = parts[0];

        if (local.length() <= 5) {
            return "*".repeat(local.length()) + "@" + parts[1];
        }
        return local.substring(0, 5) + "*".repeat(local.length() - 5) + "@" + parts[1];
    }


    /* 임시 비밀번호 발급 및 이메일 전송 (핵심 수정됨!) ================= */
    @Transactional
    public void sendTemporaryPassword(FAuthRequest.ResetPassword dto) {

        // 1. 회원 존재 여부 확인
        int exists = userFindMapper.existsForResetPassword(dto.getEmail());
        if (exists == 0) {
            throw new IllegalArgumentException("가입된 정보가 없습니다.");
        }

        // 2. 임시 비밀번호 생성 (SecureRandom 방식이 UUID보다 비밀번호로 쓰기에 더 좋습니다)
        String tempPassword = generateTempPassword();

        // 3. 비밀번호 암호화 및 DB 업데이트
        String hashed = passwordEncoder.encode(tempPassword);
        userFindMapper.updatePassword(dto.getEmail(), hashed);

        // 4. 이메일 발송
        String subject = "[CarPick] 임시 비밀번호 발급 안내";
        String text = "안녕하세요, CarPick입니다.\n\n" +
                "요청하신 임시 비밀번호는 [" + tempPassword + "] 입니다.\n" +
                "로그인 후 반드시 비밀번호를 변경해 주세요.";

        mailService.sendEmail(dto.getEmail(), subject, text);

        log.info("임시 비밀번호 이메일 발송 완료: {}", dto.getEmail());
    }

    // 랜덤 비밀번호 생성기 (기존에 작성하신 코드가 좋아서 살렸습니다!)
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 10; i++) { // 8자리 너무 짧으면 10자리로 늘려도 됨
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}