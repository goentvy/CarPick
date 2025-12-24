package com.carpick.domain.reservation.mapper;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationMapper {
    // 활성화된 보험 옵션 전체 조회
    List<InsuranceRawDto> selectInsuranceOptions ();
    // 보험 코드로 단건 조회 (가격 계산용)
    InsuranceRawDto selectInsuranceByCode (@Param("code") String code);

}
