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


	static BiPredicate<Meal,List<MealFoodItem>> isInfant = hasAllItems( forInfant );

	static BiPredicate<Meal,List<MealFoodItem>> isNonInfant = hasNoItems( forInfant );
			
	static BiPredicate<Meal,List<MealFoodItem>> isBreakfast = (meal,mealFoodItems) -> meal.getType().equals( MealType.BREAKFAST );
	static BiPredicate<Meal,List<MealFoodItem>> isLunch = (meal,mealFoodItems) -> meal.getType().equals( MealType.LUNCH );
	static BiPredicate<Meal,List<MealFoodItem>> isSnack = (meal,mealFoodItems) -> meal.getType().equals( MealType.AM_SNACK ) || meal.getType().equals( MealType.PM_SNACK );
	static BiPredicate<Meal,List<MealFoodItem>> isDinner = (meal,mealFoodItems) -> meal.getType().equals( MealType.DINNER );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasAnyItem(Predicate<MealFoodItem> any) { return (meal,item) -> item.stream().anyMatch( any ); }
	static BiPredicate<Meal,List<MealFoodItem>> hasAllItems(Predicate<MealFoodItem> all) { return (meal,item) -> item.stream().allMatch( all ); }
	static BiPredicate<Meal,List<MealFoodItem>> hasNoItems(Predicate<MealFoodItem> none) { return (meal,item) -> item.stream().noneMatch( none ); }
	
	
	static BiPredicate<Meal,List<MealFoodItem>> hasVegFruitComponent = hasAnyItem( isVegOrFruitItem );
		
			
	static BiPredicate<Meal,List<MealFoodItem>> hasVegJuiceComponent = hasAnyItem( isVegJuiceItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasFruitJuiceComponent = hasAnyItem( isFruitJuiceItem );

			
	static BiPredicate<Meal,List<MealFoodItem>> hasGrainBreadComponent = hasAnyItem( isGrainOrBreadItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasMeatComponent = hasAnyItem( isMeatItem );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasMeatSubstitute = isBreakfast.and( hasAnyItem( isMeatItem ) );
			
	static BiPredicate<Meal,List<MealFoodItem>> hasFluidMilkComponent = hasAnyItem( isMilkItem );
		

	static BiPredicate<Meal,List<MealFoodItem>> hasWholeMilkComponent = hasAnyItem( isWholeMilkItem );

	static BiPredicate<Meal,List<MealFoodItem>> hasLowFatOrFatFreeMilkComponent = hasAnyItem(isLowFatOrFatFreeMilkItem);

	static BiPredicate<Meal,List<MealFoodItem>> hasFlavoredMilkComponent = hasAnyItem(isFlavoredMilkItem);
			
	static BiPredicate<Meal,List<MealFoodItem>> isAgeGroup( AgeGroup group ) { return hasAllItems( (i) -> i.getAgeGroup().equals(group) ); }
	
	static BiPredicate<Meal,List<MealFoodItem>> isUnder2YearsOld = isInfant.or( isAgeGroup(AgeGroup.AGE_1_2YR) );

	static BiPredicate<Meal,List<MealFoodItem>> isUnder6YearsOld = isUnder2YearsOld.or( isAgeGroup(AgeGroup.AGE_3_5YR) );
	
	static BiPredicate<Meal,List<MealFoodItem>> is6OrOver = isAgeGroup(AgeGroup.AGE_6_12YR).or(isAgeGroup(AgeGroup.AGE_13_18YR) ).or( isAgeGroup(AgeGroup.AGE_ADULT));
	
	static BiPredicate<Meal,List<MealFoodItem>> hasHalfCupMilk = hasAnyItem( isMilkItem.and( isQuantityItem( 0.5, UnitOfMeasure.CUPS ) ) );

	static BiPredicate<Meal,List<MealFoodItem>> hasThreeQuartersCupMilk = hasAnyItem( isMilkItem.and( isQuantityItem( 0.75, UnitOfMeasure.CUPS ) ) );

	static BiPredicate<Meal,List<MealFoodItem>> hasCupMilk = hasAnyItem( isMilkItem.and( isQuantityItem( 1, UnitOfMeasure.CUPS ) ) );

}
