package com.remarkablesystems.childwatch.domain.meal.projection;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.FoodItem;

@Projection(name="foodItemFull", types=FoodItem.class )
public interface FoodItemFull{
	String getId();
	String getDescription();
	String getShortDescription();
	FoodComponentWithId getFoodComponent();
}
