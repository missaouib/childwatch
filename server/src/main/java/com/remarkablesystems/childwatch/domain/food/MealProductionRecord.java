package com.remarkablesystems.childwatch.domain.food;

import java.util.Date;
import java.util.Set;

public class MealProductionRecord {

	Date mealDate;
	
	long AGE_0_5MO_projected;
	long AGE_0_5MO_actual;
	long AGE_6_11MO_projected;
	long AGE_6_11MO_actual;
	long AGE_1YR_projected;
	long AGE_1YR_actual;
	long AGE_2YR_projected;
	long AGE_2YR_actual;
	long AGE_3_5YR_projected;
	long AGE_3_5YR_actual;
	long AGE_6_12YR_projected;
	long AGE_6_12YR_actual;
	long AGE_13_18YR_projected;
	long AGE_13_18YR_actual;
	long AGE_ADULT_projected;
	long AGE_ADULT_actual;
	long NON_PARTICIPANT_projected;
	long NON_PARTICIPANT_actual;	

	Set<ProductionFoodItem> productionFoodItems;
	
	String notes;
}
