SHOW DATABASES;


USE carpick;


ALTER TABLE users
    ADD CONSTRAINT chk_local_user
        CHECK (
            (provider = 'local' AND email IS NOT NULL AND password_hash IS NOT NULL)
                OR (provider <> 'local')
            );


-- -----------------------------------------
-- 2. users 테이블 생성
-- -----------------------------------------
CREATE TABLE users (
                       user_id BIGINT AUTO_INCREMENT PRIMARY KEY,

                       email VARCHAR(255) UNIQUE,
                       password_hash VARCHAR(255),

                       provider VARCHAR(50) NOT NULL,
                       provider_id VARCHAR(255),

                       name VARCHAR(50),
                       phone VARCHAR(20),
                       birth DATE,
                       gender ENUM('M', 'F'),

                       marketing_agree TINYINT(1) NOT NULL,

                       membership_grade ENUM('BASIC', 'VIP')
        NOT NULL DEFAULT 'BASIC',

                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,
                       deleted_at DATETIME
);


SELECT * FROM users;

DROP TABLE users;

-- 개인정보 조회 쿼리--
SELECT
    user_id,
    email,
    name,
    phone,
    birth,
    gender,
    marketing_agree,
    membership_grade
FROM users
WHERE user_id = ?
  AND deleted_at IS NULL;


-- 회원탈퇴 쿼리----
UPDATE users
SET deleted_at = NOW()
WHERE user_id = ?

-- 회원정보 수정----
UPDATE users
SET
    name = ?,
    phone = ?,
    birth = ?,
    marketing_agree = ?,
    updated_at = NOW()
WHERE user_id = ?
  AND deleted_at IS NULL;


