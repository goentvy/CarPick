package com.carpick.domain.car.dto.response.cardetailpage;

import com.carpick.domain.car.dto.response.common.BranchLocationDto;
import lombok.Data;



@Data
public class LocationDto {
  private BranchLocationDto pickup;
  private BranchLocationDto dropoff;



}
