package com.carpick.admin.branchAdmin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class AdminBranchDto {

    // 1️⃣ [식별자] 수정/삭제 기준
    private Long branchId;

    // 2️⃣ [기본 정보] 인라인 편집 대상
    private String branchCode;         // 지점 코드 (업무용)
    private String branchName;         // 지점명

    private String addressBasic;       // 기본 주소
    private String addressDetail;      // 상세 주소
    private String phone;              // 지점 전화번호
    // ✅ [Tip] JSON으로 나갈 때 "09:00" 형식으로 고정 (프론트가 편함)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm", timezone = "Asia/Seoul")
    private LocalTime openTime;        // 오픈 시간
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm", timezone = "Asia/Seoul")
    private LocalTime closeTime;       // 마감 시간
    private String businessHours;      // 영업시간 텍스트

    private BigDecimal latitude;       // 위도
    private BigDecimal longitude;      // 경도
    private String regionDept1;        // 지역(서울/경기 등)



    // 4️⃣ [운영용] - 소프트 삭제 플래그
    private String useYn;             // 논리 삭제 여부(Y/N)
    private LocalDateTime deletedAt;
    // 5️⃣ [정보용] - 리스트/상세에서 보여줄 메타데이터
    // ✅ [Tip] 날짜도 포맷팅해주면 관리자 화면에 예쁘게 나옴
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

}
