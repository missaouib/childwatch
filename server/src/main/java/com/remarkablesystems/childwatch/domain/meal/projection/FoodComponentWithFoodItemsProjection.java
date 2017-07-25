package com.remarkablesystems.childwatch.domain.meal.projection;

import java.util.Set;


import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.FoodComponent;
import com.remarkablesystems.childwatch.domain.meal.FoodItem;


@Projection(name="foodComponentWithFoodItems", types= {FoodComponent.class, FoodItem.class} )
public interface FoodComponentWithFoodItemsProjection {

	String getId();

	String getDescription();

	Set<FoodItem> getFoodItems();
}
