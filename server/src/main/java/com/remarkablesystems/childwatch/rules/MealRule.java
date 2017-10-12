package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;
import java.util.function.Predicate;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.InfantRule.*;

import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

public class MealRule extends Rule<Meal,List<MealFoodItem>,MealRuleViolation>{
	
	static Predicate<MealFoodItem> isGrainItem = hasTag( "GRAIN" ).and( hasTag( "BAKED" ).negate() );
	
	static Predicate<MealFoodItem> isMeatOrAlt = hasTag( "MEAT").or( hasTag("MEATALT") );

	static BiPredicate<Meal,List<MealFoodItem>> isNonInfant = isAgeGroup( AgeGroup.AGE_1_2YR )
															  .or( isAgeGroup( AgeGroup.AGE_3_5YR ) )
															  .or( isAgeGroup( AgeGroup.AGE_6_12YR ) )
															  .or(isAgeGroup( AgeGroup.AGE_13_18YR ))
															  .or(isAgeGroup( AgeGroup.AGE_ADULT ));

	static BiPredicate<Meal,List<MealFoodItem>> isAge6_18 = isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup(AgeGroup.AGE_13_18YR ) );
	String name;

	static MealRule create( String name ) { return  new MealRule( name ); };
	
	
	MealRule( String name ) {
		this.name = name;
	}	
	
	public String getName() {
		return this.name;
	}
	
	public MealRule appliesTo( BiPredicate<Meal,List<MealFoodItem>> pred ) {
		super.appliesTo(pred);
		return this;
	}
	
	public MealRule when( BiPredicate<Meal,List<MealFoodItem>> pred) {
		super.when( pred );
		return this;
	}
	
	public MealRule whenNot( BiPredicate<Meal,List<MealFoodItem>> pred) {
		super.whenNot( pred );
		return this;
	}
	
	public MealRule thenFail( String msg ) {
		return then( RuleViolationSeverity.FAIL, msg );
	}
	
	public MealRule thenWarn( String msg ) {
		return then( RuleViolationSeverity.WARN, msg );
	}
	
	public MealRule then( RuleViolationSeverity severity, String msg ) {
		return (MealRule)super.then( (meal, mealFoodItemList) -> new MealRuleViolation( severity, msg, this, meal.getId() ) );
	}
	
	public MealRuleViolation evaluate( Meal meal, List<MealFoodItem> mealFoodItems ) {
		MealRuleViolation violation = super.evaluate(meal,mealFoodItems);
		if( violation != null && mealFoodItems.size() > 0 )
			violation.ageGroup = mealFoodItems.get(0).getAgeGroup();
		return violation;
	}
	
	public String toString() {
		return "Rule: [" + getName() +"]";
	}
	
	//----------------------------------------------------------------------------------------------------------------
	// 1-2 Year olds
	static MealRule breakfast_1_2YR = MealRule.create("breakfast_1_2YR")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_1_2YR ) ) )
		.whenNot( hasAllItems( isWholeMilkItem.or( isVegOrFruitItem ).or( isGrainItem.or( isMeatOrAlt ) ) ) 
				  .and( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.25, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 0.5, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Ages 1-2 must have 1/2 cup whole milk, 1/4 cup vegetables/fruit, and 1/2 ounce of grain or meat/alternative for breakfast");

	static MealRule lunchdinner_1_2YR = MealRule.create("lunchdinner_1_2YR")
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_1_2YR ) ) )
			.whenNot( hasAllItems( isWholeMilkItem.or( isVegItem ).or( isFruitItem ).or( isMeatOrAlt ).or( isGrainItem ) ) 
					  .and( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.125, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isFruitItem, 0.125, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk, 1 oz of meat/alternative, 1/8 cup vegetables, 1/8 cup fruit, and 1/2 oz of grains for lunch/dinner");
	
	static MealRule snack_1_2YR_items = MealRule.create("snack_1_2YR_items")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) ) )
			.whenNot( hasAllItems( isWholeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) 
					  .or( hasAllItems( isWholeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  .or( hasAllItems( isWholeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isWholeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					)
			.thenFail( "Ages 1-2 must have a snack consisting of 2 of the categories of milk, meat, vegetable, fruit, grain");

	
	static MealRule snack_1_2YR_milkveg = MealRule.create("snack_1_2YR_milkveg")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isWholeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk and 1/2 cup vegetable for snack" );

	static MealRule snack_1_2YR_milkmeat = MealRule.create("snack_1_2YR_milkmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isWholeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk and 1/2 oz meat/alternitive for snack" );

	
	static MealRule snack_1_2YR_milkfruit = MealRule.create("snack_1_2YR_milkfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isWholeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk and 1/2 cup fruit for snack" );

	static MealRule snack_1_2YR_milkgrain = MealRule.create("snack_1_2YR_milkgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isWholeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isWholeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk and 1/2 oz grain for snack" );


	static MealRule snack_1_2YR_vegmeat = MealRule.create("snack_1_2YR_vegmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup vegetable and 1/2 oz meat/alternative for snack" );

	
	static MealRule snack_1_2YR_vegfruit = MealRule.create("snack_1_2YR_vegfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup vegetable and 1/2 cup fruit for snack" );

	static MealRule snack_1_2YR_veggrain = MealRule.create("snack_1_2YR_veggrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup vegetable and 1/2 oz grain for snack" );


	static MealRule snack_1_2YR_meatfruit = MealRule.create("snack_1_2YR_meatfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 oz meat/alternative and 1/2 cup fruit for snack" );

	static MealRule snack_1_2YR_meatgrain = MealRule.create("snack_1_2YR_meatgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 oz meat/alternative and 1/2 oz grain for snack" );

	static MealRule snack_1_2YR_fruitgrain = MealRule.create("snack_1_2YR_fruitgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1_2YR ) )
					    .and(hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 1-2 must have 1/2 cup fruit and 1/2 oz grain for snack" );
	//----------------------------------------------------------------------------------------------------------------
	// 3-5 Year olds
	static MealRule breakfast_3_5YR = MealRule.create("breakfast_3_5YR")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
		.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegOrFruitItem ).or( isGrainItem.or( isMeatOrAlt ) ) ) 
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.75, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 0.5, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Ages 3-5 must have 1/2 cup fat-free/low-fat milk, 1/2 cup vegetables and/or fruit, and 1/2 oz grain for breakfast");

	static MealRule lunchdinner_3_5YR = MealRule.create("lunchdinner_3_5YR")
			.appliesTo( isLunchOrDinner.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegItem ).or( isFruitItem ).or( isMeatOrAlt ).or( isGrainItem ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.75, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 1.5, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.25, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isFruitItem, 0.25, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 3/4 cup fat-free/low-fat milk, 1 1/2 oz of meat/alterntive, 1/4 cup vegetables, 1/4 cup fruit, and 1/2 oz grain for lunch/dinner");
	
	static MealRule snack_3_5YR_items = MealRule.create("snack_3_5YR_items")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) 
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					)
			.thenFail( "Ages 3-5 must have a snack consisting of 2 of the categories of milk, meat, vegetable, fruit, grain");

	
	static MealRule snack_3_5YR_milkveg = MealRule.create("snack_3_5YR_milkveg")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup fat-free/low-fat milk and 1/2 cup vegetables for snack");

	static MealRule snack_3_5YR_milkmeat = MealRule.create("snack_3_5YR_milkmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup fat-free/low-fat milk and 1/2 oz meat/alternative for snack");

	
	static MealRule snack_3_5YR_milkfruit = MealRule.create("snack_3_5YR_milkfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup fat-free/low-fat milk and 1/2 cup fruit for snack");

	static MealRule snack_3_5YR_milkgrain = MealRule.create("snack_3_5YR_milkgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup fat-free/low-fat milk and 1/2 oz grains for snack");

	static MealRule snack_3_5YR_vegmeat = MealRule.create("snack_3_5YR_vegmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup vegetables and 1/2 oz meat/alternative for snack");

	
	static MealRule snack_3_5YR_vegfruit = MealRule.create("snack_3_5YR_vegfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup vegetables and 1/2 cup fruit for snack");

	static MealRule snack_3_5YR_veggrain = MealRule.create("snack_3_5YR_veggrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup vegetables and 1/2 oz grains for snack");


	static MealRule snack_3_5YR_meatfruit = MealRule.create("snack_3_5YR_meatfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 oz meat/alternitive and 1/2 cup fruit for snack");

	static MealRule snack_3_5YR_meatgrain = MealRule.create("snack_3_5YR_meatgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 oz meat/alternative and 1/2 oz grains for snack");

	static MealRule snack_3_5YR_fruitgrain = MealRule.create("snack_3_5YR_fruitgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) )
					    .and(hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 3-5 must have 1/2 cup fruit and 1/2 oz grains for snack");

	//----------------------------------------------------------------------------------------------------------------
	// 6-18 Year olds
	static MealRule breakfast_6_18YR = MealRule.create("breakfast_6_18YR")
		.appliesTo( isBreakfast.and( isAge6_18 ) )
		.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegOrFruitItem ).or( isGrainItem.or( isMeatOrAlt ) ) ) 
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 1, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk, 1/2 cup vegetable and/or fruit, and 1/2 oz grains or meat/alternative for breakfast");

	static MealRule lunchdinner_6_18YR = MealRule.create("lunchdinner_6_18YR")
			.appliesTo( isLunchOrDinner.and( isAge6_18 ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegItem ).or( isFruitItem ).or( isMeatOrAlt ).or( isGrainItem ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isFruitItem, 0.25, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk, 2 oz of meat/alternative, 1/2 cup vegetable, 1/4 cup fruit, and 1 oz grains for lunch/dinner");
	
	static MealRule snack_6_18YR_items = MealRule.create("snack_6_18YR_items")
			.appliesTo( isSnack.and( isAge6_18 ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) 
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					)
			.thenFail( "Ages 6-18 must have a snack consisting of 2 of the categories of milk, meat, vegetable, fruit, grain");

	
	static MealRule snack_6_18YR_milkveg = MealRule.create("snack_6_18YR_milkveg")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk and 3/4 cup vegetable for snack");

	static MealRule snack_6_18YR_milkmeat = MealRule.create("snack_6_18YR_milkmeat")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk and 1 oz meat/alternative for snack");

	
	static MealRule snack_6_18YR_milkfruit = MealRule.create("snack_6_18YR_milkfruit")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk and 3/4 cup fruit for snack");

	static MealRule snack_6_18YR_milkgrain = MealRule.create("snack_6_18YR_milkgrain")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk and 1 oz grains for snack");


	static MealRule snack_6_18YR_vegmeat = MealRule.create("snack_6_18YR_vegmeat")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 3/4 cup vegetable and 1 oz meat/alternative for snack");

	
	static MealRule snack_6_18YR_vegfruit = MealRule.create("snack_6_18YR_vegfruit")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 6-18 must have 3/4 cup vegetable and 3/4 cup fruit for snack");

	static MealRule snack_6_18YR_veggrain = MealRule.create("snack_6_18YR_veggrain")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 3/4 cup vegetable and 1 oz grains for snack");


	static MealRule snack_6_18YR_meatfruit = MealRule.create("snack_6_18YR_meatfruit")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Ages 6-18 must have 1 oz meat/alternative and 3/4 cup fruit for snack");

	static MealRule snack_6_18YR_meatgrain = MealRule.create("snack_6_18YR_meatgrain")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 1 oz meat/alternative and 1 oz grains for snack");

	static MealRule snack_6_18YR_fruitgrain = MealRule.create("snack_6_18YR_fruitgrain")
			.appliesTo( isSnack.and( isAge6_18 )
					    .and(hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Ages 6-18 must have 3/4 cup fruit and 1 oz grains for snack");

	//----------------------------------------------------------------------------------------------------------------
	// Adults
	static MealRule breakfast_ADULT = MealRule.create("breakfast_ADULT")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
		.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegOrFruitItem ).or( isGrainItem.or( isMeatOrAlt ) ) ) 
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 2, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Adults must have 1 cup fat-free/low-fat milk, 1/2 cup vegetables and/or fruit, and 2 oz of grains for breakfast");

	static MealRule lunch_ADULT = MealRule.create("lunch_ADULT")
			.appliesTo( isLunch.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegItem ).or( isFruitItem ).or( isMeatOrAlt ).or( isGrainItem ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk, 2oz of meat/alternative, 1/2 cup vegetables, 1/2 cup fruit, and 2 oz of grains for lunch");

	static MealRule dinner_ADULT = MealRule.create("dinner_ADULT")
			.appliesTo( isDinner.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or( isVegItem ).or( isFruitItem ).or( isMeatOrAlt ).or( isGrainItem ) ) 
					  .and( hasNoItems(isLowFatOrFatFreeMilkItem).or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults 2oz of meat/alternative, 1/2 cup vegetables, 1/2 cup fruit, 2 oz of grains, and optionally 1 cup of fat-free/low-fat milk for lunch");

	static MealRule snack_ADULT_items = MealRule.create("snack_ADULT_items")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) 
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )		  
					  .or( hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					  .or( hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )		  
					)
			.thenFail( "Adults must a snack consisting of 2 of the categories of milk, meat, vegetable, fruit, grain");

	
	static MealRule snack_ADULT_milkveg = MealRule.create("snack_ADULT_milkveg")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isVegItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isVegItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk and 1/2 cup vegetables for snack");

	static MealRule snack_ADULT_milkmeat = MealRule.create("snack_ADULT_milkmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk and 1 oz meat/alternative for snack");

	
	static MealRule snack_ADULT_milkfruit = MealRule.create("snack_ADULT_milkfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk and 1/2 cup fruit for snack");

	static MealRule snack_ADULT_milkgrain = MealRule.create("snack_ADULT_milkgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isLowFatOrFatFreeMilkItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isLowFatOrFatFreeMilkItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk and 1/2 cup vegetables for snack");


	static MealRule snack_ADULT_vegmeat = MealRule.create("snack_ADULT_vegmeat")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isVegItem.or(isMeatOrAlt) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isMeatOrAlt ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1/2 cup vegetables and 1 oz meat/alternative for snack");

	
	static MealRule snack_ADULT_vegfruit = MealRule.create("snack_ADULT_vegfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isVegItem.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Adults must have 1/2 cup vegetables and 1/2 cup fruit for snack");

	static MealRule snack_ADULT_veggrain = MealRule.create("snack_ADULT_veggrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isVegItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isVegItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1/2 cup vegetables and 1 oz grain for snack");


	static MealRule snack_ADULT_meatfruit = MealRule.create("snack_ADULT_meatfruit")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isMeatOrAlt.or(isFruitItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isFruitItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
					)
			.thenFail( "Adults must have 1 oz meat/alternative and 1/2 cup fruit for snack");

	static MealRule snack_ADULT_meatgrain = MealRule.create("snack_ADULT_meatgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isMeatOrAlt.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isMeatOrAlt ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1 oz meat/alternative and 1 oz grains for snack");

	static MealRule snack_ADULT_fruitgrain = MealRule.create("snack_ADULT_fruitgrain")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) )
					    .and(hasAllItems( isFruitItem.or(isGrainItem) ).and( hasAtLeastCountItems( 1, isFruitItem ).and( hasAtLeastCountItems( 1, isGrainItem ) ) ) )
					  )
			.whenNot( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS )		  
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					)
			.thenFail( "Adults must have 1/2 cup fruit and 1 oz grains for snack");
	
	//----------------------------------------------------------------------------------------------------------------	
	// OTHER RULES
	static MealRule noInfantFoods = MealRule.create("noInfantFoods")
			.appliesTo( isNonInfant )
			.when( hasAnyItem( isFor0_5MO ) )
			.thenFail( "Infant items can only be served to ages < 1yr" );

	
	static MealRule warnOnlyMeatSubThreeTimePerWeek = MealRule.create("warnOnlyMeatSubThreeTimePerWeek")
			.appliesTo( isNonInfant.and( isBreakfast ) )
			.when( hasAnyItem( isMeatOrAlt).and( hasNoItems(isGrainItem) ) )
			.thenWarn( "Meat can only be used as a substitute for grains/breads up to 3 times per week" );
	

	// TODO
	static MealRule noFlavoredUnderSix = MealRule.create( "noFlavoredUnderSix" )
			.appliesTo( isUnder6YearsOld.and( hasFluidMilkComponent) ) 
			.when( hasFlavoredMilkComponent )
			.thenFail( "Flavored milk is not allowed for children under age six" );

	// TODO
	static MealRule mustHaveFlavoredFatFree = MealRule.create( "mustHaveFlavoredFatFree" )
			.appliesTo( is6OrOver.and( hasFlavoredMilkComponent) ) 
			.when( hasLowFatOrFatFreeMilkComponent.negate() )
			.thenFail( "Flavored milk must be low-fat/fat-free" );	
	
	
	static List<MealRule> RULES = Arrays.asList( 
			noInfantFoods,
			warnOnlyMeatSubThreeTimePerWeek,
			noFlavoredUnderSix,
			mustHaveFlavoredFatFree,
			
			breakfast_1_2YR,
			lunchdinner_1_2YR,
			snack_1_2YR_items,
			snack_1_2YR_milkveg,
			snack_1_2YR_milkmeat,
			snack_1_2YR_milkfruit,
			snack_1_2YR_milkgrain,
			snack_1_2YR_vegmeat,
			snack_1_2YR_vegfruit,
			snack_1_2YR_veggrain,
			snack_1_2YR_meatfruit,
			snack_1_2YR_meatgrain,
			snack_1_2YR_fruitgrain,
			
			breakfast_3_5YR,
			lunchdinner_3_5YR,
			snack_3_5YR_items,
			snack_3_5YR_milkveg,
			snack_3_5YR_milkmeat,
			snack_3_5YR_milkfruit,
			snack_3_5YR_milkgrain,
			snack_3_5YR_vegmeat,
			snack_3_5YR_vegfruit,
			snack_3_5YR_veggrain,
			snack_3_5YR_meatfruit,
			snack_3_5YR_meatgrain,
			snack_3_5YR_fruitgrain,
			
			breakfast_6_18YR,
			lunchdinner_6_18YR,
			snack_6_18YR_items,
			snack_6_18YR_milkveg,
			snack_6_18YR_milkmeat,
			snack_6_18YR_milkfruit,
			snack_6_18YR_milkgrain,
			snack_6_18YR_vegmeat,
			snack_6_18YR_vegfruit,
			snack_6_18YR_veggrain,
			snack_6_18YR_meatfruit,
			snack_6_18YR_meatgrain,
			snack_6_18YR_fruitgrain,

			breakfast_ADULT,
			lunch_ADULT,
			dinner_ADULT,
			snack_ADULT_items,
			snack_ADULT_milkveg,
			snack_ADULT_milkmeat,
			snack_ADULT_milkfruit,
			snack_ADULT_milkgrain,
			snack_ADULT_vegmeat,
			snack_ADULT_vegfruit,
			snack_ADULT_veggrain,
			snack_ADULT_meatfruit,
			snack_ADULT_meatgrain,
			snack_ADULT_fruitgrain
	);
}
