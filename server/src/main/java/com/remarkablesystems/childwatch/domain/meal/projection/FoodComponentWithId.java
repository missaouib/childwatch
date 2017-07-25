package com.remarkablesystems.childwatch.domain.meal.projection;


import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.FoodComponent;

@Projection(name="foodComponentWithId", types= FoodComponent.class )
public interface FoodComponentWithId {
	String getId();

	String getDescription();

}

