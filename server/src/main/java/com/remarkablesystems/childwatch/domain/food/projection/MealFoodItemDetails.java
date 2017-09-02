package com.remarkablesystems.childwatch.domain.food.projection;


import java.math.BigDecimal;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

@Projection(name="mealFoodItemDetails", types= MealFoodItem.class )
public interface MealFoodItemDetails {

	String getId();
	AgeGroup getAgeGroup();
	BigDecimal getQuantity();
	FoodItemFull getFoodItem();
}
