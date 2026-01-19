package com.carpick.domain.insurance.mapper;

import com.carpick.domain.insurance.dto.raw.InsuranceRawDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InsuranceMapper {
    // 활성화된 보험 옵션 전체 조회(나중에 보험 mapper로 이동 가능)
    List<InsuranceRawDto> selectInsuranceOptionsV2 ();
    // 보험 코드로 단건 조회 (가격 계산용)(나중에 보험 mapper로 이동 가능)
    InsuranceRawDto selectInsuranceByCodeV2 (@Param("insuranceCode") String insuranceCode);
}
