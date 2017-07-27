package com.remarkablesystems.childwatch.domain.meal.projection;

import java.math.BigDecimal;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.AgeGroup;
import com.remarkablesystems.childwatch.domain.meal.MealFoodItem;

@Projection(name="mealFoodItemFull", types= MealFoodItem.class )
public interface MealFoodItemFull {

	Integer getId();
	AgeGroup getAgeGroup();
	BigDecimal getAmount();
	MealFull getMeal();
	FoodItemFull getFoodItem();
}
