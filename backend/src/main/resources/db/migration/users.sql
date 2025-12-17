SHOW DATABASES;

USE testdb;

DROP TABLE users;

SELECT * FROM users;


CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),

    provider VARCHAR(50),         -- local / kakao / naver
    provider_id VARCHAR(255),     -- 소셜 로그인 고유 ID

    name VARCHAR(50),
    phone VARCHAR(20),
    birth DATE,

    gender ENUM('M', 'F') NOT NULL,          -- 성별
    marketing_agree TINYINT(1) NOT NULL,     -- 마케팅 수신동의

    membership_grade ENUM('BASIC', 'VIP') 
        NOT NULL DEFAULT 'BASIC',            -- 회원등급 (BASIC/VIP)

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
);

DROP TABLE users;

-- < 인서트 >-------------------------------------------------------------

INSERT INTO users (
    email, password_hash,
    provider, provider_id,
    name, phone, birth,
    gender, marketing_agree,
    membership_grade
) VALUES
-- 1. 일반회원 BASIC
(
    'testuser01@gmail.com',
    'hashed_pw_01',
    'local',
    NULL,
    '홍길동',
    '010-1234-5678',
    '1995-03-12',
    'M',
    1,
    'BASIC'
),

-- 2. 카카오 로그인 VIP
(
    NULL,
    NULL,
    'kakao',
    'kakao_98523412',
    '김철수',
    '010-2222-3333',
    '1990-07-25',
    'M',
    0,
    'VIP'
),

-- 3. 네이버 로그인 BASIC
(
    NULL,
    NULL,
    'naver',
    'naver_AJF92348F',
    '이영희',
    '010-9999-8888',
    '1988-11-02',
    'F',
    1,
    'BASIC'
);
