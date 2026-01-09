SET FOREIGN_KEY_CHECKS = 0;

-- 1. 데이터 초기화 (순서 중요)
TRUNCATE TABLE PENALTY_CHARGE;
TRUNCATE TABLE PENALTY_POLICY_VERSION;
TRUNCATE TABLE PENALTY_POLICY;
TRUNCATE TABLE RESERVATION_EXTENSION;
TRUNCATE TABLE RESERVATION_STATUS_HISTORY;
TRUNCATE TABLE VEHICLE_STATUS_HISTORY;
TRUNCATE TABLE RESERVATION;
TRUNCATE TABLE VEHICLE_INVENTORY;
TRUNCATE TABLE PRICE;
TRUNCATE TABLE PRICE_POLICY;
TRUNCATE TABLE CAR_OPTION;
TRUNCATE TABLE INSURANCE;
TRUNCATE TABLE COUPON;
TRUNCATE TABLE DROPZONE_POINT;
TRUNCATE TABLE BRANCH;
TRUNCATE TABLE CAR_SPEC;


SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================
-- 2. 보험 상품 (INSURANCE)
-- ==========================================
INSERT INTO INSURANCE
(insurance_code, insurance_label , summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW()),
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW()),
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());


-- ==========================================
-- 3. 지점 (BRANCH)
-- ==========================================
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
         ),
        (
            2, 'ICN01', '인천공항점',
            '인천 중구 공항로 272', '제1여객터미널 렌터카 데스크',
            '032-123-4567',
            37.460190, 126.440696, 'INCHEON',
            '07:00:00', '23:00:00', '매일 07:00 ~ 23:00',
            'Y', 'Y', 'Y',
            'Y'
         ),
         (
             3, 'CJU01', '제주공항점',
             '제주특별자치도 제주시 공항로 2', '국내선 1층 렌터카 존',
             '064-123-4567',
             33.507077, 126.492770, 'JEJU',
             '08:00:00', '22:00:00', '매일 08:00 ~ 22:00',
             'Y', 'Y', 'Y',
             'Y'
         ),
         (
             4, 'PUS01', '김해공항점',
             '부산 강서구 공항진입로 108', '국내선 1층 렌터카 데스크',
             '051-123-4567',
             35.179554, 128.938213, 'BUSAN',
             '07:00:00', '22:00:00', '매일 07:00 ~ 22:00',
             'Y', 'Y', 'Y',
             'Y'
         ),
         (5, 'TAE01', '대구공항점',
          '대구 동구 공항로 221', '국내선 렌터카 구역',
          '053-123-4567',
          35.896384, 128.655334, 'DAEGU',
          '08:00:00', '21:00:00', '매일 08:00 ~ 21:00',
          'Y', 'Y', 'Y',
          'Y'
         );



-- 1-1. [지점 기준 드롭존]
INSERT INTO DROPZONE_POINT (
    branch_id,
    dropzone_code,
    dropzone_name,
    address_text,
    location_desc,
    walking_time_min,
    latitude,
    longitude,
    service_hours,
    is_active
) VALUES

/* 1) 신방화역 환승주차장 (공식/데이터로 좌표 확인됨) */
      (
          1,
          '1',
          '신방화역 환승주차장',
          '서울 강서구 마곡서1로 111-12 (신방화역 환승주차장)',
          '역 바로 옆 환승 공영주차장. 공항 혼잡 회피용 기본 드롭존',
          3,
          37.566788,
          126.817786,
          '00:00 ~ 24:00',
          1
      ),

/* 2) 방화역(동) 공영주차장 (주소는 공식, 좌표는 역 근처 근사값) */
      (
          1,
          '2',
          '방화역 공영주차장',
          '서울 강서구 방화동 830-4 (방화역(동) 공영주차장)',
          '5호선 방화역 도보권 공영주차장. 공항 외곽 집결지로 안정적',
          5,
          37.577631,
          126.812840,
          '08:00 ~ 21:00',
          1
      ),

/* 3) 개화역 환승주차장 (주소는 공식, 좌표는 역/권역 근처 근사값) */
      (
          1,
          '3',
          '개화역 환승주차장',
          '서울 강서구 개화동로8길 19 (개화역 환승주차장)',
          '9호선 개화역 연계 환승주차장. 공항 주차 대체로 많이 쓰는 타입',
          6,
          37.578584,
          126.797405,
          '00:00 ~ 24:00',
          1
      ),

/* 4) 마곡권 공용주차장(마곡시티관리공단) (좌표 제공된 데이터 기반) */
      (
          1,
          '4',
          '마곡권 공용주차장',
          '서울 강서구 마곡서로 170 (마곡동 758 인근 주차장 권역)',
          '마곡/마곡나루권 집결용. 공항과 동선 분리 + 차량 대기 수월',
          7,
          37.569305,
          126.825595,
          '00:00 ~ 24:00',
          1
      );

