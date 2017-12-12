package com.remarkablesystems.childwatch.domain.food;

import java.util.Arrays;
import java.util.List;

public enum Recurrence {
	NONE,
	DAILY,
	WEEKLY,
	BIWEEKLY;
	
	public static List<Recurrence> ALL = Arrays.asList(Recurrence.NONE, Recurrence.DAILY, Recurrence.WEEKLY, Recurrence.BIWEEKLY );
}
