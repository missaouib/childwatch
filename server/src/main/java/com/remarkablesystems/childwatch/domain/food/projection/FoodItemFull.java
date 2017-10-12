package com.remarkablesystems.childwatch.domain.food.projection;

import java.util.Set;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.FoodItemTag;

@Projection(name="foodItemFull", types=FoodItem.class )
public interface FoodItemFull{
	String getId();
	String getDescription();
	String getShortDescription();
	
	String getPurchaseUom();
	String getServingUom();
	
	Set<FoodItemTag> getTags();

	
}
