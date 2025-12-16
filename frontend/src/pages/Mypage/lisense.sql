CREATE DATABASE carpick;

CREATE TABLE driver_licenses (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,         -- 나중에 users.id에 맞춰 타입/제약만 수정
  driver_name     VARCHAR(50) NOT NULL,
  birthday        DATE NOT NULL,
  license_number  VARCHAR(20) NOT NULL,
  serial_number   VARCHAR(10) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
