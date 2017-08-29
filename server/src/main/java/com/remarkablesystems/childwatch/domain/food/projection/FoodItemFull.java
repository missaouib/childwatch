package com.remarkablesystems.childwatch.domain.food.projection;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.FoodItem;

@Projection(name="foodItemFull", types=FoodItem.class )
public interface FoodItemFull{
	String getId();
	String getDescription();
	String getShortDescription();
	FoodComponentWithId getFoodComponent();

	String getPurchaseUom();
	String getServingUom();

	
}
