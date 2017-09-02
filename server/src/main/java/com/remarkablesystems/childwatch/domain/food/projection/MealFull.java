package com.remarkablesystems.childwatch.domain.food.projection;

import java.util.List;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;

@Projection(name="mealFull", types= Meal.class )
public interface MealFull {
	String getId();
	String getDescription();
	MealType getType();
}
