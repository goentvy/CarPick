

-- 1. 미가입 (NONE)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, insurance_label , summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW());

-- 2. 일반자차 (STANDARD)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, insurance_label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW());

-- 3. 완전자차 (FULL)
-- is_default: 1 (True), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, insurance_label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());


INSERT INTO CAR_SPEC (
    brand,
    model_name,
    display_name_short,
    car_class,
    model_year_base,
    fuel_type,
    transmission_type,
    min_driver_age,
    seating_capacity,
    trunk_capacity,
    ai_summary
) VALUES
/* 1. 경형 (KIA 모닝) */
      ('KIA', '모닝 3세대', '모닝', 'LIGHT', 2020, 'GASOLINE', 'AUTO', 26, 5, '캐리어 1개', '도심 주행에 최적화된 경제적인 경차'),

/* 2. 준중형 (KIA K3) */
      ('KIA', 'K3 2세대', 'K3', 'COMPACT', 2020, 'GASOLINE', 'AUTO', 26, 5, '캐리어 3개', '기본기가 탄탄한 준중형 세단'),

/* 3. 경형 (KIA 모닝 F/L) */
      ('KIA', '모닝 3세대 F/L', '모닝', 'LIGHT', 2021, 'GASOLINE', 'AUTO', 21, 5, '캐리어 1개', '페이스리프트로 더욱 세련된 모닝'),

/* 4. 준중형 (KIA K3 F/L) */
      ('KIA', 'K3 2세대 F/L', 'K3', 'COMPACT', 2022, 'GASOLINE', 'AUTO', 26, 5, '캐리어 3개', '스타일리시한 디자인의 준중형'),

/* 5. 경형 (KIA 모닝 F/L2) */
      ('KIA', '모닝 3세대 F/L2', '모닝', 'LIGHT', 2025, 'GASOLINE', 'AUTO', 26, 5, '캐리어 1개', '최신 안전 사양이 탑재된 신형 모닝'),

/* 6. 중형 (KIA K5 LPG) */
      ('KIA', 'K5 3세대', 'K5', 'MID', 2020, 'LPG', 'AUTO', 26, 5, '캐리어 3개', 'LPG로 경제성을 잡은 스타일리시 세단'),

/* 7. 준중형 (HYUNDAI 아반떼) */
      ('HYUNDAI', '아반떼 CN7 F/L', '아반떼', 'COMPACT', 2024, 'GASOLINE', 'AUTO', 26, 5, '캐리어 3개', '국민 준중형, 압도적인 상품성'),

/* 8. 중형 (HYUNDAI 쏘나타) */
      ('HYUNDAI', '쏘나타 DN8', '쏘나타', 'MID', 2022, 'LPG', 'AUTO', 21, 5, '캐리어 3개', '편안한 승차감의 중형 세단 정석'),

/* 9. 경형 (KIA 레이) */
      ('KIA', '레이 1세대 F/L2', '레이', 'LIGHT', 2024, 'GASOLINE', 'AUTO', 26, 5, '캐리어 1개', '경차 그 이상의 공간 활용성'),

/* 10. 중형 (KIA K5 F/L) */
      ('KIA', 'K5 3세대 F/L', 'K5', 'MID', 2024, 'LPG', 'AUTO', 21, 5, '캐리어 3개', '페이스리프트로 완성된 디자인'),

/* 11. SUV (SSANGYONG 티볼리) */
      ('KG_MOBILITY', '티볼리 아머', '티볼리', 'SUV', 2021, 'GASOLINE', 'AUTO', 26, 5, '캐리어 2개', '소형 SUV의 트렌드 세터'),

/* 12. SUV (KIA 스포티지) */
      ('KIA', '스포티지 5세대', '스포티지', 'SUV', 2024, 'GASOLINE', 'AUTO', 26, 5, '캐리어 4개', '넓은 공간과 하이테크 인');

-- ==========================================
-- 🚗 CarPick MVP용 초기 필수 데이터 (Branch, Car, Price)
-- ==========================================

-- 1. [지점] 김포공항점 (branch_id=1)
INSERT INTO BRANCH (
    branch_id, branch_code, branch_name,
    address_basic, address_detail, phone,
    latitude, longitude, region_dept1,
    open_time, close_time, business_hours,
    can_manage_inventory_yn, can_manage_vehicle_status_yn, can_pickup_return_yn,
    use_yn
) VALUES (
             1, 'GMP01', '김포공항점',
             '서울 강서구 하늘길 112', '국제선 청사 1층 렌터카 데스크', '02-1234-5678',
             37.558643, 126.801242, 'SEOUL',
             '08:00:00', '22:00:00', '매일 08:00 ~ 22:00',
             'Y', 'Y', 'Y',
             'Y'
         ) ON DUPLICATE KEY UPDATE branch_name = branch_name;


-- 2. [차종] 기아 스포티지 5세대 (spec_id=1, SUV)
INSERT INTO CAR_SPEC (
    spec_id, brand, model_name, display_name_short,
    car_class, fuel_type, transmission_type, seating_capacity,
    model_year_base, use_yn,
    main_image_url
) VALUES (
             1, 'KIA', '스포티지 5세대', '스포티지 NQ5',
             'SUV', 'GASOLINE', 'AUTO', 5,
             2024, 'Y',
             'https://www.kia.com/content/dam/kwcms/kr/ko/images/vehicles/sportage/nq5/2024/sportage_nq5_2024_exterior_snow-white-pearl.png'
         ) ON DUPLICATE KEY UPDATE
                                car_class = 'SUV',
                                use_yn = 'Y'; -- 혹시 기존 데이터가 있어도 SUV로 강제 수정


-- 3. [가격 정책] 기본가 12만원, 할인 30% (unit_type='DAILY' 필수!)
INSERT INTO PRICE_POLICY (
    spec_id, branch_id,
    base_price, discount_rate,
    unit_type, -- ★ 핵심 컬럼
    is_active, valid_from, valid_to
) VALUES (
             1, 1,
             120000, 30,
             'DAILY',
             1, NOW(), '2099-12-31 23:59:59'
         ) ON DUPLICATE KEY UPDATE unit_type = 'DAILY';


-- 4. [차량 실재고] 스포티지 2대 등록
-- 1호차
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    is_active, use_yn
) VALUES (
             1, 1,
             '105하1545', 'KNA12345678900001', 2024,
             'AVAILABLE', 5200, NOW(),
             1, 'Y'
         );

-- 2호차
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    is_active, use_yn
) VALUES (
             1, 1,
             '234호7890', 'KNA12345678900002', 2023,
             'AVAILABLE', 12500, NOW(),
             1, 'Y'
         );

COMMIT;