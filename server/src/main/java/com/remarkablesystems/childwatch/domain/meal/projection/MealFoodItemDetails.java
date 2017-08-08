package com.remarkablesystems.childwatch.domain.meal.projection;


import java.math.BigDecimal;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.AgeGroup;
import com.remarkablesystems.childwatch.domain.meal.MealFoodItem;

@Projection(name="mealFoodItemDetails", types= MealFoodItem.class )
public interface MealFoodItemDetails {

	Integer getId();
	AgeGroup getAgeGroup();
	BigDecimal getQuantity();
	FoodItemFull getFoodItem();
}
