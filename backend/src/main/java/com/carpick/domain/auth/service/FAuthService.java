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
    public FAuthResponse.FindId findId(FAuthRequest.FindId dto) {

        String email = userFindMapper.findEmailByNameAndEmail(
                dto.getName(),
                dto.getEmail()
        );

        if (email == null) {
            throw new IllegalArgumentException("일치하는 회원 정보가 없습니다.");
        }

        return new FAuthResponse.FindId(
                true,
                "아이디가 존재합니다.",
                null
        );
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
