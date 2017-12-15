package com.remarkablesystems.childwatch.domain.food.projection;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealAttendanceRecord;


@Projection(name="marFull", types= MealAttendanceRecord.class )
public interface MealAttendanceRecordFull {

	String getId();
	AgeGroup getAgeGroup();
	double getProjected();
	double getActual();
}
