package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;
import java.util.function.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.InfantRule.*;

import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.menu.MenuController;

public class MealRule extends Rule<Meal,List<MealFoodItem>,MealRuleViolation>{
	
	static Logger logger = LoggerFactory.getLogger(MealRule.class.getName());
	
	static Predicate<MealFoodItem> isGrainItem = hasTag( "GRAIN" ).and( hasTag( "BAKED" ).negate() );
	
	static Predicate<MealFoodItem> isMeatOrAlt = hasTag( "MEAT").or( hasTag("MEATALT") );
	
	static Predicate<MealFoodItem> isYogurt = hasTag( "YOGURT" );

	static BiPredicate<Meal,List<MealFoodItem>> isNonInfant = isAgeGroup( AgeGroup.AGE_1YR )
															  .or( isAgeGroup( AgeGroup.AGE_2YR) )
															  .or( isAgeGroup( AgeGroup.AGE_3_5YR ) )
															  .or( isAgeGroup( AgeGroup.AGE_6_12YR ) )
															  .or(isAgeGroup( AgeGroup.AGE_13_18YR ))
															  .or(isAgeGroup( AgeGroup.AGE_ADULT ));

	static BiPredicate<Meal,List<MealFoodItem>> isAge6_18 = isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup(AgeGroup.AGE_13_18YR ) );
	
	
	
	static Predicate<MealFoodItem> isForAgeGroup( AgeGroup ageGroup ){ 
		if( ageGroup == AgeGroup.AGE_0_5MO ) {
			return hasTag( ageGroup.toString() );
		}
		else if( ageGroup == AgeGroup.AGE_6_11MO || ageGroup == AgeGroup.AGE_1YR ) {
			return hasTag( ageGroup.toString() ).or( hasTag( "AGE_GT_6MO") ).or(hasNoAgeTags);
		}
		else{
			return hasTag( ageGroup.toString() ).or( hasTag( "AGE_GT_6MO") ).or(hasTag("AGE_GT_2YR")).or(hasNoAgeTags);
		}
	}
	
	
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
		
		if( violation != null ) logger.info( this.toString() + " violation" );
		return violation;
	}
	
	public String toString() {
		return "Rule: [" + getName() +"]";
	}
	
	//----------------------------------------------------------------------------------------------------------------
	// 1 Year olds
	static MealRule breakfast_1YR = MealRule.create("breakfast_1YR")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_1YR ) ) )
		.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_1YR ) )  
				  .and( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.25, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 0.5, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "1yr olds must have 1/2 cup whole milk, 1/4 cup vegetables/fruit, and 1/2 ounce of grain or meat/alternative for breakfast");

	static MealRule lunchsupper_1YR = MealRule.create("lunchsupper_1YR")
			.appliesTo( isLunchOrSupper.and( isAgeGroup( AgeGroup.AGE_1YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_1YR ) ) 
					  .and( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.125, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.125, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 0.25, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )					  
					)
			.thenFail( "1yr olds must have 1/2 cup whole milk, 1 oz of meat/alternative, 1/8 cup vegetables, 1/8 cup fruit, or 1/4 cup total of two different vegetables, and 1/2 oz of grains for lunch/supper");
	
	static MealRule snack_1YR = MealRule.create("snack_1YR")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_1YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_1YR ) ) 
					  .and( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )												
							.or( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ).and( hasAtLeastCountItems( 1, isVegItem.or(isFruitItem).and(isJuice.negate()))) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
						)
					 )
			.thenFail( "1Yr olds must have a snack consisting of at least 2 of 1/2 cup whole milk, 1/2 oz meat/alternative, 1/2 cup vegetable, 1/2 cup fruit or 1 cup total of two different vegetables, and 1/2 oz grain.  Only one of two components may be a beverage.");

	//----------------------------------------------------------------------------------------------------------------
	// 2 Year olds
	static MealRule breakfast_2YR = MealRule.create("breakfast_2YR")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_2YR ) ) )
		.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_2YR ) )
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.25, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 0.5, UnitOfMeasure.OUNCES ) )				  
				)
		.thenFail( "2yr olds must have 1/2 cup low-fat/fat-free milk, 1/4 cup vegetables/fruit, and 1/2 ounce of grain or meat/alternative for breakfast");

	static MealRule lunchsupper_2YR = MealRule.create("lunchsupper_2YR")
			.appliesTo( isLunchOrSupper.and( isAgeGroup( AgeGroup.AGE_2YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_2YR ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.125, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.125, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 0.25, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )					  
					)
			.thenFail( "2yr olds must have 1/2 cup low-fat/fat-free milk, 1 oz of meat/alternative, 1/8 cup vegetables, 1/8 cup fruit, or 1/4 cup total of two different vegetables, and 1/2 oz of grains for lunch/supper");
	
	static MealRule snack_2YR = MealRule.create("snack_2YR")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_2YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_2YR ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )												
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ).and( hasAtLeastCountItems( 1, isVegItem.or(isFruitItem).and(isJuice.negate()))) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
						)
					 )
			.thenFail( "2yr olds must have a snack consisting of at least 2 of 1/2 cup low-fat/fat-free milk, 1/2 oz meat/alternative, 1/2 cup vegetable, 1/2 cup fruit or 1 cup total of two different vegetables, and 1/2 oz grain.  Only one of two components may be a beverage.");

	

	//----------------------------------------------------------------------------------------------------------------
	// 3-5 Year olds
	static MealRule breakfast_3_5YR = MealRule.create("breakfast_3_5YR")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
		.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_3_5YR ) )   
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.75, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 0.5, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Ages 3-5 must have 3/4 cup fat-free/low-fat milk, 1/2 cup vegetables and/or fruit, and 1/2 oz grain or meat alternative for breakfast.");

	static MealRule lunchsupper_3_5YR = MealRule.create("lunchsupper_3_5YR")
			.appliesTo( isLunchOrSupper.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_3_5YR ) )    
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.75, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 1.5, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.25, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.25, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )					  

					)
			.thenFail( "Ages 3-5 must have 3/4 cup fat-free/low-fat milk, 1 1/2 oz of meat/alternative, 1/4 cup vegetables, 1/4 cup fruit or 1/2 cup total of two different vegetables, and 1/2 oz grain for lunch/supper");
	
	static MealRule snack_3_5YR = MealRule.create("snack_3_5YR")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_3_5YR ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_3_5YR ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ) )												
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 0.5, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ).and( hasAtLeastCountItems( 1, isVegItem.or(isFruitItem).and(isJuice.negate()))) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 0.5, UnitOfMeasure.OUNCES ) ) )
						)
					 )
			.thenFail( "Ages 3-5 must have a snack consisting of at least 2 of 1/2 cup low-fat/fat-free milk, 1/2 oz meat/alternative, 1/2 cup vegetable, 1/2 cup fruit or 1 cup total of two different vegetables and 1/2 oz grain.  Only one of two components may be a beverage.");

	//----------------------------------------------------------------------------------------------------------------
	// 6-18 Year olds
	static MealRule breakfast_6_18YR = MealRule.create("breakfast_6_18YR")
		.appliesTo( isBreakfast.and( isAge6_18 ) )
		.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_6_12YR ).or( isForAgeGroup( AgeGroup.AGE_13_18YR) ) )  
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 1, UnitOfMeasure.OUNCES ) )
				)
		.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk, 1/2 cup vegetable and/or fruit, and 1/2 oz grains or meat/alternative for breakfast");

	static MealRule lunchsupper_6_18YR = MealRule.create("lunchsupper_6_18YR")
			.appliesTo( isLunchOrSupper.and( isAge6_18 ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_6_12YR ).or( isForAgeGroup( AgeGroup.AGE_13_18YR) ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.25, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )					  
					)
			.thenFail( "Ages 6-18 must have 1 cup fat-free/low-fat milk, 2 oz of meat/alternative, 1/2 cup vegetable, 1/4 cup fruit, or 3/4 cups total of two different vegetables, and 1 oz grains for lunch/supper ");
	
	static MealRule snack_6_18YR = MealRule.create("snack_6_18YR")
			.appliesTo( isSnack.and( isAge6_18 ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_6_12YR ).or( isForAgeGroup( AgeGroup.AGE_13_18YR) ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )												
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ) ).and( hasAtLeastCountItems( 1, isVegItem.or(isFruitItem).and(isJuice.negate()))) )
							.or( sumHasQuantity( isVegItem, 0.75, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isFruitItem, 0.75, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
						)
					 )
			.thenFail( "Ages 6-18 must have a snack consisting of at least 2 of 1 cup low-fat/fat-free milk, 1 oz meat/alternative, 3/4 cup vegetable, 3/4 cup fruit or 3/4 cups each of two different vegetables, 1 oz grain. Only one of two components may be a beverage.");

	

	//----------------------------------------------------------------------------------------------------------------
	// Adults
	static MealRule breakfast_ADULT = MealRule.create("breakfast_ADULT")
		.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
		.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
				  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
				  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt ), 2, UnitOfMeasure.OUNCES ) )
				  .or(
						  hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
						  .and( sumHasQuantity( isYogurt, 1, UnitOfMeasure.CUPS ) )
						  .and( sumHasQuantity( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
						  .and( sumHasQuantity( isGrainItem.or( isMeatOrAlt), 2, UnitOfMeasure.OUNCES ).and( hasAtLeastCountItemsDistinct(1,isGrainItem.or(isMeatOrAlt.and(isYogurt.negate())) ) ) )						  
				   )
				)
		.thenFail( "Adults must have 1 cup fat-free/low-fat milk (or yogurt), 1/2 cup vegetables and/or fruit, and 2 oz of grains or meat alternative for breakfast");

	
	static MealRule lunch_ADULT = MealRule.create("lunch_ADULT")
			.appliesTo( isLunch.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 1, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )
					  .or(
							  hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
							  .and( sumHasQuantity( isYogurt, 1, UnitOfMeasure.CUPS ) )
							  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ).and( hasAtLeastCountItemsDistinct(1,isMeatOrAlt.and(isYogurt.negate())) ) )
							  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
							  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
									.or( sumHasQuantity( isVegItem, 1, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )							  
					   )
					)
			.thenFail( "Adults must have 1 cup fat-free/low-fat milk (or yogurt), 2oz of meat/alternative, 1/2 cup vegetables, 1/2 cup fruit or 1 cup total of two different vegetables, and 2 oz of grains for lunch");

	static MealRule supper_ADULT = MealRule.create("supper_ADULT")
			.appliesTo( isSupper.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
					  .and( hasNoItems(isLowFatOrFatFreeMilkItem).or( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ) ) )
					  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
					  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
							.or( sumHasQuantity( isVegItem, 1, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) )
					  .or(
							  hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
							  .and( hasNoItems(isYogurt).or( sumHasQuantity( isYogurt, 1, UnitOfMeasure.CUPS ) ) )
							  .and( sumHasQuantity( isMeatOrAlt, 2, UnitOfMeasure.OUNCES ).and( hasAtLeastCountItemsDistinct(1,isMeatOrAlt.and(isYogurt.negate()) ) ) )
							  .and( sumHasQuantity( isGrainItem, 2, UnitOfMeasure.OUNCES ) )
							  .and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
									.or( sumHasQuantity( isVegItem, 1, UnitOfMeasure.CUPS ).and( hasAtLeastCountItemsDistinct( 2, isVegItem ) ) ) ) 					
					  )					  
					)
			.thenFail( "Adults must have 2oz of meat/alternative, 1/2 cup vegetables, 1/2 cup fruit or 1 cup total of two different vegetables, 2 oz of grains, and optionally 1 cup of fat-free/low-fat milk for supper");

	static MealRule snack_ADULT = MealRule.create("snack_ADULT")
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_ADULT ) ) )
			.whenNot( hasAllItems( isForAgeGroup( AgeGroup.AGE_ADULT ) ) 
					  .and( sumHasQuantity( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ) )
							  .or( sumHasQuantity( isYogurt, 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.CUPS ) ).and( hasAtLeastCountItemsDistinct(1,isMeatOrAlt.and(isYogurt.negate()))) )  
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem.or( isYogurt ), 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem.or( isYogurt ), 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isLowFatOrFatFreeMilkItem.or( isYogurt ), 1, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isMeatOrAlt, 1, UnitOfMeasure.OUNCES ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ) ) )
							.or( sumHasQuantity( isVegItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
							.or( sumHasQuantity( isFruitItem, 0.5, UnitOfMeasure.CUPS ).and( sumHasQuantity( isGrainItem, 1, UnitOfMeasure.OUNCES ) ) )
						)
					 )
			.thenFail( "Adults must have a snack consisting of at least 2 of 1 cup low-fat/fat-free milk (or yogurt), 1 oz meat/alternative, 1/2 cup vegetable, 1/2 cup fruit, 1 oz grain");
	
	//----------------------------------------------------------------------------------------------------------------	
	// OTHER RULES
	static MealRule noInfantFoods = MealRule.create("noInfantFoods")
			.appliesTo( isNonInfant )
			.when( hasAnyItem( isFor0_5MO ) )
			.thenFail( "Infant items can only be served to ages < 1yr" );

	
	static MealRule noFlavoredUnderSix = MealRule.create( "noFlavoredUnderSix" )
			.appliesTo( isUnder6YearsOld.and( hasFluidMilkComponent) ) 
			.when( hasFlavoredMilkComponent )
			.thenFail( "Flavored milk is not allowed for children under age six" );

	static MealRule mustHaveFlavoredFatFree = MealRule.create( "mustHaveFlavoredFatFree" )
			.appliesTo( is6OrOver.and( hasFlavoredMilkComponent) ) 
			.whenNot( hasAtLeastCountItems( 1, isFatFreeMilkItem.negate() ) )
			.thenFail( "Flavored milk must be low-fat/fat-free" );
	
	static MealRule noMilkAndJuiceForSnack = MealRule.create( "noMilkAndJuiceForSnack" )
			.appliesTo( isNonInfant.and( isSnack ) )
			.when( hasAllItems( isMilkItem.or(hasTag( "JUICE" ) ) )
				   .and( hasAtLeastCountItems( 1, isMilkItem ) )
				   .and( hasAtLeastCountItems( 1, hasTag("JUICE") ) )
				)
			.thenFail( "Cannot serve milk and juice for snacks" );
	
	static List<MealRule> RULES = Arrays.asList( 
			noInfantFoods,
			noFlavoredUnderSix,
			mustHaveFlavoredFatFree,
			noMilkAndJuiceForSnack,
			
			breakfast_1YR,
			lunchsupper_1YR,
			snack_1YR,

			breakfast_2YR,
			lunchsupper_2YR,
			snack_2YR,
			
			breakfast_3_5YR,
			lunchsupper_3_5YR,
			snack_3_5YR,
			
			breakfast_6_18YR,
			lunchsupper_6_18YR,
			snack_6_18YR,
			
			breakfast_ADULT,
			lunch_ADULT,
			supper_ADULT,
			snack_ADULT
	);
}