-- ==========================================
-- 4. 차량 모델 (CAR_SPEC) - 12종
-- ==========================================
INSERT INTO CAR_SPEC (
    spec_id, brand, model_name, display_name_short, car_class, model_year_base,
    ai_summary, fuel_type, transmission_type, is_four_wheel_drive,
    car_options, min_driver_age, min_license_years,
    seating_capacity, trunk_capacity, fuel_efficiency,
    main_image_url, img_url, ai_keywords, drive_labels
) VALUES
/* 1. 경형 (KIA 모닝) */
      (1, 'KIA', '모닝 3세대', '모닝', 'LIGHT', 2020,
       '도심 주행에 최적화된 경제적인 경차', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방센서,블루투스,열선시트', 26, 1, 5, '캐리어 1개', '15.7',
       '/images/cars/morning_2020.png', '/images/cars/morning_detail.png',
       '#경차,#출퇴근,#가성비,#주차편리', '가솔린,경차,경제적'),

/* 2. 준중형 (KIA K3) */
      (2, 'KIA', 'K3 2세대', 'K3', 'COMPACT', 2020,
       '기본기가 탄탄한 준중형 세단', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,열선시트,차선이탈방지', 26, 1, 5, '캐리어 3개', '15.2',
       '/images/cars/k3_2020.png', '/images/cars/k3_detail.png',
       '#준중형,#데이트,#드라이브,#가성비', '가솔린,5인승,인기모델'),

/* 3. 경형 (KIA 모닝 F/L) */
      (3, 'KIA', '모닝 3세대 F/L', '모닝', 'LIGHT', 2021,
       '페이스리프트로 더욱 세련된 모닝', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,통풍시트(운전석),블루투스', 21, 1, 5, '캐리어 1개', '15.7',
       '/images/cars/morning_2021.png', '/images/cars/morning_fl_detail.png',
       '#경차,#사회초년생,#마트장보기,#단기렌트', '가솔린,경차,옵션풍부'),

/* 4. 준중형 (KIA K3 F/L) */
      (4, 'KIA', 'K3 2세대 F/L', 'K3', 'COMPACT', 2022,
       '스타일리시한 디자인의 준중형', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,통풍시트,전자식파킹', 26, 1, 5, '캐리어 3개', '14.1',
       '/images/cars/k3_2022.png', '/images/cars/k3_fl_detail.png',
       '#디자인,#여행,#2030추천,#쾌적함', '가솔린,준중형,스타일'),

/* 5. 경형 (KIA 모닝 F/L2) */
      (5, 'KIA', '모닝 3세대 F/L2', '모닝', 'LIGHT', 2025,
       '최신 안전 사양이 탑재된 신형 모닝', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,어라운드뷰,스마트크루즈컨트롤,통풍시트', 26, 1, 5, '캐리어 1개', '15.1',
       '/images/cars/morning_2025.png', '/images/cars/morning_fl2_detail.png',
       '#신차,#풀옵션,#안전제일,#시내주행', '가솔린,신차,최신옵션'),

/* 6. 중형 (KIA K5 LPG) */
      (6, 'KIA', 'K5 3세대', 'K5', 'MID', 2020,
       'LPG로 경제성을 잡은 스타일리시 세단', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,전동시트', 26, 2, 5, '캐리어 3개', '10.2',
       '/images/cars/k5_lpg.png', '/images/cars/k5_lpg_detail.png',
       '#LPG,#연비절약,#장거리,#편안함', 'LPG,중형,경제성'),

/* 7. 준중형 (HYUNDAI 아반떼) */
      (7, 'HYUNDAI', '아반떼 CN7 F/L', '아반떼', 'COMPACT', 2024,
       '국민 준중형, 압도적인 상품성', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,애플카플레이,안드로이드오토,차선유지보조', 26, 1, 5, '캐리어 3개', '14.9',
       '/images/cars/avante_cn7.png', '/images/cars/avante_detail.png',
       '#국민차,#베스트셀러,#승차감,#넓은실내', '가솔린,준중형,베스트셀러'),

/* 8. 중형 (HYUNDAI 쏘나타) */
      (8, 'HYUNDAI', '쏘나타 DN8', '쏘나타', 'MID', 2022,
       '편안한 승차감의 중형 세단 정석', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,통풍시트,열선시트', 21, 2, 5, '캐리어 3개', '10.2',
       '/images/cars/sonata_dn8.png', '/images/cars/sonata_detail.png',
       '#패밀리카,#정숙성,#LPG,#부모님효도', 'LPG,중형,승차감'),

