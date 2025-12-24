package com.carpick.domain.car.dto.carList.resquest;


import com.carpick.domain.car.enums.CarClass;
import com.carpick.domain.car.enums.CarSortType;
import com.carpick.domain.car.enums.FuelType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarSearchCondition {
    // Top Section
    private Long branchId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    // Filter Section (다중 선택 가능)
    private List<CarClass> carClasses; // 경형/소형/준중형/중형/대형/수입/RV/SUV
    private List<FuelType> fuelTypes;  // 휘발유/경유/LPG/전기/하이브리드/수소

    // 탑승 인원 필터(단일 선택 추천)
    private Integer seatFilter;

    // Sort
    private CarSortType sortType;

    // Paging (있으면)
    private Integer page;
    private Integer size;


}
