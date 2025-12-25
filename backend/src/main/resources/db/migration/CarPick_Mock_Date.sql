/* =========================================================
   SEED DATA ONLY (INSERT)
   - Branch: 김포공항지점 (lat=90, lon=180)
   - CarSpec: 25 models (from screenshot)
   - Inventory: 2 vehicles per model (status mixed)
   - PricePolicy: MONTHLY base_price (from screenshot)
   - Insurance/Coupon/ServicePoint: minimal MVP data
   ========================================================= */





USE carpick;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 0) (선택) 기존 데이터 초기화
-- =========================
DELETE FROM VEHICLE_STATUS_HISTORY;
DELETE FROM RESERVATION_STATUS_HISTORY;
DELETE FROM RESERVATION;

DELETE FROM VEHICLE_INVENTORY;

DELETE FROM PRICE;
DELETE FROM PRICE_POLICY;
DELETE FROM CAR_OPTION;
DELETE FROM INSURANCE;
DELETE FROM COUPON;
DELETE FROM BRANCH_SERVICE_POINT;

DELETE FROM BRANCH;
DELETE FROM CAR_SPEC;

-- =========================
-- 1) BRANCH: 김포공항지점
-- =========================
INSERT INTO BRANCH (
    branch_code, branch_name,
    address_basic, address_detail, phone,
    open_time, close_time, business_hours,
    latitude, longitude, region_dept1,
    is_active,
    can_manage_inventory_yn, can_manage_vehicle_status_yn, can_pickup_return_yn,
    can_delivery_yn, delivery_radius_km
) VALUES (
             'GMP001', '김포 공항지점',
             '서울특별시 강서구 하늘길 38', '김포국제공항 인근', '02-0000-0000',
             '09:00:00', '20:00:00', '09:00~20:00',
             90.00000000, 180.00000000, '서울/경기',
             1,
             'Y','Y','Y',
             'N', NULL
         );

-- =========================
-- 2) INSURANCE: 3종
-- =========================
INSERT INTO INSURANCE (
    code, label, summary_label,
    extra_daily_price,
    is_default, is_active, sort_order
) VALUES
      ('NONE',     '선택안함', '보험 미선택',                 0,      TRUE, TRUE, 1),
      ('STANDARD', '일반자차', '일반 보장(기본 자기부담금)',  7000,   FALSE, TRUE, 2),
      ('FULL',     '완전자차', '사고 시 고객부담금 면제',     15000,  FALSE, TRUE, 3);

-- =========================
-- 3) COUPON: 1장 (MVP용)
-- =========================
INSERT INTO COUPON (
    coupon_code, coupon_name,
    discount_type, discount_value, max_discount_amount, min_order_amount,
    valid_from, valid_to,
    total_quantity, used_quantity,
    is_active
) VALUES (
             'OPEN10', '오픈기념 10% 할인',
             'RATE', 10, 50000, 0,
             NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY),
             NULL, 0,
             TRUE
         );

-- =========================
-- 4) BRANCH_SERVICE_POINT: 인수/반납 포인트
-- =========================
INSERT INTO BRANCH_SERVICE_POINT (
    branch_id, point_name, service_type,
    service_start_time, service_end_time, service_hours,
    location_desc, walking_time
)
SELECT
    b.branch_id,
    x.point_name,
    x.service_type,
    x.service_start_time,
    x.service_end_time,
    x.service_hours,
    x.location_desc,
    x.walking_time
FROM BRANCH b
         JOIN (
    SELECT '국내선 1층 3번 게이트 앞' AS point_name, 'PICKUP' AS service_type,
           '09:00:00' AS service_start_time, '20:00:00' AS service_end_time,
           '09:00~20:00' AS service_hours,
           '렌터카 픽업 안내 표지판 기준 대기' AS location_desc,
           3 AS walking_time
    UNION ALL
    SELECT '국내선 1층 5번 게이트 앞', 'RETURN',
           '09:00:00', '20:00:00',
           '09:00~20:00',
           '반납 후 차량 상태 확인 진행', 4
) x
WHERE b.branch_code = 'GMP001';

