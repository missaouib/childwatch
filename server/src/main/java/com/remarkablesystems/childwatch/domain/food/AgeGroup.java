package com.remarkablesystems.childwatch.domain.food;

import java.util.Arrays;
import java.util.List;

public enum AgeGroup {
	AGE_0_5MO,
	AGE_6_11MO,
	AGE_1YR,
	AGE_2YR,
	AGE_3_5YR,
	AGE_6_12YR,
	AGE_13_18YR,
	AGE_ADULT;
	
	public static List<AgeGroup> ALL = Arrays.asList(AgeGroup.AGE_0_5MO, AgeGroup.AGE_6_11MO, AgeGroup.AGE_1YR, AgeGroup.AGE_2YR, AgeGroup.AGE_3_5YR, AgeGroup.AGE_6_12YR, AgeGroup.AGE_13_18YR, AgeGroup.AGE_ADULT );
	
	public boolean isInfant() { return this.equals(AGE_0_5MO) || this.equals(AGE_6_11MO); }
}
