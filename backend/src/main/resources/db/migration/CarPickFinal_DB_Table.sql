/* =========================================================
   AllInOne Rentcar Schema (MariaDB Compatible) - FINAL VERSION
   - Update: 2025-12-22 (Coupon & Option Price Added)
   - created_at/updated_at: CURRENT_TIMESTAMP
   - Fix: create order for FK integrity (BRANCH before PRICE_POLICY)
   ========================================================= */

USE carpick;

SET FOREIGN_KEY_CHECKS = 0;

/* ==================================================
   DROP ORDER (FK 역순 정리)
   - 컬럼/테이블명 변경 없음
   ================================================== */

/* 1. 할인/가격 상세 & 악성 재고 */
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS RESERVATION_DISCOUNT_HISTORY;
DROP TABLE IF EXISTS DISCOUNT_POLICY;
DROP TABLE IF EXISTS SLOW_MOVING_INVENTORY;
DROP TABLE IF EXISTS reservation_price_detail;

/* 2. 리뷰 / 이벤트 */
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS `event`;

/* 3. 예약 확장 / 패널티 */
DROP TABLE IF EXISTS RESERVATION_EXTENSION;
DROP TABLE IF EXISTS PENALTY_CHARGE;
DROP TABLE IF EXISTS PENALTY_POLICY_VERSION;
DROP TABLE IF EXISTS PENALTY_POLICY;

/* 4. 예약 상태 이력 */
DROP TABLE IF EXISTS RESERVATION_STATUS_HISTORY;

/* 5. 핵심 예약 */
DROP TABLE IF EXISTS RESERVATION;

/* 6. 차량 상태 이력 */
DROP TABLE IF EXISTS VEHICLE_STATUS_HISTORY;

/* 7. 시즌 / 드롭존 */
DROP TABLE IF EXISTS SEASON_PERIOD;
DROP TABLE IF EXISTS DROPZONE_POINT;

/* 8. 가격 / 정책 */
DROP TABLE IF EXISTS PRICE;
DROP TABLE IF EXISTS PRICE_POLICY;

/* 9. 옵션 / 보험 / 쿠폰 */
DROP TABLE IF EXISTS CAR_OPTION;
DROP TABLE IF EXISTS INSURANCE;
DROP TABLE IF EXISTS COUPON;

/* 10. 차량 인벤토리 */
DROP TABLE IF EXISTS VEHICLE_INVENTORY;

/* 11. 지점 */
DROP TABLE IF EXISTS BRANCH;

/* 12. 차량 스펙 */
DROP TABLE IF EXISTS CAR_SPEC;

SET FOREIGN_KEY_CHECKS = 1;


/* ==================================================
   1. 기초 정보 테이블 (Master Data)
   ================================================== */