-- =========================
-- 5) CAR_SPEC: 25개 차종
--    (연식/차급/연료/4WD 여부는 MVP용으로 현실적으로 채움)
-- =========================
INSERT INTO CAR_SPEC (
    brand, model_name, display_name_short,
    car_class, model_year_base,
    ai_summary,
    fuel_type, transmission_type, is_four_wheel_drive,
    min_driver_age, min_license_years,
    seating_capacity, trunk_capacity, fuel_efficiency,
    main_image_url, img_url, ai_keywords, drive_labels
) VALUES
-- 기아
('기아','K3 2세대','K3','COMPACT',2023,'도심 주행에 최적화된 실속형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'K3,세단','가솔린,세단,도심'),
('기아','K3 2세대 F/L','K3','COMPACT',2023,'더 세련된 디자인과 안정적인 주행감','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'K3,세단','가솔린,세단,도심'),
('기아','K5 3세대','K5','MID',2023,'주행 밸런스 좋은 중형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'K5,세단','가솔린,중형,세단'),
('기아','K5 3세대 F/L','K5','MID',2024,'편의사양 강화된 중형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'K5,세단','가솔린,중형,세단'),
('기아','K7 2세대','K7','LARGE',2022,'안락한 승차감의 준대형 세단','GASOLINE','AUTO',FALSE,21,1,5,'대형','-','',NULL,'K7,세단','가솔린,준대형,세단'),
('기아','K7 2세대 F/L','K7','LARGE',2023,'고급감과 정숙성이 강점인 준대형','GASOLINE','AUTO',FALSE,21,1,5,'대형','-','',NULL,'K7,세단','가솔린,준대형,세단'),

('기아','레이 1세대 F/L1','레이','LIGHT',2021,'실내 공간 활용이 뛰어난 경차','GASOLINE','AUTO',FALSE,21,1,5,'넉넉','-','',NULL,'레이,경차','가솔린,경차,시내'),
('기아','레이 1세대 F/L2','레이','LIGHT',2022,'초보 운전자에게 편한 컴팩트','GASOLINE','AUTO',FALSE,21,1,5,'넉넉','-','',NULL,'레이,경차','가솔린,경차,시내'),

('기아','모닝 3세대','모닝','LIGHT',2020,'연비와 주차가 쉬운 경차','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'모닝,경차','가솔린,경차,시내'),
('기아','모닝 3세대 F/L','모닝','LIGHT',2021,'도심 이동에 최적화된 경차','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'모닝,경차','가솔린,경차,시내'),
('기아','모닝 3세대 F/L2','모닝','LIGHT',2022,'가성비 좋은 경차 선택지','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'모닝,경차','가솔린,경차,시내'),

('기아','스토닉','스토닉','SUV',2020,'가볍게 타기 좋은 소형 SUV','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'스토닉,SUV','가솔린,SUV,소형'),
('기아','스포티지 5세대','스포티지','SUV',2023,'장거리/패밀리 모두 좋은 SUV','GASOLINE','AUTO',TRUE,21,1,5,'넉넉','-','',NULL,'스포티지,SUV','가솔린,SUV,패밀리,4WD'),
('기아','쏘렌토 4세대','쏘렌토','SUV',2023,'패밀리 여행에 강한 중형 SUV','GASOLINE','AUTO',TRUE,21,1,5,'대형','-','',NULL,'쏘렌토,SUV','가솔린,SUV,패밀리,4WD'),

('기아','카니발 3세대 F/L 9인승','카니발','RV',2021,'9인승 대가족 이동에 최적','GASOLINE','AUTO',FALSE,21,1,9,'대형','-','',NULL,'카니발,9인승','가솔린,RV,9인승'),
('기아','카니발 4세대 하이리무진 9인승','카니발','RV',2023,'프리미엄 9인승 하이리무진','GASOLINE','AUTO',FALSE,21,1,9,'대형','-','',NULL,'카니발,하이리무진,9인승','가솔린,RV,9인승,프리미엄'),

-- 현대
('현대','그랜저 GN7','그랜저','LARGE',2023,'정숙성과 승차감이 강점인 준대형','GASOLINE','AUTO',FALSE,21,1,5,'대형','-','',NULL,'그랜저,세단','가솔린,준대형,세단'),
('현대','스타리아 11인승','스타리아','RV',2022,'단체 이동/공항 픽업에 최적','DIESEL','AUTO',FALSE,21,1,11,'대형','-','',NULL,'스타리아,11인승','디젤,승합,11인승'),

('현대','쏘나타 DN8','쏘나타','MID',2022,'균형 잡힌 중형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'쏘나타,세단','가솔린,중형,세단'),
('현대','쏘나타 DN8 디 엣지','쏘나타','MID',2023,'디자인 개선된 중형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'쏘나타,세단','가솔린,중형,세단'),

('현대','아반떼 CN7','아반떼','COMPACT',2022,'실용성 좋은 준중형 세단','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'아반떼,세단','가솔린,준중형,세단'),
('현대','아반떼 CN7 F/L','아반떼','COMPACT',2024,'연비/디자인 모두 잡은 준중형','GASOLINE','AUTO',FALSE,21,1,5,'기본','-','',NULL,'아반떼,세단','가솔린,준중형,세단'),

-- 제네시스
('제네시스','제네시스 G80 3세대','G80','LARGE',2023,'고급 세단의 정석, 비즈니스 추천','GASOLINE','AUTO',FALSE,25,3,5,'대형','-','',NULL,'G80,세단','가솔린,대형,프리미엄'),
('제네시스','제네시스 GV70','GV70','SUV',2023,'프리미엄 SUV, 주행 안정감','GASOLINE','AUTO',TRUE,25,3,5,'넉넉','-','',NULL,'GV70,SUV','가솔린,SUV,프리미엄,4WD'),

-- 테슬라 (전기 -> IMPORT + ELECTRIC 규칙 반영)
('테슬라','테슬라 모델 3 롱레인지','모델3','IMPORT',2023,'전기차 롱레인지, 장거리 최적','ELECTRIC','AUTO',TRUE,25,3,5,'기본','-','',NULL,'모델3,전기차','전기,세단,롱레인지,4WD');


-- =========================
-- 6) CAR_OPTION: 모든 차종에 공통 옵션 2개 (카시트/네비)
-- =========================
INSERT INTO CAR_OPTION (car_spec_id, option_name, description, daily_price, is_highlight)
SELECT
    s.spec_id,
    v.option_name,
    v.description,
    v.daily_price,
    v.is_highlight
FROM CAR_SPEC s
         JOIN (
    SELECT '카시트' AS option_name, '유아용 카시트(1개)' AS description, 5000 AS daily_price, TRUE AS is_highlight
    UNION ALL
    SELECT '네비게이션', '내장/스마트폰 연동 네비', 0, FALSE
) v;

-- =========================
-- 7) PRICE_POLICY: MONTHLY 기준가 (스크린샷 평균 1개월 가격)
--     - 지점은 김포공항지점으로 고정
-- =========================
INSERT INTO PRICE_POLICY (
    spec_id, branch_id,
    unit_type, base_price,
    discount_rate, valid_from, valid_to, is_active
)
SELECT
    s.spec_id,
    b.branch_id,
    'MONTHLY' AS unit_type,
    p.base_price,
    /* 할인율은 MVP용으로 섞기 */
    CASE
        WHEN MOD(s.spec_id, 5) = 0 THEN 15
        WHEN MOD(s.spec_id, 5) = 1 THEN 5
        WHEN MOD(s.spec_id, 5) = 2 THEN 10
        WHEN MOD(s.spec_id, 5) = 3 THEN 0
        ELSE 7
        END AS discount_rate,
    NOW(), NULL, TRUE
FROM CAR_SPEC s
         JOIN BRANCH b ON b.branch_code = 'GMP001'
         JOIN (
    SELECT 'K3 2세대' AS model_name, 510000 AS base_price UNION ALL
    SELECT 'K3 2세대 F/L', 539000 UNION ALL
    SELECT 'K5 3세대', 650000 UNION ALL
    SELECT 'K5 3세대 F/L', 779000 UNION ALL
    SELECT 'K7 2세대', 589000 UNION ALL
    SELECT 'K7 2세대 F/L', 750000 UNION ALL
    SELECT '그랜저 GN7', 976750 UNION ALL
    SELECT '레이 1세대 F/L1', 519000 UNION ALL
    SELECT '레이 1세대 F/L2', 562667 UNION ALL
    SELECT '모닝 3세대', 444500 UNION ALL
    SELECT '모닝 3세대 F/L', 489000 UNION ALL
    SELECT '모닝 3세대 F/L2', 545000 UNION ALL
    SELECT '스타리아 11인승', 1229000 UNION ALL
    SELECT '스토닉', 609000 UNION ALL
    SELECT '스포티지 5세대', 916750 UNION ALL
    SELECT '쏘나타 DN8', 602333 UNION ALL
    SELECT '쏘나타 DN8 디 엣지', 724000 UNION ALL
    SELECT '쏘렌토 4세대', 1114500 UNION ALL
    SELECT '아반떼 CN7', 659000 UNION ALL
    SELECT '아반떼 CN7 F/L', 600000 UNION ALL
    SELECT '제네시스 G80 3세대', 1590000 UNION ALL
    SELECT '제네시스 GV70', 1640000 UNION ALL
    SELECT '카니발 3세대 F/L 9인승', 949000 UNION ALL
    SELECT '카니발 4세대 하이리무진 9인승', 1490000 UNION ALL
    SELECT '테슬라 모델 3 롱레인지', 1450000
) p ON p.model_name = s.model_name;

-- =========================
-- 8) PRICE (Legacy): 대략값 채움
--     - daily_price = monthly/30 근사
-- =========================
INSERT INTO PRICE (car_spec_id, daily_price, price_1m, price_3m, price_6m)
SELECT
    s.spec_id,
    ROUND(pp.base_price / 30, 2) AS daily_price,
    pp.base_price AS price_1m,
    pp.base_price * 3 AS price_3m,
    pp.base_price * 6 AS price_6m
FROM CAR_SPEC s
         JOIN BRANCH b ON b.branch_code = 'GMP001'
         JOIN PRICE_POLICY pp
              ON pp.spec_id = s.spec_id
                  AND pp.branch_id = b.branch_id
                  AND pp.unit_type = 'MONTHLY'
                  AND pp.is_active = TRUE;

-- =========================
-- 9) VEHICLE_INVENTORY: 차종당 2대씩 (총 50대)
--     - 상태 섞기: 1대는 AVAILABLE, 2대는 (RESERVED/RENTED/MAINTENANCE) 순환
-- =========================
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin,
    model_year,
    operational_status,
    mileage, last_inspected_at, is_active
)
SELECT
    s.spec_id,
    b.branch_id,
    CONCAT('GMP-', LPAD(s.spec_id, 3, '0'), '-', n.n) AS vehicle_no,
    CONCAT('VIN-', LPAD(s.spec_id, 3, '0'), '-', n.n) AS vin,
    s.model_year_base AS model_year,
    CASE
        WHEN n.n = 1 THEN 'AVAILABLE'
        ELSE CASE MOD(s.spec_id, 3)
                 WHEN 0 THEN 'RESERVED'
                 WHEN 1 THEN 'RENTED'
                 ELSE 'MAINTENANCE'
            END
        END AS operational_status,
    (s.spec_id * 1200) + (n.n * 137) AS mileage,
    DATE_SUB(NOW(), INTERVAL (s.spec_id + n.n) DAY) AS last_inspected_at,
    TRUE AS is_active
FROM CAR_SPEC s
         JOIN BRANCH b ON b.branch_code = 'GMP001'
         JOIN (SELECT 1 AS n UNION ALL SELECT 2) n;
UPDATE CAR_SPEC SET car_class = 'LIGHT'   WHERE car_class = '경형';
UPDATE CAR_SPEC SET car_class = 'SMALL'   WHERE car_class = '소형';
UPDATE CAR_SPEC SET car_class = 'COMPACT' WHERE car_class = '준중형';
UPDATE CAR_SPEC SET car_class = 'MID'     WHERE car_class = '중형';
UPDATE CAR_SPEC SET car_class = 'LARGE'   WHERE car_class = '대형';
UPDATE CAR_SPEC SET car_class = 'IMPORT'  WHERE car_class = '수입';
UPDATE CAR_SPEC SET car_class = 'RV'      WHERE car_class IN ('승합', '승합RV', '승합 RV');
UPDATE CAR_SPEC SET car_class = 'SUV'     WHERE car_class = 'SUV';
UPDATE CAR_SPEC SET car_class = 'LIGHT' WHERE car_class = '경차';
UPDATE CAR_SPEC SET car_class = 'LARGE' WHERE car_class = '준대형';
UPDATE CAR_SPEC SET car_class = 'SUV'   WHERE car_class = '소형SUV';
UPDATE CAR_SPEC
SET car_class = 'IMPORT',
    fuel_type = 'ELECTRIC'
WHERE car_class = '전기';
SELECT DISTINCT car_class
FROM CAR_SPEC
WHERE car_class NOT IN ('LIGHT','SMALL','COMPACT','MID','LARGE','IMPORT','RV','SUV');




SET FOREIGN_KEY_CHECKS = 1;
