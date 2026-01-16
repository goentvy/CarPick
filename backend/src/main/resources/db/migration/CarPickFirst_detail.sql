/* =========================================================
   AllInOne Rentcar Schema (MariaDB Compatible) - FINAL VERSION
   - Update: 2025-12-22 (Coupon & Option Price Added)
   - created_at/updated_at: CURRENT_TIMESTAMP
   - Fix: create order for FK integrity (BRANCH before PRICE_POLICY)
   ========================================================= */
/*
[DB SCHEMA BASELINE]

- 본 SQL은 CarPick 프로젝트의 현재 스키마 기준본입니다.
- MVP 단계에서는 Flyway 미적용 상태로 구조 안정화에 집중합니다.
- 실제 데이터 운영 및 협업 확장 시 Flyway migration 기준으로 전환 예정입니다.
- 모든 스키마 변경은 이 파일 또는 PR 내 SQL 변경으로 추적됩니다.
*/



USE carpick;
SET FOREIGN_KEY_CHECKS = 0;
/* 1. 확장/부가 기능 (가장 하위) */
DROP TABLE IF EXISTS RESERVATION_EXTENSION;    -- [NEW] 반납 연장
DROP TABLE IF EXISTS PENALTY_CHARGE;           -- [NEW] 패널티 부과
DROP TABLE IF EXISTS PENALTY_POLICY_VERSION;   -- [NEW] 패널티 정책 버전
DROP TABLE IF EXISTS PENALTY_POLICY;           -- [NEW] 패널티 정책 마스터

/* 2. 상태/이력 로그 */
DROP TABLE IF EXISTS RESERVATION_STATUS_HISTORY;
DROP TABLE IF EXISTS VEHICLE_STATUS_HISTORY;

/* 3. 핵심 비즈니스 */
DROP TABLE IF EXISTS RESERVATION;
DROP TABLE IF EXISTS VEHICLE_INVENTORY;
DROP TABLE IF EXISTS  SEASON_PERIOD;
/* 4. 정책/옵션/가격 */
DROP TABLE IF EXISTS PRICE;
DROP TABLE IF EXISTS PRICE_POLICY;
DROP TABLE IF EXISTS CAR_OPTION;
DROP TABLE IF EXISTS INSURANCE;
DROP TABLE IF EXISTS COUPON;
DROP TABLE IF EXISTS DROPZONE_POINT;
/* BRANCH_SERVICE_POINT는 삭제됨 */

/* 5. 마스터 데이터 */
DROP TABLE IF EXISTS BRANCH;
DROP TABLE IF EXISTS CAR_SPEC;

/* 참고: USERS 테이블은 다른 담당자 관리이므로 DROP 하지 않음 (FK 에러 방지용) */
DROP TABLE IF EXISTS  reviews;


/* ==================================================
   1. 기초 정보 테이블 (Master Data)
   ================================================== */

