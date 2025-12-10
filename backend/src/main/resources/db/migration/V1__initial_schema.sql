-- Flyway는 src/main/resources/db/migration 경로의 SQL 파일을 자동으로 실행합니다.
-- 모든 파일은 V{버전}__{설명}.sql 형식으로 작성해야 합니다. (예: V1__init_schema.sql)

-- V1은 보통 초기 스키마 생성(DDL: CREATE TABLE 등)을 포함합니다.
-- 이후 스키마 변경(컬럼 추가/수정/삭제, 인덱스 추가/삭제, 제약조건 변경 등)은
-- 각각 새로운 버전 파일(V2, V3 ...)로 분리하여 작성해야 합니다.
-- (하나의 파일은 반드시 '하나의 변경 단위'만 포함해야 합니다.)

-- Flyway는 파일명을 기준으로 오름차순으로 실행합니다.
-- 예: V1__init.sql → V2__add_users_table.sql → V3__add_index.sql

-- DML(INSERT/UPDATE/DELETE)도 Flyway로 적용할 수 있으며,
-- 초기 데이터 삽입은 보통 별도의 버전 파일(V2__init_data.sql)로 작성합니다.
-------------------------------------------------------------
-- CREATE DATABASE carpick;
-- USE carpick;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	NAME VARCHAR(20)
);

SELECT * FROM users;