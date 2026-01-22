SHOW DATABASES;

USE carpick;

drop table users;
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- 로그인 식별
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
	 -- 소셜 계정
    provider ENUM('LOCAL','KAKAO','NAVER') NOT NULL,
    provider_id VARCHAR(255) NULL,
	 UNIQUE (provider, provider_id),
    -- 개인정보 (선택)
    name VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    birth DATE NULL,
    gender ENUM('M','F') NULL,

    -- 정책
    marketing_agree TINYINT(1) NOT NULL DEFAULT 0,
    membership_grade ENUM('BASIC','VIP') NOT NULL DEFAULT 'BASIC',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    -- 토큰
    accesstoken VARCHAR(500)
);

-- 테이블 구조 변경
ALTER TABLE users MODIFY gender VARCHAR(10) NULL;

ALTER TABLE users
    CHANGE PASSWORD password VARCHAR(255),
    CHANGE NAME name VARCHAR(50);