CREATE TABLE users (
                       user_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 PK',

    -- 로그인 식별
                       email VARCHAR(255) NOT NULL UNIQUE COMMENT '이메일(로그인 ID)',
                       password VARCHAR(255) NULL COMMENT '로컬 비밀번호(소셜 로그인 NULL 가능)',

    -- 소셜 계정
                       provider ENUM('LOCAL','KAKAO','NAVER') NOT NULL DEFAULT 'LOCAL' COMMENT '가입 경로',
                       provider_id VARCHAR(255) NULL COMMENT '소셜 provider 고유 식별자',
                       UNIQUE KEY uk_provider_provider_id (provider, provider_id),

    -- 개인정보(선택)
                       name VARCHAR(50) NULL COMMENT '이름',
                       phone VARCHAR(20) NULL COMMENT '전화번호',
                       birth DATE NULL COMMENT '생년월일',
                       gender VARCHAR(10) NULL COMMENT '성별(M/F 등)',

    -- 정책/등급/권한
                       marketing_agree TINYINT(1) NOT NULL DEFAULT 0 COMMENT '마케팅 수신 동의(0/1)',
                       membership_grade ENUM('BASIC','VIP') NOT NULL DEFAULT 'BASIC' COMMENT '회원 등급',
                       role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER' COMMENT '권한',

    -- 토큰(권장: 실서비스는 별도 테이블/리프레시 토큰 분리 추천, 일단 유지)
                       accesstoken VARCHAR(500) NULL COMMENT '액세스 토큰(임시 저장용)',

                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
                       deleted_at DATETIME NULL COMMENT '삭제일(소프트 삭제)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 테이블 carpick.admin_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `admin_user` (
                                            `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                            `password` varchar(255) NOT NULL,
                                            `username` varchar(255) NOT NULL,
                                            PRIMARY KEY (`id`),
                                            UNIQUE KEY `UKlvod9bfm438ex1071ku1glb70` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
                                user_id BIGINT PRIMARY KEY,
                                token VARCHAR(500) NOT NULL
);

-- 테이블 데이터 carpick.admin_user:~0 rows (대략적) 내보내기
DELETE FROM `admin_user`;
INSERT INTO `admin_user` (`id`, `password`, `username`) VALUES
    (1, '1234', 'admin');

CREATE TABLE IF NOT EXISTS CAR_SPEC (
                                        spec_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '모델 고유 ID',

                                        brand VARCHAR(50) NOT NULL COMMENT '브랜드 (현대, 기아 등)',

    model_name VARCHAR(150) NOT NULL COMMENT '모델명(상세용 Full name)',

    car_color ENUM('WHITE','BLACK','RED','BLUE','SILVER') NOT NULL COMMENT '상세/카드 대표 색상(군청 포함 BLUE)',

    display_name_short VARCHAR(60) NULL COMMENT '카드용 짧은 모델명(소렌토/캐스퍼 등)',

    car_class ENUM('LIGHT','SMALL','COMPACT','MID','LARGE','IMPORT','RV','SUV')
    NOT NULL COMMENT '차량 등급',
    model_year_base SMALLINT NOT NULL COMMENT '대표 연식',

    ai_summary TEXT COMMENT 'ai 추천문구 관리자 페이지에서 관리',

    fuel_type ENUM('GASOLINE','DIESEL','LPG','ELECTRIC','HYBRID','HYDROGEN')
    NOT NULL COMMENT '연료 타입',
    transmission_type VARCHAR(20) NOT NULL DEFAULT 'AUTO' COMMENT '변속기',
    is_four_wheel_drive BOOLEAN NOT NULL DEFAULT FALSE
    COMMENT '사륜구동 여부 (TRUE=4WD/AWD)',

    car_options VARCHAR(500) NULL COMMENT '차량 고유 옵션(예: 네비게이션, 썬루프, 통풍시트, 블루투스) - 콤마 구분',

    min_driver_age TINYINT NOT NULL DEFAULT 21 COMMENT '대여 가능 최저 연령',
    min_license_years TINYINT NOT NULL DEFAULT 1 COMMENT '최저 면허 경력 년수',

    seating_capacity INT NOT NULL COMMENT '승차 정원',
    trunk_capacity VARCHAR(50) NULL COMMENT '적재 공간 설명',
    fuel_efficiency VARCHAR(50) NULL COMMENT '연비',

    main_video_url VARCHAR(255) NULL COMMENT '대표 차량 스핀 비디오',
    img_url VARCHAR(500) NULL COMMENT '추가 이미지',
    ai_keywords VARCHAR(500) NULL COMMENT 'AI 검색 태그',

    drive_labels VARCHAR(200) NULL COMMENT '카드 라벨(예: 가솔린, 경차, 도심주행) - CSV or JSON string',

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_car_spec (brand, model_name, model_year_base)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


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

    can_manage_inventory_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_manage_vehicle_status_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_pickup_return_yn CHAR(1) NOT NULL DEFAULT 'Y',
    can_delivery_yn CHAR(1) NOT NULL DEFAULT 'N',
    delivery_radius_km INT NULL COMMENT '딜리버리 반경(km)',

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_branch_code (branch_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS CAR_OPTION (
                                          option_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '옵션 ID',

                                          option_name VARCHAR(100) NOT NULL COMMENT '옵션명(카시트, 네비 등 추가 가능한 옵션)',
    option_description TEXT NULL COMMENT '옵션 설명',

    option_daily_price INT NOT NULL DEFAULT 0 COMMENT '옵션 1일 대여료(0이면 무료)',

    is_highlight BOOLEAN NOT NULL DEFAULT FALSE COMMENT '주요 옵션 노출 여부',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    use_yn CHAR(1) DEFAULT 'Y' COMMENT '삭제여부(Y:사용, N:삭제)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    UNIQUE KEY uk_car_option (option_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==============================
   * 가격 표시 정책 (관리자 제어용)
   * - 실제 결제 금액에는 영향 없음
   * - 소비자 노출용 정가/할인가 표현을 위한 정책 테이블
   * ============================== */

CREATE TABLE IF NOT EXISTS PRICE_POLICY (
    /* ==============================
     * 가격 표시 정책 (관리자 제어용)
     * - 실제 결제 금액에는 영향 없음
     * - 소비자 노출용 정가/할인가 표현을 위한 정책 테이블
     * ============================== */

                                            price_policy_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '가격 정책 ID (PK)',

    /* ===== 적용 대상 ===== */

                                            spec_id BIGINT NULL COMMENT
                                                '차종 ID (NULL이면 지점 전체 적용, 값이 있으면 특정 차종 개별 적용)',

                                            branch_id BIGINT NOT NULL COMMENT
                                                '지점 ID (지점별 가격 표시 정책만 지원)',

                                            price_type ENUM('DAILY', 'MONTHLY') NOT NULL COMMENT
                                                '가격 단위 (단기: DAILY, 장기: MONTHLY)',

    /* ===== 가격 표시 정보 ===== */

                                            base_price DECIMAL(15, 2) NULL DEFAULT 0 COMMENT
                                                '정가(할인 전 기준 금액, 표시용)',

                                            discount_rate TINYINT NOT NULL DEFAULT 0 COMMENT
                                                '표시용 기본 할인율 (0~100%, 실제 결제 금액에는 미반영)',

    /* ===== 정책 유효 기간 ===== */

                                            valid_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT
                                                '정책 적용 시작 일시',

                                            valid_to DATETIME NULL COMMENT
                                                '정책 적용 종료 일시 (NULL이면 종료 없음)',

    /* ===== 정책 상태 관리 ===== */

                                            is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT
                                                '현재 활성화 여부 (운영 중 적용되는 정책인지 여부)',

                                            use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT
                                                '사용 여부 (Y/N, 관리자 논리적 비활성화용)',

                                            deleted_at DATETIME NULL COMMENT
                                                '논리 삭제 일시 (NULL이면 미삭제)',

    /* ===== 공통 관리 컬럼 ===== */

                                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT
                                                '정책 생성 일시',

                                            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                ON UPDATE CURRENT_TIMESTAMP COMMENT
                                                '정책 수정 일시',

    /* ===== 조회 최적화 인덱스 ===== */

                                            INDEX idx_price_policy_lookup (
                                                                           spec_id,
                                                                           branch_id,
                                                                           price_type,
                                                                           is_active,
                                                                           use_yn,
                                                                           valid_from
                                                ),

    /* ===== 외래 키 제약 ===== */

                                            CONSTRAINT fk_price_policy_spec
                                                FOREIGN KEY (spec_id)
                                                    REFERENCES CAR_SPEC(spec_id)
                                                    ON DELETE CASCADE,

                                            CONSTRAINT fk_price_policy_branch
                                                FOREIGN KEY (branch_id)
                                                    REFERENCES BRANCH(branch_id)
                                                    ON DELETE CASCADE,

    /* ===== 데이터 무결성 ===== */

                                            CONSTRAINT chk_discount_rate
                                                CHECK (discount_rate BETWEEN 0 AND 100)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
    COMMENT='관리자 제어용 가격 표시 정책 테이블 (결제 로직과 분리)';

CREATE TABLE IF NOT EXISTS INSURANCE (
                                         insurance_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '보험 옵션 ID',

                                         insurance_code ENUM('NONE','STANDARD','FULL')
    NOT NULL
    COMMENT '보험 코드',
    insurance_label VARCHAR(50) NOT NULL COMMENT '표시 이름 (선택안함 / 일반자차 / 완전자차)',
    summary_label VARCHAR(100) NULL COMMENT '요약 문구 (사고 시 고객부담금 면제 등)',

    extra_daily_price DECIMAL(15, 0) NOT NULL DEFAULT 0 COMMENT '1일 보험 추가요금',

    is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '기본 선택 여부',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '노출 순서',

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_insurance_code (insurance_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


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

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 여부',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_coupon_code (coupon_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS DROPZONE_POINT (
                                              dropzone_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '드롭존 고유 ID',
                                              branch_id BIGINT NOT NULL COMMENT '소속 대여 지점 ID (BRANCH)',

                                              dropzone_code VARCHAR(30) NOT NULL COMMENT '지점 내 드롭존 식별 코드 (ex: D1, D2)',
    dropzone_name VARCHAR(100) NOT NULL COMMENT '드롭존 표시 이름 (ex: 서울역 서부 주차장)',

    address_text VARCHAR(255) NULL COMMENT '드롭존 주소 텍스트',
    location_desc TEXT NULL COMMENT '상세 위치 설명 (ex: 지하 2층 A구역)',
    walking_time_min INT NULL COMMENT '지점 → 드롭존 도보 소요 시간(분)',

    latitude DECIMAL(10,8) NOT NULL COMMENT '위도',
    longitude DECIMAL(11,8) NOT NULL COMMENT '경도',

    service_hours VARCHAR(100) NULL COMMENT '운영 시간 안내 (ex: 24시간, 06:00~22:00)',

    is_active BOOLEAN NOT NULL DEFAULT 1 COMMENT '사용 가능 여부 (1: 활성, 0: 비활성)',
    deleted_at DATETIME NULL COMMENT '소프트 삭제 시점',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_dropzone_branch
    FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE,

    UNIQUE KEY uk_branch_dropzone_code (branch_id, dropzone_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS PRICE (
                                     price_id BIGINT AUTO_INCREMENT PRIMARY KEY
                                         COMMENT '가격 ID (PK) - 차종별 기본 요금 식별자',

                                    spec_id BIGINT NOT NULL
                                         COMMENT '차종 ID (FK) - CAR_SPEC 참조',

                                     daily_price DECIMAL(15, 2) NOT NULL DEFAULT 0
                                         COMMENT '단기 렌트 1일 기준 기본 요금(원가)',

                                     monthly_price DECIMAL(15, 2) NOT NULL DEFAULT 0
                                         COMMENT '장기 렌트 1개월 기준 기본 요금(원가)',

                                     use_yn CHAR(1) NOT NULL DEFAULT 'Y'
                                         COMMENT '사용 여부 (Y: 운영 중, N: 미사용/논리 삭제)',

                                     deleted_at DATETIME NULL
                                         COMMENT '삭제 처리 일시 (논리 삭제 시점 기록용)',

                                     version INT NOT NULL DEFAULT 0
                                         COMMENT '낙관적 락 버전 (동시 수정 방지용)',

                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                         COMMENT '가격 정보 최초 생성 일시',

                                     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                                         COMMENT '가격 정보 최종 수정 일시',

                                     CONSTRAINT fk_price_car_spec
                                         FOREIGN KEY (spec_id)
                                             REFERENCES CAR_SPEC(spec_id)
                                             ON DELETE CASCADE

)
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COMMENT='차종별 기본 렌트 요금 관리 테이블 (일단가/월단가 원가)';



/* ==================================================
   2. 핵심 비즈니스 테이블 (Inventory & Reservation)
   ================================================== */

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

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_vehicle_no (vehicle_no),
    CONSTRAINT fk_vehicle_spec FOREIGN KEY (spec_id) REFERENCES CAR_SPEC(spec_id),
    CONSTRAINT fk_vehicle_branch FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS VEHICLE_STATUS_HISTORY (
                                                      history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                      vehicle_id BIGINT NOT NULL,
                                                      branch_id BIGINT NOT NULL,
                                                      status_prev ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE') NULL,
    status_curr ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE') NOT NULL,

    mileage_km INT NULL COMMENT '누적 주행거리 (단위: km)',
    fuel_level INT NULL COMMENT '연료량 (단위: %)',

    comments TEXT NULL,
    photo_url VARCHAR(255) NULL,
    manager_id VARCHAR(50) NULL,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vsh_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id) ON DELETE CASCADE,
    CONSTRAINT fk_vsh_branch FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS RESERVATION (
                                           reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 ID',
                                           reservation_no VARCHAR(50) NOT NULL COMMENT '예약번호(Unique)',

    user_id BIGINT  NULL COMMENT '회원 ID(FK)',
    vehicle_id BIGINT NOT NULL COMMENT '차량 ID (FK)',

    driver_last_name VARCHAR(30) NOT NULL COMMENT '운전자 성(Last name)',
    driver_first_name VARCHAR(30) NOT NULL COMMENT '운전자 이름(First name)',
    driver_birthdate DATE NOT NULL COMMENT '생년월일',
    driver_phone VARCHAR(20) NOT NULL COMMENT '연락처',
    driver_email VARCHAR(100) NULL COMMENT '운전자 이메일',

    non_member_password VARCHAR(255) NULL COMMENT '비회원 예약 확인용 비밀번호',
    start_date DATETIME NOT NULL COMMENT '대여시작',
    end_date DATETIME NOT NULL COMMENT '반납예정',
    actual_return_date DATETIME NULL COMMENT '실반납일시',

    pickup_type ENUM('VISIT','DELIVERY') NOT NULL DEFAULT 'VISIT',
    pickup_branch_id BIGINT NOT NULL COMMENT '인수지점(FK)',
    pickup_address VARCHAR(255) NULL COMMENT '배달주소',

    return_type ENUM('VISIT','DROPZONE') NOT NULL DEFAULT 'VISIT',
    return_branch_id BIGINT  NULL  COMMENT '반납지점(FK) - 일반 지점 반납 시',
    return_address VARCHAR(255) NULL COMMENT '반납 주소(스냅샷)',
    return_dropzone_id BIGINT NULL COMMENT '반납드롭존(FK) - 드롭존 반납 시',

    insurance_id BIGINT NOT NULL COMMENT '보험 ID (FK)',
    coupon_id BIGINT NULL COMMENT '사용 쿠폰 ID (FK)',

    base_rent_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '원 대여료',
    rent_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '기본 할인액',

    base_insurance_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '원 보험료',
    insurance_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '보험 할인액',

    option_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '옵션 요금 합계(스냅샷)',

    coupon_discount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '쿠폰 할인 금액(스냅샷)',

    member_discount_rate_snapshot DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '회원 할인율(%)',
    event_discount_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '이벤트 할인 금액',

    total_amount_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 결제 금액',

    applied_rent_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 적용 대여료',
    applied_insurance_fee_snapshot DECIMAL(12,2) NOT NULL COMMENT '최종 적용 보험료',

    agreement_yn CHAR(1) NOT NULL DEFAULT 'Y',

    reservation_status ENUM(
                               'PENDING',
                               'CONFIRMED',
                               'ACTIVE',
                               'COMPLETED',
                               'CANCELED',
                               'TERMINATED_FAULT',
                               'CHANGED'
                           ) NOT NULL DEFAULT 'PENDING',

    cancel_reason VARCHAR(255) NULL,
    cancelled_at DATETIME NULL ,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_reservation_no (reservation_no),
    INDEX idx_res_vehicle_period (vehicle_id, reservation_status, start_date, end_date),

    CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_res_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id),

    CONSTRAINT fk_res_pickup_branch FOREIGN KEY (pickup_branch_id) REFERENCES BRANCH(branch_id),
    CONSTRAINT fk_res_return_branch FOREIGN KEY (return_branch_id) REFERENCES BRANCH(branch_id),
    CONSTRAINT fk_res_return_dropzone FOREIGN KEY (return_dropzone_id) REFERENCES DROPZONE_POINT(dropzone_id),

    CONSTRAINT fk_res_insurance FOREIGN KEY (insurance_id) REFERENCES INSURANCE(insurance_id),
    CONSTRAINT fk_res_coupon FOREIGN KEY (coupon_id) REFERENCES COUPON(coupon_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS RESERVATION_STATUS_HISTORY (
                                                          history_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이력 ID',
                                                          reservation_id BIGINT NOT NULL COMMENT '예약 ID (FK)',

                                                          status_prev ENUM(
                                                          'PENDING',
                                                          'CONFIRMED',
                                                          'ACTIVE',
                                                          'COMPLETED',
                                                          'CANCELED',
                                                          'TERMINATED_FAULT',
                                                          'CHANGED'
) NULL COMMENT '변경 전 상태',

    status_curr ENUM(
                        'PENDING',
                        'CONFIRMED',
                        'ACTIVE',
                        'COMPLETED',
                        'CANCELED',
                        'TERMINATED_FAULT',
                        'CHANGED'
                    ) NOT NULL COMMENT '변경 후 상태',

    actor_type ENUM('USER','ADMIN','SYSTEM')
    NOT NULL DEFAULT 'SYSTEM' comment '변경 주체',

    actor_id VARCHAR(50) NULL COMMENT '변경자 식별자',

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


/* ==================================================
   3. 패널티/연장
   ================================================== */

CREATE TABLE IF NOT EXISTS PENALTY_POLICY (
                                              penalty_policy_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '패널티 정책 ID',

                                              penalty_code VARCHAR(30) NOT NULL COMMENT '패널티 코드(SMOKING, LATE_RETURN, MISFUELING 등)',
    penalty_name VARCHAR(100) NOT NULL COMMENT '정책명',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_penalty_policy_code (penalty_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


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


CREATE TABLE IF NOT EXISTS RESERVATION_EXTENSION (
                                                     extension_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '연장 ID',

                                                     reservation_id BIGINT NOT NULL COMMENT '예약 ID(FK)',
                                                     vehicle_id BIGINT NOT NULL COMMENT '차량 ID(FK) - 조회/검증 편의용(예약에서 가져오되 스냅샷으로 보관)',

                                                     requested_end_date DATETIME NOT NULL COMMENT '연장 요청 종료일',
                                                     approved_end_date DATETIME NULL COMMENT '승인(확정) 종료일(거절/취소 시 NULL 가능)',

                                                     additional_amount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '연장으로 인해 추가된 금액(스냅샷)',
    additional_rent_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 대여료(스냅샷)',
    additional_insurance_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 보험료(스냅샷)',
    additional_option_fee_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '추가 옵션료(스냅샷)',
    additional_discount_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '연장에 적용된 추가 할인액(스냅샷, 있으면 +)',

    status ENUM('REQUESTED','APPROVED','REJECTED','CANCELED')
    NOT NULL DEFAULT 'REQUESTED'
    COMMENT '연장 처리 상태',

    actor_type ENUM('USER','ADMIN','SYSTEM')
    NOT NULL DEFAULT 'USER'
    COMMENT '요청/처리 주체',
    actor_id VARCHAR(50) NULL COMMENT '처리자 식별자(관리자/시스템 등)',

    reason VARCHAR(255) NULL COMMENT '사유(거절/취소/특이사항 메모)',

    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '요청 일시',
    decided_at DATETIME NULL COMMENT '승인/거절/취소 확정 일시',

    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부(Y/N)',
    deleted_at DATETIME NULL COMMENT '삭제 처리 일시',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_ext_reservation_time (reservation_id, requested_at),
    INDEX idx_ext_status_time (status, requested_at),
    INDEX idx_ext_vehicle_time (vehicle_id, requested_end_date),

    CONSTRAINT fk_ext_reservation
    FOREIGN KEY (reservation_id) REFERENCES RESERVATION(reservation_id)
                                                           ON DELETE CASCADE,

    CONSTRAINT fk_ext_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id)
                                                           ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==================================================
   4. 리뷰 / 이벤트
   ================================================== */



CREATE TABLE IF NOT EXISTS `event` (
                                       `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `content` text DEFAULT NULL,
    `startDate` varchar(50) DEFAULT NULL,
    `endDate` varchar(50) DEFAULT NULL,
    `thumbnail` varchar(255) DEFAULT NULL,
    `created_at` datetime DEFAULT current_timestamp(),
    `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


/* ==================================================
   5. 시즌/할인/악성재고
   ================================================== */

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


CREATE TABLE IF NOT EXISTS DISCOUNT_POLICY (
                                               discount_id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                               policy_name VARCHAR(100) NOT NULL COMMENT '정책명',
    description VARCHAR(255) NULL COMMENT '설명',

    discount_type ENUM('RATE', 'AMOUNT') NOT NULL DEFAULT 'RATE' COMMENT 'RATE(%), AMOUNT(원)',
    discount_value INT NOT NULL COMMENT '할인값',

    target_spec_id BIGINT NULL COMMENT '차종 ID (NULL=전체)',
    target_branch_id BIGINT NULL COMMENT '지점 ID (NULL=전체)',
    target_price_type ENUM('DAILY', 'MONTHLY') NULL COMMENT '가격 타입 (NULL=전체)',

    min_rental_days INT DEFAULT 0 COMMENT '최소 대여 일수',

    start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NULL,
    priority INT DEFAULT 0 COMMENT '우선순위 (높을수록 먼저)',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    use_yn CHAR(1) NOT NULL DEFAULT 'Y',
    deleted_at DATETIME NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_discount_lookup (start_date, end_date, is_active, use_yn),
    INDEX idx_discount_target (target_spec_id, target_branch_id, target_price_type),

    CONSTRAINT fk_discount_spec
    FOREIGN KEY (target_spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE,
    CONSTRAINT fk_discount_branch
    FOREIGN KEY (target_branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='추가 할인 정책';


CREATE TABLE IF NOT EXISTS RESERVATION_DISCOUNT_HISTORY (
                                                            history_id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                                            reservation_id BIGINT NOT NULL COMMENT '예약 ID',
                                                            discount_id BIGINT NULL COMMENT '할인 정책 ID',
                                                            coupon_id BIGINT NULL COMMENT '쿠폰 ID',

                                                            discount_type ENUM('RATE', 'AMOUNT') NOT NULL COMMENT '할인 타입',
    discount_value INT NOT NULL COMMENT '할인 값',
    discount_amount DECIMAL(15, 2) NOT NULL COMMENT '실제 할인 금액',

    discount_source ENUM('BASE', 'EVENT', 'COUPON', 'SLOW_MOVING') NOT NULL COMMENT '할인 출처',

    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '적용 일시',

    INDEX idx_history_reservation (reservation_id),
    INDEX idx_history_discount (discount_id),
    INDEX idx_history_coupon (coupon_id),

    CONSTRAINT fk_history_reservation
    FOREIGN KEY (reservation_id) REFERENCES RESERVATION(reservation_id),
    CONSTRAINT fk_history_discount
    FOREIGN KEY (discount_id) REFERENCES DISCOUNT_POLICY(discount_id),
    CONSTRAINT fk_history_coupon
    FOREIGN KEY (coupon_id) REFERENCES COUPON(coupon_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='예약별 할인 적용 이력';


CREATE TABLE IF NOT EXISTS SLOW_MOVING_INVENTORY (
                                                     slow_moving_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '악성재고 ID',
                                                     vehicle_id BIGINT NOT NULL COMMENT '대상 차량',

                                                     discount_rate TINYINT NOT NULL DEFAULT 0 COMMENT '할인율(0~100)',
                                                     reason VARCHAR(200) NULL COMMENT '지정 사유',

    designated_by BIGINT NULL COMMENT '지정한 관리자 ID',
    designated_at DATETIME NULL COMMENT '지정 일시',

    valid_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to DATETIME NULL COMMENT '종료일 (NULL=무기한)',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    use_yn CHAR(1) NOT NULL DEFAULT 'Y',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_slow_moving_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id),
    CONSTRAINT chk_slow_discount_rate CHECK (discount_rate BETWEEN 0 AND 100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='악성 재고 할인';


/* ==================================================
   6. 예약 가격 명세서
   ================================================== */

CREATE TABLE reservation_price_detail (
                                          reservation_price_detail_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 가격 명세서 ID (PK)',
                                          reservation_id BIGINT NOT NULL COMMENT '예약 ID (FK)',

                                          reservation_rent_fee DECIMAL(10, 0) NOT NULL COMMENT '예약 최종 대여료 (기간 * 단가 계산 결과)',
                                          reservation_insurance_fee DECIMAL(10, 0) NOT NULL COMMENT '예약 최종 보험료 (보험일수 * 보험료)',
                                          reservation_coupon_discount DECIMAL(10, 0) DEFAULT 0 COMMENT '예약에 적용된 쿠폰 할인 금액',
                                          reservation_total_amount DECIMAL(10, 0) NOT NULL COMMENT '예약 최종 결제 금액 (대여료 + 보험료 - 할인)',

                                          price_type VARCHAR(20) COMMENT '요금제 타입 (SHORT_TERM: 단기, LONG_TERM: 장기)',

                                          applied_daily_price DECIMAL(10, 0) DEFAULT 0 COMMENT '적용된 일 단위 기준 단가 (단기용)',
                                          applied_hourly_price DECIMAL(10, 0) DEFAULT 0 COMMENT '적용된 시간 단위 기준 단가 (단기용, 일 단가/24)',
                                          applied_monthly_price DECIMAL(10, 0) DEFAULT 0 COMMENT '적용된 월 단위 기준 단가 (장기용)',

                                          applied_days INT DEFAULT 0 COMMENT '적용된 대여 일수',
                                          applied_hours INT DEFAULT 0 COMMENT '적용된 대여 잔여 시간',
                                          applied_months INT DEFAULT 0 COMMENT '적용된 대여 개월 수',

                                          insurance_applied_days INT DEFAULT 0 COMMENT '보험료 산정 기준 일수 (시간은 올림 처리)',

                                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '명세서 생성 일시',

                                          CONSTRAINT uk_reservation_price_detail_reservation
                                              UNIQUE (reservation_id),

                                          CONSTRAINT fk_reservation_price_detail_reservation
                                              FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);

CREATE TABLE reviews (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '리뷰 고유 ID',

                         reservation_id BIGINT NOT NULL UNIQUE COMMENT '예약 ID (1:1 매핑)',
                         user_id BIGINT NOT NULL COMMENT '작성자 ID',
                         spec_id BIGINT NULL COMMENT '차량 스펙 ID (CAR_SPEC 참조)',

                         car_name VARCHAR(100) NOT NULL COMMENT '리뷰 작성 당시 차종명 (스냅샷)',

                         rating DECIMAL(3,2) NOT NULL COMMENT '별점 0.5~5.0',
                         content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '리뷰 내용',
                         period VARCHAR(50) NOT NULL COMMENT '대여 기간 (YYYY.MM.DD ~ YYYY.MM.DD)',

                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',

                         INDEX idx_user_reviews (user_id),
                         INDEX idx_spec_reviews (spec_id),
                         INDEX idx_reservation (reservation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='차량 이용 후기';

