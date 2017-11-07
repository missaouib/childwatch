package com.remarkablesystems.childwatch.domain.food.projection;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;

@Projection(name="mealFull", types= Meal.class )
public interface MealFull {
	String getId();
	String getDescription();
	MealType getType();
	boolean isInactive();

	@Value( "#{target.isCompliant()}")
	boolean isCompliant();
}
