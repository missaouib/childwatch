package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.beans.factory.annotation.Autowired;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

public class MealFoodItemPredicate {
	static Predicate<MealFoodItem> isMilkItem = hasTag( "MILK" ) ;

	static Predicate<MealFoodItem> isVegItem = hasTag( "VEGETABLE" );

	static Predicate<MealFoodItem> isVegJuiceItem = isVegItem.and( hasTag( "JUICE" ) );	
	
	static Predicate<MealFoodItem> isFruitItem = hasTag( "FRUIT" );
			
	static Predicate<MealFoodItem> isFruitJuiceItem = isFruitItem.and( hasTag( "JUICE" ) );
			
	static Predicate<MealFoodItem> isWholeMilkItem = isMilkItem.and( descriptionContains( "whole" ) ); 

	static Predicate<MealFoodItem> isFlavoredMilkItem = isMilkItem.and( descriptionContains("chocolate" ).or( descriptionContains("flavored").and(descriptionContains("unflavored").negate()) ) ); 
			
	static Predicate<MealFoodItem> isLowFatOrFatFreeMilkItem = isMilkItem.and( descriptionContains( Arrays.asList("lowfat", "1%", "1 %", "skim","low-fat","fat-free" ) ) ); 

	static Predicate<MealFoodItem> isFatFreeMilkItem = isMilkItem.and( descriptionContains( "fat-free" ) );
	
	static Predicate<MealFoodItem> isVegOrFruitItem = isVegItem.or( isFruitItem );
			
	static Predicate<MealFoodItem> isGrainOrBreadItem = hasTag( "GRAIN" );

	static Predicate<MealFoodItem> isMeatItem =  hasTag( "MEAT" );
					
	
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
		return item != null && item.hasTag(type);
	}; };
	
	
	static Predicate<MealFoodItem> hasNoAgeTags = (mealFoodItem) -> mealFoodItem.getFoodItem().getTags().stream().noneMatch( (tag) -> tag.getValue().startsWith( "AGE_" ) );
	

}
