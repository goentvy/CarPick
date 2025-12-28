-- 기존 데이터 삭제 (혹시 모를 중복 방지)
DELETE FROM insurance;

-- 1. 미가입 (NONE)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW());

-- 2. 일반자차 (STANDARD)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW());

-- 3. 완전자차 (FULL)
-- is_default: 1 (True), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());