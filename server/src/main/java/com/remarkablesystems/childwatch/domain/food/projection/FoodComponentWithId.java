package com.remarkablesystems.childwatch.domain.food.projection;


import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.FoodComponent;

@Projection(name="foodComponentWithId", types= FoodComponent.class )
public interface FoodComponentWithId {
	String getId();

	String getDescription();
	
	String getIcon();
	
	FoodComponentWithId getParentComponent();

}

