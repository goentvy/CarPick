package com.carpick.domain.auth.service;

import com.carpick.domain.auth.dto.find.FAuthRequest;
import com.carpick.domain.auth.dto.find.FAuthResponse;
import com.carpick.domain.auth.mapper.UserFindMapper;
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

    /* 아이디(이메일) 찾기-------------------------------- */
    @Transactional(readOnly = true)
    // 👉 이 메서드는 DB를 "조회만" 한다는 의미
    // 👉 INSERT / UPDATE 같은 변경 작업은 없고,
    // 👉 성능 최적화와 안전성을 위해 readOnly = true 사용
    public FAuthResponse.FindId findId(FAuthRequest.FindId dto)

    // 👉 프론트에서 전달한 요청 데이터(dto)를 받는다

    {

        String email = userFindMapper.findEmailByNameAndPhone(
                dto.getName(),
                dto.getPhone()
        );
        // 👉 DB(users 테이블)에서
        // 👉 이름 + 휴대폰 번호가 일치하는 회원의 이메일을 조회
        // 👉 일치하는 데이터가 없으면 email = null


        // 예외처리
        if (email == null) {
            throw new IllegalArgumentException("일치하는 회원 정보가 없습니다.");
        }
        String maskedEmail = maskEmail(email);
        return new FAuthResponse.FindId(
                true,
                "아이디 조회 성공",
                maskedEmail
        );
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return null;
        }

        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];

        if (local.length() <= 5) {
            return "*".repeat(local.length()) + "@" + domain;
        }

        String visible = local.substring(0, 5);
        String masked = "*".repeat(local.length() - 5);

        return visible + masked + "@" + domain;
    }


    /* 임시 비밀번호 발급----------------------------------- */
    @Transactional
    public String resetPassword(FAuthRequest.ResetPassword dto) {

        int exists = userFindMapper.existsForResetPassword(dto.getEmail());
        if (exists == 0) {
            throw new IllegalArgumentException("존재하지 않는 계정입니다.");
        }

        // 임시 비밀번호 생성
        String tempPassword = generateTempPassword();

        // 암호화
        String hashed = passwordEncoder.encode(tempPassword);

        // DB 업데이트
        int updated = userFindMapper.updatePassword(dto.getEmail(), hashed);
        if (updated == 0) {
            throw new RuntimeException("비밀번호 변경 실패");
        }

        log.info("Temporary password issued for {}", dto.getEmail());

        // 개발 단계: 그대로 반환 (실무에선 이메일 발송)
        return tempPassword;
    }

    /* 임시 비밀번호 생성 */
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }
}