/* 9. 경형 (KIA 레이) */
      (9, 'KIA', '레이 1세대 F/L2', '레이', 'LIGHT', 2024,
       '경차 그 이상의 공간 활용성', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,열선시트,폴딩시트', 26, 1, 5, '캐리어 1개', '12.7',
       '/images/cars/ray_2024.png', '/images/cars/ray_detail.png',
       '#박스카,#넓은공간,#차박,#짐싣기좋음', '가솔린,공간활용,인기'),

/* 10. 중형 (KIA K5 F/L) */
      (10, 'KIA', 'K5 3세대 F/L', 'K5', 'MID', 2024,
       '페이스리프트로 완성된 디자인', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,어라운드뷰,헤드업디스플레이(HUD),스마트키', 21, 2, 5, '캐리어 3개', '9.8',
       '/images/cars/k5_fl_2024.png', '/images/cars/k5_fl_detail.png',
       '#디자인깡패,#젊은감성,#데이트카,#신형', 'LPG,중형,디자인'),

/* 11. SUV (SSANGYONG 티볼리) */
      (11, 'KG_MOBILITY', '티볼리 아머', '티볼리', 'SUV', 2021,
       '소형 SUV의 트렌드 세터', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,크루즈컨트롤,루프랙', 26, 1, 5, '캐리어 2개', '11.5',
       '/images/cars/tivoli.png', '/images/cars/tivoli_detail.png',
       '#SUV,#초보운전,#시야확보,#튼튼함', '가솔린,SUV,소형SUV'),

/* 12. SUV (KIA 스포티지) */
      (12, 'KIA', '스포티지 5세대', '스포티지', 'SUV', 2024,
       '넓은 공간과 하이테크 인테리어', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,파노라마썬루프,통풍시트,전동트렁크,차선이탈방지', 26, 1, 5, '캐리어 4개', '12.0',
       '/images/cars/sportage.png', '/images/cars/sportage_detail.png',
       '#패밀리SUV,#캠핑,#넉넉한공간,#여행', '가솔린,SUV,패밀리카');


-- ==========================================
-- 5. 메인 가격표 (PRICE)
-- ✅ 중요: PRICE 테이블에 'version' 컬럼이 추가되었으므로 Default(0)을 따름
-- ==========================================
INSERT INTO PRICE (car_spec_id, daily_price, monthly_price, use_yn, created_at, updated_at) VALUES
                                                                                                (1,  50000, 0,   'Y', NOW(), NOW()), -- 모닝
                                                                                                (2,  65000, 0,   'Y', NOW(), NOW()), -- K3
                                                                                                (3,  52000, 0,   'Y', NOW(), NOW()),
                                                                                                (4,  68000, 0,   'Y', NOW(), NOW()),
                                                                                                (5,  55000, 0,   'Y', NOW(), NOW()),
                                                                                                (6,  85000, 0,   'Y', NOW(), NOW()), -- K5
                                                                                                (7,  70000, 0,   'Y', NOW(), NOW()), -- 아반떼
                                                                                                (8,  90000, 0,   'Y', NOW(), NOW()), -- 쏘나타
                                                                                                (9,  60000, 0,   'Y', NOW(), NOW()), -- 레이
                                                                                                (10, 95000, 0,   'Y', NOW(), NOW()),
                                                                                                (11, 100000, 0,   'Y', NOW(), NOW()), -- 티볼리
                                                                                                (12, 120000, 0,   'Y', NOW(), NOW()); -- 스포티지


-- ==========================================
-- 6. 가격 정책 (PRICE_POLICY) - MVP 미사용이지만 더미 생성
-- spec_id 12번 (스포티지) 기준 정책 생성
-- ==========================================
INSERT INTO PRICE_POLICY (
    spec_id, branch_id,
    base_price, discount_rate, unit_type,
    is_active, valid_from, valid_to
) VALUES (
             12, 1,  -- 스포티지(12), 김포공항점(1)
             120000, 30, 'DAILY',
             1, NOW(), '2099-12-31 23:59:59'
         );


-- ==========================================
-- 7. 차량 실재고 (VEHICLE_INVENTORY)
-- ==========================================
-- (1) 스포티지 (ID 12) 재고 2대
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id, vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at, is_active, use_yn
) VALUES
      (12, 1, '105하1554', 'KNA_SPORTAGE_001', 2024, 'AVAILABLE', 5200, NOW(), 1, 'Y'),
      (12, 1, '333호3333', 'KNA_SPORTAGE_002', 2024, 'AVAILABLE', 12500, NOW(), 1, 'Y');

-- (2) 모닝 (ID 1) 재고 2대 (테스트용 추가)
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id, vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at, is_active, use_yn
) VALUES
      (1, 1, '11가1111', 'KNA_MORNING_001', 2020, 'AVAILABLE', 35000, NOW(), 1, 'Y'),
      (1, 1, '22나2222', 'KNA_MORNING_002', 2020, 'AVAILABLE', 42000, NOW(), 1, 'Y');


COMMIT;