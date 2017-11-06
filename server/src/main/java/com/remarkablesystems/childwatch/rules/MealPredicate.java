package com.remarkablesystems.childwatch.rules;


import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

import java.util.List;
import java.util.function.BiPredicate;
import java.util.function.Predicate;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

public class MealPredicate {



			
	static BiPredicate<Meal,List<MealFoodItem>> isBreakfast = (meal,mealFoodItems) -> meal.getType().equals( MealType.BREAKFAST );
	static BiPredicate<Meal,List<MealFoodItem>> isLunch = (meal,mealFoodItems) -> meal.getType().equals( MealType.LUNCH );
	static BiPredicate<Meal,List<MealFoodItem>> isSnack = (meal,mealFoodItems) -> meal.getType().equals( MealType.AM_SNACK ) || meal.getType().equals( MealType.PM_SNACK );
	static BiPredicate<Meal,List<MealFoodItem>> isDinner = (meal,mealFoodItems) -> meal.getType().equals( MealType.DINNER );
	static BiPredicate<Meal,List<MealFoodItem>> isLunchOrDinner = isDinner.or( isLunch );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasAnyItem(Predicate<MealFoodItem> any) { return (meal,item) -> item.stream().anyMatch( any ); }
	static BiPredicate<Meal,List<MealFoodItem>> hasAllItems(Predicate<MealFoodItem> all) { return (meal,item) -> item.stream().allMatch( all ); }
	static BiPredicate<Meal,List<MealFoodItem>> hasNoItems(Predicate<MealFoodItem> none) { return (meal,item) -> item.stream().noneMatch( none ); }
	
	static BiPredicate<Meal,List<MealFoodItem>> hasAtLeastCountItems( int count, Predicate<MealFoodItem> any) { return (meal,item) -> item.stream().filter( any ).count() >= count; }
	
	static BiPredicate<Meal,List<MealFoodItem>> hasAtLeastCountItemsDistinct( int count, Predicate<MealFoodItem> any) { return (meal,item) -> item.stream().filter( any ).map( mfi -> mfi.getFoodItem() ).distinct().count() >= count; }

	
	/**
	 * Predicate for mustHave items; this predicate will fail if the item is not present or if the item is present but not in sufficient quantities
	 * 
	 * @param itemRequired predicate to determine the required item
	 * @param quantity amount of the item required
	 * @param units unit of measure for the quantity required
	 * 
	 * @return true if the item is present and in sufficient quantities; false otherwise
	 */
	static BiPredicate<Meal,List<MealFoodItem>> mustHave( Predicate<MealFoodItem> itemRequired, double quantity, UnitOfMeasure units ){
		return hasNoItems( itemRequired ).or( hasAnyItem( itemRequired.and( isQuantityItem( quantity, units ).negate() )) );
	}

	static BiPredicate<Meal,List<MealFoodItem>> mustHaveBetween( Predicate<MealFoodItem> itemRequired, double low, double high, UnitOfMeasure units ){
		if( low == 0 )
			return ifHas( itemRequired, high, units );
		else
			return hasNoItems( itemRequired ).or( hasAnyItem( itemRequired.and( isQuantityBetweenItem( low, high, units ).negate() )) );
	}

	/**
	 * Predicate for ifHas items; this predicate will fail if the item is present and not in sufficient quantities.  Unlike the mustHave predicate
	 *  this will not fail if the item is not there
	 *  
	 * @param itemRequired
	 * @param quantity
	 * @param units
	 * @return 
	 */
	static BiPredicate<Meal,List<MealFoodItem>> ifHas( Predicate<MealFoodItem> itemRequired, double quantity, UnitOfMeasure units ){
		return hasAnyItem( itemRequired.and( isQuantityItem( quantity, units ).negate() ) );
	}
	
	public static BiPredicate<Meal,List<MealFoodItem>> sumHasQuantity( Predicate<MealFoodItem> itemFilter, double quantity, UnitOfMeasure units ){
		return (meal,items) -> { 
			Double sum = items.stream().filter( itemFilter )		
				.mapToDouble( item -> { 
					Double convert = UnitOfMeasure.convert(item.getQuantity(), item.getUnit(), units );
					System.out.println( "Convert = " + convert );
					return convert.isNaN() ? 0 : convert;
				} ).sum();
			System.out.println( "SUM = " + sum );
			return sum >= quantity;
		};
	}

	public static BiPredicate<Meal,List<MealFoodItem>> sumHasQuantityBetween( Predicate<MealFoodItem> itemFilter, double low, double high, UnitOfMeasure units ){
		return (meal,items) -> { 
				Double sum = items.stream().filter( itemFilter )
				.mapToDouble( item -> { 
					Double convert = UnitOfMeasure.convert(item.getQuantity(), item.getUnit(), units );
					System.out.println( "Convert = " + convert );
					return convert.isNaN() ? 0 : convert;
				} ).sum();
				System.out.println( "SUM = " + sum + " low = " + low + " high = " + high );
				return sum >= low && sum <= high;
		};
	}

	
	static BiPredicate<Meal,List<MealFoodItem>> hasVegFruitComponent = hasAnyItem( isVegOrFruitItem );
		
			
	static BiPredicate<Meal,List<MealFoodItem>> hasVegJuiceComponent = hasAnyItem( isVegJuiceItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasFruitJuiceComponent = hasAnyItem( isFruitJuiceItem );

			
	static BiPredicate<Meal,List<MealFoodItem>> hasGrainBreadComponent = hasAnyItem( isGrainOrBreadItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasMeatComponent = hasAnyItem( isMeatItem );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasMeatSubstitute = isBreakfast.and( hasAnyItem( isMeatItem ) );
			
	static BiPredicate<Meal,List<MealFoodItem>> hasFluidMilkComponent = hasAnyItem( isMilkItem );
		

	static BiPredicate<Meal,List<MealFoodItem>> hasWholeMilkComponent = hasAnyItem( isWholeMilkItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasLowFatOrFatFreeMilkComponent = hasAnyItem(isLowFatOrFatFreeMilkItem);

	static BiPredicate<Meal,List<MealFoodItem>> hasFatFreeMilkComponent = hasAnyItem(isFatFreeMilkItem);

	static BiPredicate<Meal,List<MealFoodItem>> hasFlavoredMilkComponent = hasAnyItem(isFlavoredMilkItem);
			
	static BiPredicate<Meal,List<MealFoodItem>> isAgeGroup( AgeGroup group ) { return hasAllItems( (i) -> i.getAgeGroup().equals(group) ); }
	
	static BiPredicate<Meal,List<MealFoodItem>> isUnder2YearsOld = isAgeGroup(AgeGroup.AGE_1YR).or( isAgeGroup( AgeGroup.AGE_0_5MO) ).or( isAgeGroup(AgeGroup.AGE_6_11MO ) );

	static BiPredicate<Meal,List<MealFoodItem>> isUnder6YearsOld = isUnder2YearsOld.or( isAgeGroup(AgeGroup.AGE_3_5YR) );
	
	static BiPredicate<Meal,List<MealFoodItem>> is6OrOver = isAgeGroup(AgeGroup.AGE_6_12YR).or(isAgeGroup(AgeGroup.AGE_13_18YR) ).or( isAgeGroup(AgeGroup.AGE_ADULT));

	static BiPredicate<Meal,List<MealFoodItem>> isOver2YearsOld = is6OrOver.or( isAgeGroup( AgeGroup.AGE_3_5YR ) );

}
