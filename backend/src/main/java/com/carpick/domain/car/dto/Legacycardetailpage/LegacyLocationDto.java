package com.carpick.domain.car.dto.Legacycardetailpage;

import com.carpick.domain.car.dto.common.BranchLocationDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LegacyLocationDto {
	
	@NotNull
	@Valid
	private BranchLocationDto pickup;
	
	@NotNull
	@Valid
	private BranchLocationDto dropoff;

}
