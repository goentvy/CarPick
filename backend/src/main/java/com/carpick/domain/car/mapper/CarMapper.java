package com.carpick.domain.car.mapper;

import java.util.List;

import com.carpick.domain.car.dto.CarListDto;
import com.carpick.domain.car.dto.raw.CarDetailRawDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;



@Mapper
public interface CarMapper {

//	@Select("SELECT * FROM cars ORDER BY car_id DESC")
//    List<CarDetailDto> getCarList();

    // 목록 조회 (XML id="selectCarList"와 이름 일치)
    List<CarListDto> selectCarList();

//    CarDetailDto selectCarDetail(@Param("vehicleId") Long vehicleId);
    // ★ [추가] 상세 페이지용 단건 조회
    // 파라미터는 차량 ID (vehicleId) 하나만 받으면 됩니다.
CarDetailRawDto selectCarDetail(@Param("specId") Long vehicleId);

}
