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
	
	public static Predicate<MealFoodItem> isFor0_5MO = hasTag( "AGE_0_5MO" );

	public static Predicate<MealFoodItem> isFor6_11MO = hasTag( "AGE_6_11MO" ).or( hasTag( "AGE_GT_6MO") );

	static Predicate<MealFoodItem> isCereal = hasTag( "CEREAL" );	
	static Predicate<MealFoodItem> isBread = hasTag( "BREAD" );
	static Predicate<MealFoodItem> isCracker = hasTag( "CRACKER" );
	static Predicate<MealFoodItem> isBeansOrPeas = hasTag( "PEAS").or(hasTag("BEANS") );
	
	static Predicate<MealFoodItem> isMeatAlt = hasTag("MEATALT");
	static Predicate<MealFoodItem> isCheese = hasTag("CHEESE");
	static Predicate<MealFoodItem> isCheeseSub = hasTag("COTTAGECHEESE").or(hasTag("CHEESEFOOD")).or(hasTag("CHEESESPREAD"));
	
	

	private InfantRule( String name ) {
		super( name );
	}
	
	public InfantRule appliesTo( BiPredicate<Meal,List<MealFoodItem>> pred ) {
		return (InfantRule)super.appliesTo( isAgeGroup( AgeGroup.AGE_0_5MO ).or(isAgeGroup( AgeGroup.AGE_6_11MO ) ).and( pred ) );
	}
	
	public static InfantRule ageAppropriateInfant = (InfantRule)create( "infant_ageAppropriate" )
			.whenNot( hasAllItems( isFor0_5MO.or( isFor6_11MO ) ) )
			.thenFail( "Infants can only be served age appropriate items" );
	
	public static InfantRule breakfast_0_5MO = (InfantRule)create( "breakfast_0_5MO" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasAllItems( isFor0_5MO.and( isMilkItem ) )
					  .and( sumHasQuantityBetween( isFor0_5MO.and( isMilkItem ), 4, 6, UnitOfMeasure.OUNCES ) ) 
					 )
			.thenFail( "Only 4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );
	
	public static InfantRule breakfast_6_11MO = (InfantRule)create( "breakfast_6_11MO" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isFor6_11MO.and(isMilkItem).or( isFor6_11MO.and(isCereal) ).or( isFor6_11MO.and(isFruitItem.or(isVegItem) ) ) )
					.and( sumHasQuantityBetween( isFor6_11MO.and(isMilkItem), 6, 8, UnitOfMeasure.OUNCES ) ) 
					.and( sumHasQuantityBetween( isFor6_11MO.and(isCereal), 2, 4, UnitOfMeasure.TABLESPOONS ) )
					.and( sumHasQuantityBetween( isFor6_11MO.and(isFruitItem.or(isVegItem) ), 1, 4, UnitOfMeasure.TABLESPOONS ) )
					) 
			.thenFail( "6-8oz of Breast Milk and/or Iron Fortified Infant Formula, 2-4 tbsp of Cereal, and 1-4 tbsp of Fruit and/or Vegetables must be serverd for infants 6-11MO" );

	public static InfantRule snack_0_5MO = (InfantRule)create( "snack_0_5MO" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasAllItems( isFor0_5MO.and( isMilkItem ) )
					  .and( sumHasQuantityBetween( isFor0_5MO.and( isMilkItem ), 4, 6, UnitOfMeasure.OUNCES ) ) 
					)
			.thenFail( "Only 4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );

	public static InfantRule snack_6_11MO = (InfantRule)create( "snack_6_11MO" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isFor6_11MO.and(isMilkItem).or( isFor6_11MO.and(isFruitJuiceItem) ).or( isFor6_11MO.and(isBread.or(isCracker) ) ) )
					  .and( sumHasQuantityBetween( isFor6_11MO.and(isMilkItem), 2, 4, UnitOfMeasure.OUNCES ).or( sumHasQuantityBetween( isFor6_11MO.and(isFruitJuiceItem), 2, 4, UnitOfMeasure.OUNCES ) ) )
					  .and( sumHasQuantityBetween( isFor6_11MO.and(isBread), 0, 0.5, UnitOfMeasure.EACH ).or( sumHasQuantityBetween( isFor6_11MO.and(isCracker), 0, 2, UnitOfMeasure.EACH ) ) )
					)
			.thenFail( "2-4oz of Breast Milk, Iron Fortified Infant Formula, and/or Fruit Juice and up to 1/2 slice of bread or 2 crackers must be served for infants 6-11MO" );

	public static InfantRule lunchdinner_0_5MO = (InfantRule)create( "lunchdinner_0_5MO" )
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.whenNot( hasAllItems( isFor0_5MO.and( isMilkItem ) )
					  .and( sumHasQuantityBetween( isFor0_5MO.and( isMilkItem ), 4, 6, UnitOfMeasure.OUNCES ) )  
					 )
			.thenFail( "Only 4-6oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 0-5MO" );
	
	public static InfantRule lunchdinner_6_11MO = (InfantRule)create( "lunchdinner_6_11MO" )
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.whenNot( hasAllItems( isFor6_11MO.and(isMilkItem).or( isFor6_11MO.and(isCereal)).or( isFor6_11MO.and(isFruitItem.or(isVegItem)) ).or( isFor6_11MO.and(isMeatAlt) ).or( isFor6_11MO.and(isCheese) ).or( isFor6_11MO.and(isCheeseSub) ) )
					  .and( sumHasQuantityBetween( isFor6_11MO.and(isMilkItem), 6, 8, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantityBetween( isFor6_11MO.and(isCereal), 2, 4, UnitOfMeasure.TABLESPOONS ) )
					  .and( sumHasQuantityBetween( isFor6_11MO.and(isFruitItem.or(isVegItem)), 1, 4, UnitOfMeasure.TABLESPOONS ) )
					  .and( hasNoItems(isFor6_11MO.and(isMeatAlt)).or( sumHasQuantityBetween( isFor6_11MO.and(isMeatAlt), 1, 4, UnitOfMeasure.TABLESPOONS) ) )
//					  .and( hasNoItems(isFor6_11MO.and(isCheese)).or( sumHasQuantityBetween( isFor6_11MO.and(isCheese) , 0.5, 2, UnitOfMeasure.OUNCES) ) )
//					  .and( hasNoItems(isFor6_11MO.and(isCheeseSub) ).or( sumHasQuantityBetween( isFor6_11MO.and(isCheeseSub), 1, 4, UnitOfMeasure.OUNCES) ) )
					)
			.thenFail( "6-8oz of Breast Milk and/or Iron Fortified Infant Formula, 2-4 tbsp of Cereal, and 1-4 tbsp of Fruit and/or Vegetables and possiblly a 1-4 tbsp of a meat alternative must be serverd for infants 6-11MO" );

	
	static List<MealRule> RULES = Arrays.asList(
			ageAppropriateInfant,
			breakfast_0_5MO,
			breakfast_6_11MO,
			snack_0_5MO,
			snack_6_11MO,
			lunchdinner_0_5MO,
			lunchdinner_6_11MO
			);
}
