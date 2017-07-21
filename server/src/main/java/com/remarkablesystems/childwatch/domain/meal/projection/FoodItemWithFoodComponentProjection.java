package com.remarkablesystems.childwatch.domain.meal.projection;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.FoodComponent;
import com.remarkablesystems.childwatch.domain.meal.FoodItem;

@Projection(name="foodItemWithFoodComponent", types=FoodItem.class )
public interface FoodItemWithFoodComponentProjection{
	String getId();
	String getDescription();
	String getShortDescription();
	FoodComponent getFoodComponent();
}
