package com.remarkablesystems.childwatch.domain.food.projection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

@Projection(name="mpfiFull", types= MealProductionFoodItem.class )
public interface MealProductionFoodItemFull {

	String getId();
	double getRequired();
	double getPrepared();
	UnitOfMeasure getUnit();
	
	FoodItemFull getFoodItem();
	
	@Value( "#{target.getCalcRequired()}")
	double getCalcRequired();
}
