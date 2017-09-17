package com.remarkablesystems.childwatch.domain.food.projection;

import java.util.Date;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.MealEvent;
import com.remarkablesystems.childwatch.domain.food.Recurrence;

@Projection(name="mealEventFull", types= MealEvent.class )
public interface MealEventFull {

	MealFull getMeal();

	Date getStartDate();

	Date getEndDate();

	Recurrence getRecurrence();

	String getId();

}
