package com.remarkablesystems.childwatch.domain.food;

import java.util.Arrays;
import java.util.List;

public enum MealType {
	BREAKFAST,
	AM_SNACK,
	LUNCH,
	PM_SNACK,
	SUPPER,
	EV_SNACK;
	
	public static List<MealType> ALL = Arrays.asList(MealType.BREAKFAST, MealType.AM_SNACK,MealType.LUNCH,MealType.PM_SNACK,MealType.SUPPER,MealType.EV_SNACK );

}
