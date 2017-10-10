package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;
import java.util.function.Predicate;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

public class InfantRule extends MealRule {
	
	static InfantRule create( String name ) { return new InfantRule( name ); };
	
	static Predicate<MealFoodItem> isForInfant = hasTag( "INFANT" );
	
	static Predicate<MealFoodItem> isInfantMilk =  isForInfant.and( isMilkItem );
	static Predicate<MealFoodItem> isInfantCereal = isForInfant.and( hasTag( "CEREAL" ) );	
	static Predicate<MealFoodItem> isInfantFruit = isForInfant.and( isFruitItem );
	static Predicate<MealFoodItem> isInfantVeg = isForInfant.and( isVegItem );
	static Predicate<MealFoodItem> isInfantFruitOrVeg = isInfantFruit.or( isInfantVeg );
	static Predicate<MealFoodItem> isInfantFruitJuice = isForInfant.and( isFruitJuiceItem );
	static Predicate<MealFoodItem> isInfantBread = isForInfant.and( hasTag( "BREAD" ) );
	static Predicate<MealFoodItem> isInfantCracker = isForInfant.and( hasTag( "CRACKER" ) );
	static Predicate<MealFoodItem> isInfantBreadOrCracker = isInfantBread.or( isInfantCracker );
	static Predicate<MealFoodItem> isInfantBeansOrPeas = isForInfant.and( hasTag( "PEAS").or(hasTag("BEANS") ) );
	
	static Predicate<MealFoodItem> isInfantMeatAlt = isForInfant.and( hasTag("MEAT") );
	static Predicate<MealFoodItem> isInfantCheese = isForInfant.and( hasTag("CHEESE") );
	static Predicate<MealFoodItem> isInfantCheeseSub = isForInfant.and( hasTag("COTTAGECHEESE").or(hasTag("CHEESEFOOD")).or(hasTag("CHEESESPREAD")) );
	
	
	static BiPredicate<Meal,List<MealFoodItem>> hasInfantMilk =  hasAllItems( isInfantMilk );

	private InfantRule( String name ) {
		super( name );
	}
	
	public InfantRule appliesTo( BiPredicate<Meal,List<MealFoodItem>> pred ) {
		return (InfantRule)super.appliesTo( isInfant.and( pred ) );
	}
	
	
	public static InfantRule breakfast_0_5MO = (InfantRule)create( "breakfast_0_5MO" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasInfantMilk
					  .and( sumHasQuantityBetween( isInfantMilk, 4, 6, UnitOfMeasure.OUNCES ) ) 
					 )
			.thenFail( "4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );
	
	public static InfantRule breakfast_6_11MO = (InfantRule)create( "breakfast_6_11MO" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isInfantMilk.or( isInfantCereal ).or( isInfantFruitOrVeg ) )
					.and( sumHasQuantityBetween( isInfantMilk, 6, 8, UnitOfMeasure.OUNCES ) ) 
					.and( sumHasQuantityBetween( isInfantCereal, 2, 4, UnitOfMeasure.TABLESPOONS ) )
					.and( sumHasQuantityBetween( isInfantFruitOrVeg, 1, 4, UnitOfMeasure.TABLESPOONS ) )
					) 
			.thenFail( "6-8oz of Breast Milk and/or Iron Fortified Infant Formula, 2-4 tbsp of Cereal, and 1-4 tbsp of Fruit and/or Vegetables must be serverd for infants 6-11MO" );

	public static InfantRule snack_0_5MO = (InfantRule)create( "snack_0_5MO" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasInfantMilk
					  .and( sumHasQuantityBetween( isInfantMilk, 4, 6, UnitOfMeasure.OUNCES ) ) 
					)
			.thenFail( "4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );

	public static InfantRule snack_6_11MO = (InfantRule)create( "snack_6_11MO" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isInfantMilk.or( isInfantFruitJuice ).or( isInfantBreadOrCracker ) )
					  .and( sumHasQuantityBetween( isInfantMilk, 2, 4, UnitOfMeasure.OUNCES ).or( sumHasQuantityBetween( isInfantFruitJuice, 2, 4, UnitOfMeasure.OUNCES ) ) )
					  .and( sumHasQuantityBetween( isInfantBread, 0, 0.5, UnitOfMeasure.EACH ).or( sumHasQuantityBetween( isInfantCracker, 0, 2, UnitOfMeasure.EACH ) ) )
					)
			.thenFail( "2-4oz of Breast Milk, Iron Fortified Infant Formula, and/or Fruit Juice and up to 1/2 slice of bread or 2 crackers must be served for infants 6-11MO" );

	public static InfantRule lunchdinner_0_5MO = (InfantRule)create( "lunchdinner_0_5MO" )
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasInfantMilk
					  .and( sumHasQuantityBetween( isInfantMilk, 4, 6, UnitOfMeasure.OUNCES ) ) 
					 )
			.thenFail( "4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );
	
	public static InfantRule lunchdinner_6_11MO = (InfantRule)create( "lunchdinner_6_11MO" )
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isInfantMilk.or( isInfantCereal ).or( isInfantFruitOrVeg ).or( isInfantMeatAlt ).or( isInfantCheese ).or( isInfantCheeseSub ) )
					  .and( sumHasQuantityBetween( isInfantMilk, 6, 8, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantityBetween( isInfantCereal, 2, 4, UnitOfMeasure.TABLESPOONS ) )
					  .and( sumHasQuantityBetween( isInfantFruitOrVeg, 1, 4, UnitOfMeasure.TABLESPOONS ) )
					  .and( hasNoItems(isInfantMeatAlt).or( sumHasQuantityBetween( isInfantMeatAlt, 1, 4, UnitOfMeasure.TABLESPOONS) ) )
					  .and( hasNoItems(isInfantCheese).or( sumHasQuantityBetween( isInfantCheese, 0.5, 2, UnitOfMeasure.OUNCES) ) )
					  .and( hasNoItems(isInfantCheeseSub).or( sumHasQuantityBetween( isInfantCheeseSub, 1, 4, UnitOfMeasure.OUNCES) ) )
					)
			.thenFail( "4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );

	
	static List<MealRule> RULES = Arrays.asList(
			breakfast_0_5MO,
			breakfast_6_11MO,
			snack_0_5MO,
			snack_6_11MO,
			lunchdinner_0_5MO,
			lunchdinner_6_11MO
			);
}
