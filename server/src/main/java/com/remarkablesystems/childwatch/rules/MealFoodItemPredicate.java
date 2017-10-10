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
	static Predicate<MealFoodItem> isMilkItem = hasTag( "MILK" ) ;

	static Predicate<MealFoodItem> isVegItem = hasTag( "VEGETABLE" );

	static Predicate<MealFoodItem> isVegJuiceItem = isVegItem.and( descriptionContains( "juice" ) );	
	
	static Predicate<MealFoodItem> isFruitItem = hasTag( "FRUIT" );
			
	static Predicate<MealFoodItem> isFruitJuiceItem = isFruitItem.and( descriptionContains( "juice") );
			
	static Predicate<MealFoodItem> isWholeMilkItem = isMilkItem.and( descriptionContains( "whole" ) ); 

	static Predicate<MealFoodItem> isFlavoredMilkItem = isMilkItem.and( descriptionContains("chocolate" ) ); 
			
	static Predicate<MealFoodItem> isLowFatOrFatFreeMilkItem = isMilkItem.and( descriptionContains( Arrays.asList("lowfat", "1%", "1 %", "skim" ) ) ); 
						
	static Predicate<MealFoodItem> isVegOrFruitItem = isVegItem.or( isFruitItem );
			
	static Predicate<MealFoodItem> isGrainOrBreadItem = hasTag( "GRAIN" );

	static Predicate<MealFoodItem> isMeatItem =  hasTag( "MEAT" );
					
	static Predicate<MealFoodItem> forInfant = (item) -> item.getAgeGroup().equals(AgeGroup.AGE_0_5MO ) || item.getAgeGroup().equals(AgeGroup.AGE_6_11MO);

	static Predicate<MealFoodItem> isQuantityItem( double quantity, UnitOfMeasure unit ) { return (item) -> { 
		Double convert = UnitOfMeasure.convert(item.getQuantity(), item.getUnit(), unit );
		return ( convert.isNaN() )? false : convert.doubleValue() >= quantity;
	}; };

	static Predicate<MealFoodItem> isQuantityBetweenItem( double low, double high, UnitOfMeasure unit ) { return (item) -> { 
		Double convert = UnitOfMeasure.convert(item.getQuantity(), item.getUnit(), unit );
		return ( convert.isNaN() )? false : convert.doubleValue() >= low && convert.doubleValue() <= high;
	}; };

	
    static Predicate<MealFoodItem> descriptionContains( String target ){ return (item) -> item.getFoodItem().getDescription().toLowerCase().contains(target); };
    static Predicate<MealFoodItem> descriptionContains( List<String> targets ){ return (item) -> targets.stream().anyMatch( (target) -> item.getFoodItem().getDescription().toLowerCase().contains(target) ); };
	
	
	static Predicate<MealFoodItem> hasTag(String type) { return ( mealFoodItem ) -> {			
		FoodItem item = mealFoodItem.getFoodItem();
		item.getTags().stream().forEach( t -> System.out.println(t.getValue()) );
		return item != null && item.hasTag(type);
	}; };
	

}
