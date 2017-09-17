package com.remarkablesystems.childwatch.domain.food.projection;

import java.math.BigDecimal;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

@Projection(name="mealFoodItemFull", types= MealFoodItem.class )
public interface MealFoodItemFull {

	String getId();
	AgeGroup getAgeGroup();
	BigDecimal getQuantity();
	MealFull getMeal();
	FoodItemFull getFoodItem();
	UnitOfMeasure getUnit();
}
