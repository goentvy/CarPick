package com.carpick.domain.car.dto.cardetailpage;

import com.carpick.domain.car.dto.common.BranchLocationDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationDto {
	
	@NotNull
	@Valid
	private BranchLocationDto pickup;
	
	@NotNull
	@Valid
	private BranchLocationDto dropoff;

}
