package com.carpick.mapper;

import java.util.List;

import com.carpick.dto.CarDetailDto;
import com.carpick.dto.CarListDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.carpick.model.Car;

@Mapper
public interface CarMapper {

	@Select("SELECT * FROM cars ORDER BY car_id DESC")
    List<Car> getCarList();

    // 목록 조회 (XML id="selectCarList"와 이름 일치)
    List<CarListDto> selectCarList();

    CarDetailDto selectCarDetail(@Param("vehicleId") Long vehicleId);
}
