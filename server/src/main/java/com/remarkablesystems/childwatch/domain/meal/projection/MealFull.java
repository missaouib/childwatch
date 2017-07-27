package com.remarkablesystems.childwatch.domain.meal.projection;

import java.util.List;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.Meal;
import com.remarkablesystems.childwatch.domain.meal.MealFoodItem;

@Projection(name="mealFull", types= Meal.class )
public interface MealFull {
	String getId();
	String getDescription();
	List<MealFoodItem> getMealFoodItems();
}
