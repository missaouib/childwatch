package com.remarkablesystems.childwatch.domain.food.projection;

import java.util.Set;


import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.FoodComponent;


@Projection(name="foodComponentFull", types= FoodComponent.class )
public interface FoodComponentFull {

	String getId();

	String getDescription();

	Set<FoodItemFull> getFoodItems();
	
	FoodComponentWithId getParentComponent();
	
	String getIcon();

}