/* [1] 차량 스펙/모델 정보 */
CREATE TABLE IF NOT EXISTS CAR_SPEC (
    spec_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '모델 고유 ID',

    /* 기본 정보 */
    brand VARCHAR(50) NOT NULL COMMENT '브랜드 (현대, 기아 등)',

    /* 풀네임(상세페이지용) */
    model_name VARCHAR(150) NOT NULL COMMENT '모델명(상세용 Full name)',
#     차량 상세페이지 대표 색상
    car_color ENUM('WHITE','BLACK','RED','BLUE') NOT NULL COMMENT '상세/카드 대표 색상(군청 포함 BLUE)',
    /* [추가] 쇼트네임(카드용) */
    display_name_short VARCHAR(60) NULL COMMENT '카드용 짧은 모델명(소렌토/캐스퍼 등)',

    car_class ENUM('LIGHT','SMALL','COMPACT','MID','LARGE','IMPORT','RV','SUV')
        NOT NULL COMMENT '차량 등급',
    model_year_base SMALLINT NOT NULL COMMENT '대표 연식',
    
    /* ai 요약 문구 */
    ai_summary TEXT COMMENT 'ai 추천문구 관리자 페이지에서 관리',
    
    /* 파워트레인 */
    fuel_type ENUM('GASOLINE','DIESEL','LPG','ELECTRIC','HYBRID','HYDROGEN')
        NOT NULL COMMENT '연료 타입',
    transmission_type VARCHAR(20) NOT NULL DEFAULT 'AUTO' COMMENT '변속기',
    is_four_wheel_drive BOOLEAN NOT NULL DEFAULT FALSE
        COMMENT '사륜구동 여부 (TRUE=4WD/AWD)',
    /* ✅ [추가] 차량 고유 옵션 (빌트인 기능) */
    car_options VARCHAR(500) NULL COMMENT '차량 고유 옵션(예: 네비게이션, 썬루프, 통풍시트, 블루투스) - 콤마 구분',
        
    /* [정책] 대여 자격 */
    min_driver_age TINYINT NOT NULL DEFAULT 21 COMMENT '대여 가능 최저 연령',
    min_license_years TINYINT NOT NULL DEFAULT 1 COMMENT '최저 면허 경력 년수',

    /* 제원 */
    seating_capacity INT NOT NULL COMMENT '승차 정원',
    trunk_capacity VARCHAR(50) NULL COMMENT '적재 공간 설명',
    fuel_efficiency VARCHAR(50) NULL COMMENT '연비',

    /* 이미지/태그 */
    main_image_url VARCHAR(255) NULL COMMENT '대표 이미지',
    img_url VARCHAR(500) NULL COMMENT '추가 이미지',
    ai_keywords VARCHAR(500) NULL COMMENT 'AI 검색 태그',

    /* [추가] 카드 라벨/주행 태그(프론트용) - MVP는 문자열로 묶어서 전달 */
    drive_labels VARCHAR(200) NULL COMMENT '카드 라벨(예: 가솔린, 경차, 도심주행) - CSV or JSON string',
    
    /* 기본 조회 조건: use_yn='Y' */
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_car_spec (brand, model_name, model_year_base)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* [2] 지점 (BRANCH)  ※ PRICE_POLICY FK 때문에 먼저 생성 */
CREATE TABLE IF NOT EXISTS BRANCH (
    branch_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지점 ID',
    branch_code VARCHAR(20) NOT NULL COMMENT '지점 코드_자연키(Natural Key, Code)',
    branch_name VARCHAR(100) NOT NULL COMMENT '지점명',

    address_basic VARCHAR(255) NOT NULL COMMENT '주소',
    address_detail VARCHAR(255) NULL COMMENT '상세주소',
    phone VARCHAR(20) NOT NULL COMMENT '전화번호',

    image_url VARCHAR(255) NULL COMMENT '지점 대표 이미지 URL',

    open_time TIME NULL COMMENT '오픈 시간',
    close_time TIME NULL COMMENT '마감 시간',
    business_hours VARCHAR(255) NULL COMMENT '영업시간 텍스트',

    latitude DECIMAL(10,8) NULL COMMENT '위도',
    longitude DECIMAL(11,8) NULL COMMENT '경도',
    region_dept1 VARCHAR(50) NULL COMMENT '지역(서울/경기)',

    is_active BOOLEAN NOT NULL DEFAULT 1,

    /* Capability Flags */
    can_manage_inventory_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_manage_vehicle_status_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_pickup_return_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_delivery_yn CHAR(1) NOT NULL DEFAULT 'N',
    delivery_radius_km INT NULL COMMENT '딜리버리 반경(km)',

    /* 기본 조회 조건: use_yn='Y' */
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_branch_code (branch_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* [3] 차량 옵션 (가격 추가됨) */
CREATE TABLE IF NOT EXISTS CAR_OPTION (
    option_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '옵션 ID',


    option_name VARCHAR(100) NOT NULL COMMENT '옵션명(카시트, 네비 등 추가 가능한 옵션)',
    option_description TEXT NULL COMMENT '옵션 설명',

    /* 옵션 요금 */
    option_daily_price INT NOT NULL DEFAULT 0 COMMENT '옵션 1일 대여료(0이면 무료)',

    is_highlight BOOLEAN NOT NULL DEFAULT FALSE COMMENT '주요 옵션 노출 여부',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    use_yn CHAR(1) DEFAULT 'Y' COMMENT '삭제여부(Y:사용, N:삭제)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',
    
    UNIQUE KEY uk_car_option ( option_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* [4] 가격 정책 (차량 기본료) */
CREATE TABLE IF NOT EXISTS PRICE_POLICY (
    price_policy_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '가격정책 ID',
    spec_id BIGINT NOT NULL COMMENT '차량 스펙 ID (FK)',
    branch_id BIGINT NULL COMMENT '지점 ID (NULL=전국)(FK)',

    unit_type ENUM('DAILY','MONTHLY') NOT NULL COMMENT '요금 단위',
    base_price INT NOT NULL COMMENT '기준 대여료(Dynamic Pricing용)',

    /* MVP 핵심 가짜 할인율*/
    discount_rate TINYINT NOT NULL DEFAULT 0 COMMENT '할인율(0~100)',
    valid_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '적용 시작일',
    valid_to DATETIME NULL COMMENT '적용 종료일',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
-- 기본 조회 조건: use_yn='Y'
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',   -- [추가]
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',              -- [추가]


    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_price_lookup (spec_id, branch_id, unit_type, is_active),
    CONSTRAINT fk_price_policy_spec
        FOREIGN KEY (spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE,
    CONSTRAINT fk_price_policy_branch
        FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==================================================
   [5] 보험 옵션 (INSURANCE)
   - 보험 선택 카드 + 보험정보(면책/보상/자기부담금) UI 대응
   - 예약 시 스냅샷용 기준 데이터
   ================================================== */

CREATE TABLE IF NOT EXISTS INSURANCE (
                                         insurance_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '보험 옵션 ID',

    /* 보험 식별 */
                                         insurance_code ENUM('NONE','STANDARD','FULL')
                                             NOT NULL
                                             COMMENT '보험 코드',
                                         insurance_label VARCHAR(50) NOT NULL COMMENT '표시 이름 (선택안함 / 일반자차 / 완전자차)',
                                         summary_label VARCHAR(100) NULL COMMENT '요약 문구 (사고 시 고객부담금 면제 등)',

    /* 요금 */
                                         extra_daily_price DECIMAL(15, 0) NOT NULL DEFAULT 0 COMMENT '1일 보험 추가요금',



    /* 설명 */


    /* UI / 정책 */
                                         is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '기본 선택 여부',
                                         is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',
                                         sort_order INT NOT NULL DEFAULT 0 COMMENT '노출 순서',
-- 기본 조회 조건: use_yn='Y'
                                         use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',   -- [추가]
                                         deleted_at DATETIME NULL COMMENT '삭제 처리 일시',              -- [추가]



    /* 공통 */
                                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                         UNIQUE KEY uk_insurance_code (insurance_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* [6] 쿠폰 */
CREATE TABLE IF NOT EXISTS COUPON (
                                      coupon_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '쿠폰 ID',

                                      coupon_code VARCHAR(50) NOT NULL COMMENT '쿠폰 코드(입력용)',
                                      coupon_name VARCHAR(100) NOT NULL COMMENT '쿠폰명(오픈기념 10%)',

                                      discount_type ENUM('FIXED','RATE') NOT NULL DEFAULT 'FIXED' COMMENT '할인타입(정액/정률)',
                                      discount_value INT NOT NULL COMMENT '할인값(원/%)',
                                      max_discount_amount INT NULL COMMENT '최대 할인 금액(정률일 때)',
                                      min_order_amount INT NOT NULL DEFAULT 0 COMMENT '최소 주문 금액 조건',

                                      valid_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '유효 시작일',
                                      valid_to DATETIME NOT NULL COMMENT '유효 종료일',

                                      total_quantity INT NULL COMMENT '발행 총 수량(NULL=무제한)',
                                      used_quantity INT NOT NULL DEFAULT 0 COMMENT '사용된 수량',
-- 기본 조회 조건: use_yn='Y'
                                      use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',   -- [추가]
                                      deleted_at DATETIME NULL COMMENT '삭제 처리 일시',              -- [추가]



                                      is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 여부',

                                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                      UNIQUE KEY uk_coupon_code (coupon_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/* [7] 드롭존 포인트 <경진>*/
CREATE TABLE IF NOT EXISTS DROPZONE_POINT (
                                              dropzone_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              branch_id BIGINT NOT NULL,

                                              dropzone_code VARCHAR(30) NOT NULL,
                                              dropzone_name VARCHAR(100) NOT NULL,

                                              address_text VARCHAR(255) NULL,
                                              location_desc TEXT NULL,
                                              walking_time_min INT NULL,

                                              latitude DECIMAL(10,8) NOT NULL,
                                              longitude DECIMAL(11,8) NOT NULL,

                                              service_hours VARCHAR(100) NULL,

                                              is_active BOOLEAN NOT NULL DEFAULT 1,
                                              deleted_at DATETIME NULL,

                                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                              CONSTRAINT fk_dropzone_branch
                                                  FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE,

                                              UNIQUE KEY uk_branch_dropzone_code (branch_id, dropzone_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* [8] 단순 가격표 (Legacy) */
CREATE TABLE IF NOT EXISTS PRICE (
                                     price_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     car_spec_id BIGINT NOT NULL,

    -- DECIMAL(전체자리수, 소수점자리수)
    -- 예: (15, 0) -> 999조 9999억... 까지 저장 가능 (소수점 없음)
                                     daily_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
                                     monthly_price DECIMAL(15, 2) DEFAULT 0,

-- 기본 조회 조건: use_yn='Y'
                                     use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',   -- [추가]
                                     deleted_at DATETIME NULL COMMENT '삭제 처리 일시',              -- [추가]
                                     version INT NOT NULL DEFAULT 0 COMMENT '낙관적 락 버전',


                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     FOREIGN KEY (car_spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==================================================
   2. 핵심 비즈니스 테이블 (Inventory & Reservation)
   ================================================== */

/* [9] 차량 실재고 (Inventory) */
CREATE TABLE IF NOT EXISTS VEHICLE_INVENTORY (
                                                 vehicle_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '차량 ID',
                                                 spec_id BIGINT NOT NULL COMMENT '모델 ID (FK)',
                                                 branch_id BIGINT NOT NULL COMMENT '위치 지점 ID (FK)',

                                                 vehicle_no VARCHAR(30) NOT NULL COMMENT '차량번호',
                                                 vin VARCHAR(50) NULL UNIQUE COMMENT '차대번호',

                                                 model_year SMALLINT NULL COMMENT '실차 연식',

                                                 operational_status ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE')
                                                     NOT NULL DEFAULT 'AVAILABLE'
                                                     COMMENT '현재 운영 상태',
                                                 mileage INT NULL COMMENT '주행거리',
                                                 last_inspected_at DATETIME NULL,
                                                 mileage_km INT NOT NULL DEFAULT 0 COMMENT '현재 누적 주행거리',
                                                 lifecycle_limit_km INT NOT NULL DEFAULT 350000 COMMENT '차량별 운행 한계 거리(법적/관리적 운행 제한 거리 (예: 35만km))',
                                                 is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- 기본 조회 조건: use_yn='Y'
                                                 use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',   -- [추가]
                                                 deleted_at DATETIME NULL COMMENT '삭제 처리 일시',              -- [추가]


                                                 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                                 UNIQUE KEY uk_vehicle_no (vehicle_no),
                                                 CONSTRAINT fk_vehicle_spec FOREIGN KEY (spec_id) REFERENCES CAR_SPEC(spec_id),
                                                 CONSTRAINT fk_vehicle_branch FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* [10] 차량 상태 이력 */
CREATE TABLE IF NOT EXISTS VEHICLE_STATUS_HISTORY (
                                                      history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                      vehicle_id BIGINT NOT NULL,
                                                      branch_id BIGINT NOT NULL,
                                                      status_prev ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE') NULL,
                                                      status_curr ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE') NOT NULL,
    -- [변경] 이름에 _km 명시 + COMMENT 추가
                                                      mileage_km INT NULL COMMENT '누적 주행거리 (단위: km)',

                                                      fuel_level INT NULL COMMENT '연료량 (단위: %)', -- 이것도 %인지 리터인지 헷갈리니 코멘트 추가 추천

                                                      comments TEXT NULL,
                                                      photo_url VARCHAR(255) NULL,
                                                      manager_id VARCHAR(50) NULL,
                                                      recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                                      CONSTRAINT fk_vsh_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id) ON DELETE CASCADE,
                                                      CONSTRAINT fk_vsh_branch FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* [11] 예약 (RESERVATION) */
CREATE TABLE IF NOT EXISTS RESERVATION (
                                           reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 ID',
                                           reservation_no VARCHAR(50) NOT NULL COMMENT '예약번호(Unique)',

    /* WHO */
                                           user_id BIGINT  NULL COMMENT '회원 ID(FK)',
                                           vehicle_id BIGINT NOT NULL COMMENT '차량 ID (FK)',

    /* DRIVER */
                                           driver_last_name VARCHAR(30) NOT NULL COMMENT '운전자 성(Last name)',
                                           driver_first_name VARCHAR(30) NOT NULL COMMENT '운전자 이름(First name)',
                                           driver_birthdate DATE NOT NULL COMMENT '생년월일',
                                           driver_phone VARCHAR(20) NOT NULL COMMENT '연락처',
                                           driver_email VARCHAR(100) NULL COMMENT '운전자 이메일',
                                           driver_license_no VARCHAR(30) NULL COMMENT '면허번호',
#                                            driver_license_expiry DATE NULL COMMENT '면허만료일',
#                                            driver_verified_yn CHAR(1) NOT NULL DEFAULT 'N',

    /* WHEN */                             nonMember_password VARCHAR(20) NULL COMMENT '비회원 예약 확인용 비밀번호',
                                           start_date DATETIME NOT NULL COMMENT '대여시작',
                                           end_date DATETIME NOT NULL COMMENT '반납예정',
                                           actual_return_date DATETIME NULL COMMENT '실반납일시',

    /* WHERE */
                                           pickup_type ENUM('VISIT','DELIVERY') NOT NULL DEFAULT 'VISIT',
                                           pickup_branch_id BIGINT NOT NULL COMMENT '인수지점(FK)',
                                           pickup_address VARCHAR(255) NULL COMMENT '배달주소',

                                           return_type ENUM('VISIT','COLLECTION') NOT NULL DEFAULT 'VISIT',
                                           return_branch_id BIGINT NOT NULL COMMENT '반납지점(FK)',
                                           return_address VARCHAR(255) NULL COMMENT '수거주소',

    /* WHAT & HOW MUCH (SNAPSHOTS) */
                                           insurance_id BIGINT NOT NULL COMMENT '보험 ID (FK)',
                                           coupon_id BIGINT NULL COMMENT '사용 쿠폰 ID (FK)',

    /* 1. 기본 대여료 */
                                           base_rent_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '원 대여료',
                                           rent_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '기본 할인액',

/* 2. 보험료 */
                                           base_insurance_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '원 보험료',
                                           insurance_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '보험 할인액',

/* 3. 옵션 요금 */
                                           option_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '옵션 요금 합계(스냅샷)',

/* 4. 쿠폰 할인액 */
                                           coupon_discount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '쿠폰 할인 금액(스냅샷)',

/* 5. 기타 할인 */
                                           member_discount_rate_snapshot DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '회원 할인율(%)',
                                           event_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '이벤트 할인 금액',

/* 6. 최종 결제액 */
                                           total_amount_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 결제 금액',

/* 7. 실제 적용된 요금 (분석용) */
                                           applied_rent_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 적용 대여료',
                                           applied_insurance_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 적용 보험료',

                                           agreement_yn CHAR(1) NOT NULL DEFAULT 'Y',
    /* STATUS */
    /* ✅ 상태 확장 */
    -- 예약 진행 상태 (예약의 라이프사이클)
                                           reservation_status ENUM(
                                               'PENDING',           -- 예약 생성 직후 상태 (결제 전 / 임시 저장 단계)
                                               'CONFIRMED',         -- 결제 완료로 예약 확정 (차량이 예약됨)
                                               'ACTIVE',            -- 대여 시작됨 (차량 인도 완료, 이용 중)
                                               'COMPLETED',         -- 반납 완료 및 예약 종료
                                               'CANCELED',          -- 예약 취소됨 (결제 전/후 모두 가능)
                                               'TERMINATED_FAULT',   -- 업체 과실(차량 고장 등)로 인한 중도 종료
                                               'CHANGED'            -- 예약 변경 완료 상태
                                               ) NOT NULL DEFAULT 'PENDING',

                                           cancel_reason VARCHAR(255) NULL,  -- 예약 취소 사유 (고객 변심, 일정 변경 등)
                                           cancelled_at DATETIME NULL ,       -- 예약 취소 일시

                                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                           UNIQUE KEY uk_reservation_no (reservation_no),
                                           INDEX idx_res_vehicle_period (vehicle_id, reservation_status, start_date, end_date),
    /* ✅ [추가] Users 테이블과 외래키 연결 */
                                           CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES USERS(user_id),

                                           CONSTRAINT fk_res_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id),
                                           CONSTRAINT fk_res_pickup FOREIGN KEY (pickup_branch_id) REFERENCES BRANCH(branch_id),
                                           CONSTRAINT fk_res_return FOREIGN KEY (return_branch_id) REFERENCES BRANCH(branch_id),
                                           CONSTRAINT fk_res_insurance FOREIGN KEY (insurance_id) REFERENCES INSURANCE(insurance_id),
                                           CONSTRAINT fk_res_coupon FOREIGN KEY (coupon_id) REFERENCES COUPON(coupon_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS RESERVATION_STATUS_HISTORY (
                                                          history_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이력 ID',
                                                          reservation_id BIGINT NOT NULL COMMENT '예약 ID (FK)',

    /* ✅ prev/curr */
                                                          status_prev ENUM(
                                                              'PENDING',           -- 예약 생성 직후 상태 (결제 전 / 임시 저장 단계)
                                                              'CONFIRMED',         -- 결제 완료로 예약 확정 (차량이 예약됨)
                                                              'ACTIVE',            -- 대여 시작됨 (차량 인도 완료, 이용 중)
                                                              'COMPLETED',         -- 반납 완료 및 예약 종료
                                                              'CANCELED',          -- 예약 취소됨 (결제 전/후 모두 가능)
                                                              'TERMINATED_FAULT',
                                                              'CHANGED'            -- 예약 변경 완료 상태
                                                              ) NULL COMMENT '변경 전 상태',

                                                          status_curr ENUM(
                                                              'PENDING',           -- 예약 생성 직후 상태 (결제 전 / 임시 저장 단계)
                                                              'CONFIRMED',         -- 결제 완료로 예약 확정 (차량이 예약됨)
                                                              'ACTIVE',            -- 대여 시작됨 (차량 인도 완료, 이용 중)
                                                              'COMPLETED',         -- 반납 완료 및 예약 종료
                                                              'CANCELED',          -- 예약 취소됨 (결제 전/후 모두 가능)
                                                              'TERMINATED_FAULT',
                                                              'CHANGED'            -- 예약 변경 완료 상태
                                                              ) NOT NULL COMMENT '변경 후 상태',

                                                          actor_type ENUM(
                                                              'USER',    -- 고객 직접 변경 (취소, 변경 요청)
                                                              'ADMIN',   -- 관리자 수동 변경 (강제 처리)
                                                              'SYSTEM'   -- 시스템 자동 변경 (시간/정책 기반)
                                                              ) NOT NULL DEFAULT 'SYSTEM' comment '변경 주체',

                                                          actor_id VARCHAR(50) NULL COMMENT '변경자 식별자',

    /* 변경/취소 메모 */
                                                          reason VARCHAR(255) NULL COMMENT '사유(취소/변경 메모)',

                                                          recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '기록 일시',

                                                          INDEX idx_rsh_lookup (reservation_id, recorded_at),
                                                          INDEX idx_rsh_status_time (status_curr, recorded_at),

                                                          CONSTRAINT fk_rsh_reservation
                                                              FOREIGN KEY (reservation_id)
                                                                  REFERENCES RESERVATION(reservation_id)
                                                                  ON UPDATE CASCADE
                                                                  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 패널티 정책 마스터 (정체성만)
CREATE TABLE IF NOT EXISTS PENALTY_POLICY (
                                              penalty_policy_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '패널티 정책 ID',

                                              penalty_code VARCHAR(30) NOT NULL COMMENT '패널티 코드(SMOKING, LATE_RETURN, MISFUELING 등)',
                                              penalty_name VARCHAR(100) NOT NULL COMMENT '정책명',

                                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                              UNIQUE KEY uk_penalty_policy_code (penalty_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
# 패널티 정책 버전 (금액/기간 이력)
CREATE TABLE IF NOT EXISTS PENALTY_POLICY_VERSION (
                                                      policy_version_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '패널티 정책 버전 ID',

                                                      penalty_policy_id BIGINT NOT NULL COMMENT '패널티 정책 ID(FK)',

                                                      amount DECIMAL(12,2) NOT NULL COMMENT '부과 금액',
                                                      effective_from DATETIME NOT NULL COMMENT '적용 시작일',
                                                      effective_to DATETIME NULL COMMENT '적용 종료일',

                                                      is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 여부',

                                                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                                      INDEX idx_policy_version_active (penalty_policy_id, is_active),
                                                      CONSTRAINT fk_policy_version_policy
                                                          FOREIGN KEY (penalty_policy_id)
                                                              REFERENCES PENALTY_POLICY(penalty_policy_id)
                                                              ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


# 패널티 부과 (실제 사건, 최소)
CREATE TABLE IF NOT EXISTS PENALTY_CHARGE (
                                              penalty_charge_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '패널티 부과 ID',

                                              reservation_id BIGINT NOT NULL COMMENT '예약 ID(FK)',
                                              policy_version_id BIGINT NOT NULL COMMENT '적용된 정책 버전 ID(FK)',

                                              amount_snapshot DECIMAL(12,2) NOT NULL COMMENT '부과 금액 스냅샷',

                                              status ENUM('CHARGED','WAIVED') NOT NULL DEFAULT 'CHARGED' COMMENT '부과 상태',

                                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                              INDEX idx_penalty_charge_reservation (reservation_id),
                                              CONSTRAINT fk_penalty_charge_reservation
                                                  FOREIGN KEY (reservation_id)
                                                      REFERENCES RESERVATION(reservation_id)
                                                      ON DELETE CASCADE,

                                              CONSTRAINT fk_penalty_charge_policy_version
                                                  FOREIGN KEY (policy_version_id)
                                                      REFERENCES PENALTY_POLICY_VERSION(policy_version_id)
                                                      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* ==================================================
   [확장] 예약 반납 연장 (RESERVATION_EXTENSION)
   - 목적:
     1) "실시간 반납 연장" 요청/승인/거절 기록을 분리 관리
     2) 연장 추가금(스냅샷)과 변경 종료일(before/after)을 명확히 남김
   - 설계 원칙:
     - 예약(RESERVATION) 자체는 단일 진실(source of truth)로 유지
     - 연장 이벤트는 별도 테이블에 누적(이력/감사/분쟁 대비)
     - MVP 기준: 자동 승인(즉시 APPROVED)도 지원하되, 상태값으로 확장 가능
   ================================================== */

CREATE TABLE IF NOT EXISTS RESERVATION_EXTENSION (
                                                     extension_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '연장 ID',

                                                     reservation_id BIGINT NOT NULL COMMENT '예약 ID(FK)',
                                                     vehicle_id BIGINT NOT NULL COMMENT '차량 ID(FK) - 조회/검증 편의용(예약에서 가져오되 스냅샷으로 보관)',

    /* 요청/승인 기간 */
                                                     requested_end_date DATETIME NOT NULL COMMENT '연장 요청 종료일',
                                                     approved_end_date DATETIME NULL COMMENT '승인(확정) 종료일(거절/취소 시 NULL 가능)',

    /* 금액 스냅샷(추가 발생분) */
                                                     additional_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '연장으로 인해 추가된 금액(스냅샷)',
                                                     additional_rent_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 대여료(스냅샷)',
                                                     additional_insurance_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 보험료(스냅샷)',
                                                     additional_option_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 옵션료(스냅샷)',
                                                     additional_discount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '연장에 적용된 추가 할인액(스냅샷, 있으면 +)',

    /* 처리 상태 */
                                                     status ENUM('REQUESTED','APPROVED','REJECTED','CANCELED')
                                                         NOT NULL DEFAULT 'REQUESTED'
                                                         COMMENT '연장 처리 상태',

    /* 처리 주체/사유 */
                                                     actor_type ENUM('USER','ADMIN','SYSTEM')
                                                         NOT NULL DEFAULT 'USER'
                                                         COMMENT '요청/처리 주체',
                                                     actor_id VARCHAR(50) NULL COMMENT '처리자 식별자(관리자/시스템 등)',

                                                     reason VARCHAR(255) NULL COMMENT '사유(거절/취소/특이사항 메모)',

    /* 타임스탬프 */
                                                     requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '요청 일시',
                                                     decided_at DATETIME NULL COMMENT '승인/거절/취소 확정 일시',

    /* 기본 조회 조건: use_yn='Y' */
                                                     use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
                                                     deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

                                                     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    /* 조회/검증용 인덱스 */
                                                     INDEX idx_ext_reservation_time (reservation_id, requested_at),
                                                     INDEX idx_ext_status_time (status, requested_at),
                                                     INDEX idx_ext_vehicle_time (vehicle_id, requested_end_date),

    /* 제약 */
                                                     CONSTRAINT fk_ext_reservation
                                                         FOREIGN KEY (reservation_id) REFERENCES RESERVATION(reservation_id)
                                                             ON DELETE CASCADE,

                                                     CONSTRAINT fk_ext_vehicle
                                                         FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id)
                                                             ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
                                         `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '리뷰 고유 ID',
                                         `reservation_id` bigint(20) NOT NULL COMMENT '예약 ID (1:1 매핑)',
                                         `user_id` bigint(20) NOT NULL COMMENT '작성자 ID',
                                         `spec_id` bigint(20) DEFAULT NULL COMMENT '차량 스펙 ID (CAR_SPEC 참조)',
                                         `car_name` varchar(100) NOT NULL COMMENT '리뷰 작성 당시 차종명 (스냅샷)',
                                         `rating` decimal(3,2) NOT NULL COMMENT '별점 0.5~5.0',
                                         `content` text NOT NULL COMMENT '리뷰 내용',
                                         `period` varchar(50) NOT NULL COMMENT '대여 기간 (YYYY.MM.DD ~ YYYY.MM.DD)',
                                         `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '작성일',
                                         `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일',
                                         PRIMARY KEY (`id`),
                                         UNIQUE KEY `reservation_id` (`reservation_id`),
                                         KEY `idx_user_reviews` (`user_id`),
                                         KEY `idx_spec_reviews` (`spec_id`),
                                         KEY `idx_reservation` (`reservation_id`),
                                         CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
                                         CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`spec_id`) REFERENCES `car_spec` (`spec_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='차량 이용 후기';


/* [확장] 성수기/비수기 기간 관리 (지점 단위 포함) */
CREATE TABLE IF NOT EXISTS SEASON_PERIOD (
                                             season_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '시즌 기간 ID',

                                             season_type ENUM('OFF','PEAK','SHOULDER') NOT NULL COMMENT '시즌 타입(비수기/성수기/준성수기)',
                                             name VARCHAR(100) NOT NULL COMMENT '시즌명(예: 2026 여름 성수기)',

                                             start_at DATE NOT NULL COMMENT '시작일',
                                             end_at DATE NOT NULL COMMENT '종료일',

                                             branch_id BIGINT NULL COMMENT '적용 지점(NULL=전체 적용)',
                                             min_rental_days INT NOT NULL DEFAULT 1 COMMENT '최소 대여일(예약 제약)',

                                             is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                             INDEX idx_season_period (is_active, start_at, end_at),
                                             INDEX idx_season_branch (branch_id, is_active),

                                             CONSTRAINT fk_season_branch
                                                 FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==================================================
   (선택) "연장 1회만 허용"을 DB 레벨에서 강제하고 싶다면
   - 아래 UNIQUE는 'APPROVED'만 대상으로 걸 수 없어서(부분 인덱스 불가)
     실무에선 보통 서비스 로직에서 제어합니다.
   - 그래도 MVP에서 강제하고 싶으면 아래처럼 "active_yn" 컬럼을 두고
     active_yn='Y' 한 건만 유지하는 방식으로 운영할 수 있습니다.
   ==================================================
-- ALTER TABLE RESERVATION_EXTENSION
--     ADD COLUMN active_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '현재 유효 연장 여부(Y/N)';
-- CREATE UNIQUE INDEX uk_ext_one_active_per_res
--     ON RESERVATION_EXTENSION (reservation_id, active_yn);
*/

/* ==================================================
   (선택) 초기 테스트 데이터 예시
   - reservation_id/vehicle_id는 실제 존재하는 값으로 바꿔서 사용하세요.
   ================================================== */
-- INSERT INTO RESERVATION_EXTENSION
-- (reservation_id, vehicle_id, requested_end_date, approved_end_date,
--  additional_amount_snapshot, additional_rent_fee_snapshot, additional_insurance_fee_snapshot,
--  additional_option_fee_snapshot, additional_discount_snapshot,
--  status, actor_type, actor_id, reason, requested_at, decided_at)
-- VALUES
-- (1, 1, '2026-02-10 10:00:00', '2026-02-10 10:00:00',
--  30000.00, 25000.00, 5000.00,
--  0.00, 0.00,
--  'APPROVED', 'SYSTEM', 'SYSTEM', '자동 승인', NOW(), NOW());


# /* 회원 등급(정책) */
# CREATE TABLE IF NOT EXISTS MEMBER_GRADE (

#                                             grade_code VARCHAR(20) PRIMARY KEY COMMENT '등급 코드 (BASIC/VIP)',

#                                             grade_name VARCHAR(50) NOT NULL COMMENT '등급명',
#                                             discount_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '할인율(%) 예: 5.00',
#                                             is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',
#                                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
#                                             updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
# )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 1;

