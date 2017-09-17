package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.beans.factory.annotation.Autowired;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodComponent;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

public class MealFoodItemPredicate {
	static Predicate<MealFoodItem> isMilkItem = isFoodComponentType( "MILKIE" ) ;

	static Predicate<MealFoodItem> isVegJuiceItem = isFoodComponentType( "VEGIEJUICE" );
			
	static Predicate<MealFoodItem> isFruitJuiceItem = isFoodComponentType( "FRUITJUICE" );

			
	static Predicate<MealFoodItem> isWholeMilkItem = isMilkItem.and( descriptionContains( "whole" ) ); 

	static Predicate<MealFoodItem> isFlavoredMilkItem = isMilkItem.and( descriptionContains("chocolate" ) ); 
			
	static Predicate<MealFoodItem> isLowFatOrFatFreeMilkItem = isMilkItem.and( descriptionContains( Arrays.asList("lowfat", "1%", "1 %", "skim" ) ) ); 
			
			
	static Predicate<MealFoodItem> isVegOrFruitItem = isFoodComponentType( "VEG" ).or( isFoodComponentType( "FRUIT" ) );
			
	static Predicate<MealFoodItem> isGrainOrBreadItem = isFoodComponentType( "BRC" );

	static Predicate<MealFoodItem> isMeatItem =  isFoodComponentType( "MEAT" );
					
	static Predicate<MealFoodItem> forInfant = (item) -> item.getAgeGroup().equals(AgeGroup.AGE_0_5MO ) || item.getAgeGroup().equals(AgeGroup.AGE_6_11MO);

	static Predicate<MealFoodItem> isQuantityItem( double quantity, UnitOfMeasure unit ) { return (item) -> { 
		Double convert = UnitOfMeasure.convert(item.getQuantity(), item.getUnit(), unit );
		return ( convert.isNaN() )? false : convert.doubleValue() >= quantity;
	}; };

    private static Predicate<MealFoodItem> descriptionContains( String target ){ return (item) -> item.getFoodItem().getDescription().toLowerCase().contains(target); };
    private static Predicate<MealFoodItem> descriptionContains( List<String> targets ){ return (item) -> targets.stream().anyMatch( (target) -> item.getFoodItem().getDescription().toLowerCase().contains(target) ); };
	
	
	private static Predicate<MealFoodItem> isFoodComponentType(String type) { return ( mealFoodItem ) -> {	
		
		FoodItem item = mealFoodItem.getFoodItem();
		FoodComponent component = item != null ? item.getFoodComponent() : null; 
		FoodComponent parentComponent = component != null ? component.getParentComponent() : null;

		return (component != null && component.getId().equals(type) ) ||
			   (parentComponent != null && parentComponent.getId().equals(type) );
	}; };
	

}
