package com.remarkablesystems.childwatch.domain.food.projection;

import java.util.Date;
import java.util.Set;


import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.MealEvent;
import com.remarkablesystems.childwatch.domain.food.MealProductionFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionRecord;
import com.remarkablesystems.childwatch.domain.food.MealType;


@Projection(name="mprFull", types= MealProductionRecord.class )
public interface MealProductionRecordFull {

	String getId();
		
	Date getMealDate();
	
	MealType getType();
	
	boolean isLocked();
	
	Date getLockDate();
	
	MealEvent getMealEvent();

	String getNotes();
	
	Set<MealAttendanceRecordFull> getAttendanceRecords();		

	Set<MealProductionFoodItemFull> getProductionFoodItems();		

}
