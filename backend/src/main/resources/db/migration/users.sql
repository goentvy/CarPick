SHOW
DATABASES;

USE
testdb;

DROP TABLE users;

SELECT *
FROM users;


CREATE TABLE users
(
    user_id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    email            VARCHAR(255) UNIQUE,
    password_hash    VARCHAR(255),

    provider         VARCHAR(50),                          -- local / kakao / naver
    provider_id      VARCHAR(255),                         -- 소셜 로그인 고유 ID

    name             VARCHAR(50),
    phone            VARCHAR(20),
    birth            DATE,

    gender           ENUM('M', 'F') NOT NULL,              -- 성별
    marketing_agree  TINYINT(1) NOT NULL,                  -- 마케팅 수신동의

    membership_grade ENUM('BASIC', 'VIP') 
        NOT NULL DEFAULT 'BASIC', -- 회원등급 (BASIC/VIP)

    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME NULL
);

DROP TABLE users;
