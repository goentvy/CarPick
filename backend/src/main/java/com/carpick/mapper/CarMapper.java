package com.carpick.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.carpick.model.Car;

@Mapper
public interface CarMapper {

	@Select("SELECT * FROM cars ORDER BY car_id DESC")
    List<Car> getCarList();
}
