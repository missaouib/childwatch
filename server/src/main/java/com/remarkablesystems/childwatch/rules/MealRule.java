package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

public class MealRule extends Rule<Meal,List<MealFoodItem>,MealRuleViolation>{
	
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
		return "[" + getName() +"]";
	}

	
	// BREAKFAST RULES
	static MealRule breakfast_1_2YR_MILK = MealRule.create("breakfast_1_2YR_MILK")
		.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isBreakfast ) )
		.when( mustHave( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ))
		.thenFail( "Ages 1-2 must have 1/2 cup whole milk for breakfast");

	static MealRule breakfast_3_5YR_MILK = MealRule.create( "breakfast_3_5YR_MILK" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isBreakfast ) )
			.when( mustHave( isLowFatOrFatFreeMilkItem, 0.75, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 3-5 must have 3/4 cup low fat milk for breakfast" );

	static MealRule breakfast_Over6YR_MILK = MealRule.create( "breakfast_Over6YR_MILK" )
			.appliesTo( is6OrOver.and( isBreakfast ) )
			.when( mustHave( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6, must have 1 cup low fat milk for breakfast" );

	static MealRule breakfast_1_2YR_VEGFRUIT = MealRule.create("breakfast_1_2YR_VEGFRUIT")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isBreakfast ) )
			.when( mustHave( isVegOrFruitItem, 0.25, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 1-2 must have 1/4 cup fruit and/or vegetables for breakfast");
	
	static MealRule breakfast_Over2_VEGFRUIT = MealRule.create("breakfast_Over2_VEGFRUIT")
			.appliesTo( isOver2YearsOld.and( isBreakfast ) )
			.when( mustHave( isVegOrFruitItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 3+ must have 1/2 cup fruit and/or vegetables for breakfast");
	
	static MealRule breakfast_1_2YR_GRAIN = MealRule.create("breakfast_1_2YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isBreakfast ) )
			.when( mustHave( isGrainOrBreadItem.or( isMeatItem ), 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain or meat/alternative for breakfast");

	static MealRule breakfast_3_5YR_GRAIN = MealRule.create("breakfast_3_5YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isBreakfast ) )
			.when( mustHave( isGrainOrBreadItem.or( isMeatItem ), 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain or meat/alternative for breakfast");

	static MealRule breakfast_6_18YR_GRAIN = MealRule.create("breakfast_6_18YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or(isAgeGroup(AgeGroup.AGE_13_18YR)).and( isBreakfast ) )
			.when( mustHave( isGrainOrBreadItem.or( isMeatItem ), 1, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 6-18 must have 1 oz eq grain or meat/alternative for breakfast");

	static MealRule breakfast_ADULT_GRAIN = MealRule.create("breakfast_ADULT_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isBreakfast ) )
			.when( mustHave( isGrainOrBreadItem.or( isMeatItem ), 2, UnitOfMeasure.OUNCES ))
			.thenFail( "Adults must have 2 oz eq grain or meat/alternative for breakfast");
	
	// LUNCH/DINNER RULES
	static MealRule lunchdinner_1_2YR_MILK = MealRule.create("lunchdinner_1_2YR_MILK")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isLunchOrDinner ) )
			.when( mustHave( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk for lunch/dinner");
	
	static MealRule lunchdinner_3_5YR_MILK = MealRule.create( "lunchdinner_3_5YR_MILK" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isLunchOrDinner ) )
			.when( mustHave( isLowFatOrFatFreeMilkItem,  0.75, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 3-5 must have 3/4 cup low fat milk for lunch/dinner" );

	static MealRule lunchdinner_6_18YR_MILK = MealRule.create( "lunchdinner_6_18YR_MILK" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup( AgeGroup.AGE_13_18YR) ).and( isLunchOrDinner ) )
			.when( mustHave( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6, must have 1 cup low fat milk for lunch/dinner" );

	static MealRule lunchdinner_1_2YR_MEAT = MealRule.create("lunchdinner_1_2YR_MEAT")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isLunchOrDinner ) )
			.when( mustHave( isMeatItem, 1, UnitOfMeasure.OUNCES ) )
			.thenFail( "Ages 1-2 must have 1 oz meat/alternate for lunch/dinner");

	static MealRule lunchdinner_3_5YR_MEAT = MealRule.create( "lunchdinner_3_5YR_MEAT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isLunchOrDinner ) )
			.when( mustHave( isMeatItem, 1.5, UnitOfMeasure.OUNCES ) )
			.thenFail( "Ages 3-5 must have 1 1/2 oz meat/alternate for lunch/dinner" );

	static MealRule lunchdinner_Over6YR_MEAT = MealRule.create( "lunchdinner_Over6YR_MEAT" )
			.appliesTo( is6OrOver.and( isLunchOrDinner ) )
			.when( mustHave( isMeatItem, 2, UnitOfMeasure.OUNCES ) )
			.thenFail( "Over age 6, must have 2 oz meat/alternate for lunch/dinner" );

	static MealRule lunchdinner_1_2YR_VEG = MealRule.create("lunchdinner_1_2YR_VEG")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isLunchOrDinner ) )
			.when( mustHave( isVegItem, 0.125, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 1-2 must have 1/8 cup vegetables for lunch/dinner");

	static MealRule lunchdinner_3_5YR_VEG = MealRule.create( "lunchdinner_3_5YR_VEG" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isLunchOrDinner ) )
			.when( mustHave( isVegItem, 0.25, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 3-5 must have 1/4 cup vegetables for lunch/dinner" );

	static MealRule lunchdinner_Over6YR_VEG = MealRule.create( "lunchdinner_Over6YR_VEG" )
			.appliesTo( is6OrOver.and( isLunchOrDinner ) )
			.when( mustHave( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Over age 6, must have 1/2 cup vegetables for lunch/dinner" );

	static MealRule lunchdinner_1_2YR_FRUIT = MealRule.create("lunchdinner_1_2YR_FRUIT")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isLunchOrDinner ) )
			.when( mustHave( isFruitItem, 0.125, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 1-2 must have 1/8 cup fruit for lunch/dinner");

	static MealRule lunchdinner_3_5YR_FRUIT = MealRule.create( "lunchdinner_3_5YR_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isLunchOrDinner ) )
			.when( mustHave( isFruitItem, 0.25, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 3-5 must have 1/4 cup fruit for lunch/dinner" );

	static MealRule lunchdinner_6_18YR_FRUIT= MealRule.create( "lunchdinner_6_18YR_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup( AgeGroup.AGE_13_18YR) ).and( isLunchOrDinner ) )
			.when( mustHave( isFruitItem, 0.25, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6 must have 1/4 cup fruit for lunch/dinner" );

	static MealRule lunchdinner_ADULT_FRUIT= MealRule.create( "lunchdinner_ADULT_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isLunchOrDinner ) )
			.when( mustHave( isFruitItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Adults must have 1/2 cup fruit for lunch/dinner" );
	
	static MealRule lunchdinner_1_2YR_GRAIN = MealRule.create("lunchdinner_1_2YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isLunchOrDinner ) )
			.when( mustHave( isGrainOrBreadItem, 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain for lunch/dinner");

	static MealRule lunchdinner_3_5YR_GRAIN = MealRule.create("lunchdinner_3_5YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isLunchOrDinner ) )
			.when( mustHave( isGrainOrBreadItem, 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain for lunch/dinner");

	static MealRule lunchdinner_6_18YR_GRAIN = MealRule.create("lunchdinner_6_18YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or(isAgeGroup(AgeGroup.AGE_13_18YR)).and( isLunchOrDinner ) )
			.when( mustHave( isGrainOrBreadItem, 1, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 6-18 must have 1 oz eq grain for lunch/dinner");

	static MealRule lunchdinner_ADULT_GRAIN = MealRule.create("lunchdinner_ADULT_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isLunchOrDinner ) )
			.when( mustHave( isGrainOrBreadItem, 2, UnitOfMeasure.OUNCES ) )
			.thenFail( "Adults must have 2 oz eq grain or meat/alternative for lunch/dinner");

	// SNACK RULES
	static MealRule snack_Pick2 = MealRule.create( "snack_Pick2" )
			.appliesTo( isNonInfant.and( isSnack ) )
			.when( hasAtLeastCountItems( 2, isMilkItem.or(isMeatItem).or(isVegItem).or(isFruitItem).or(isGrainOrBreadItem) ) )
			.thenFail( "Snacks must contain at least 2 items from milk, meat, vegetables, fruit, or grains" );

	static MealRule snack_1_2YR_MILK = MealRule.create("snack_1_2YR_MILK")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isSnack ) )
			.when( ifHas( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 1-2 must have 1/2 cup whole milk for snack");

	static MealRule snack_3_5YR_MILK = MealRule.create("snack_3_5YR_MILK")
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isSnack ) )
			.when( ifHas( isWholeMilkItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Ages 3-5 must have 1/2 cup whole milk for snack");
	
	static MealRule snack_Over6YR_MILK = MealRule.create( "snack_Over6YR_MILK" )
			.appliesTo( is6OrOver.and( isSnack ) )
			.when( mustHave( isLowFatOrFatFreeMilkItem, 1, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6, must have 1 cup low fat milk for snack" );

	static MealRule snack_1_2YR_MEAT = MealRule.create("snack_1_2YR_MEAT")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isSnack ) )
			.when( mustHave( isMeatItem, 0.5, UnitOfMeasure.OUNCES ) )
			.thenFail( "Ages 1-2 must have 1/2 oz meat/alternate for snack");

	static MealRule snack_3_5YR_MEAT = MealRule.create( "snack_3_5YR_MEAT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isSnack ) )
			.when( mustHave( isMeatItem, 0.5, UnitOfMeasure.OUNCES ) )
			.thenFail( "Ages 3-5 must have 1/2 oz meat/alternate for snack" );

	static MealRule snack_Over6YR_MEAT = MealRule.create( "snack_Over6YR_MEAT" )
			.appliesTo( is6OrOver.and( isSnack ) )
			.when( mustHave( isMeatItem, 1, UnitOfMeasure.OUNCES ) )
			.thenFail( "Over age 6, must have 1 oz meat/alternate for snack" );

	static MealRule snack_1_2YR_VEG = MealRule.create("snack_1_2YR_VEG")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isSnack ) )
			.when( mustHave( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 1-2 must have 1/2 cup vegetables for snack");

	static MealRule snack_3_5YR_VEG = MealRule.create( "snack_3_5YR_VEG" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isSnack ) )
			.when( mustHave( isVegItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 3-5 must have 1/2 cup vegetables for snack" );

	static MealRule snack_6_18YR_VEG = MealRule.create( "snack_6_18YR_Veg" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup( AgeGroup.AGE_13_18YR) ).and( isSnack ) )
			.when( mustHave( isVegItem, 0.75, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6 must have 3/4 cup vegetables for snack" );

	static MealRule snack_ADULT_VEG = MealRule.create( "snack_ADULT_VEG" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isSnack ) )
			.when( mustHave( isVegItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Adults must have 1/2 cup vegetables for snack" );

	static MealRule snack_1_2YR_FRUIT = MealRule.create("snack_1_2YR_FRUIT")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isSnack ) )
			.when( mustHave( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 1-2 must have 1/2 cup fruit for snack");

	static MealRule snack_3_5YR_FRUIT = MealRule.create( "snack_3_5YR_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isSnack ) )
			.when( mustHave( isFruitItem, 0.5, UnitOfMeasure.CUPS ) )
			.thenFail( "Ages 3-5 must have 1/2 cup fruit for snack" );

	static MealRule snack_6_18YR_FRUIT= MealRule.create( "snack_6_18YR_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or( isAgeGroup( AgeGroup.AGE_13_18YR) ).and( isSnack ) )
			.when( mustHave( isFruitItem, 0.75, UnitOfMeasure.CUPS ))
			.thenFail( "Over age 6 must have 3/4 cup fruit for snack" );

	static MealRule snack_ADULT_FRUIT= MealRule.create( "snack_ADULT_FRUIT" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isSnack ) )
			.when( mustHave( isFruitItem, 0.5, UnitOfMeasure.CUPS ))
			.thenFail( "Adults must have 1/2 cup fruit for snack" );
	
	static MealRule snack_1_2YR_GRAIN = MealRule.create("snack_1_2YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR ).and( isSnack ) )
			.when( mustHave( isGrainOrBreadItem, 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain for snack");

	static MealRule snack_3_5YR_GRAIN = MealRule.create("snack_3_5YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_3_5YR ).and( isSnack ) )
			.when( mustHave( isGrainOrBreadItem, 0.5, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 1-2 must have 1/2 oz eq grain for snack");

	static MealRule snack_6_18YR_GRAIN = MealRule.create("snack_6_18YR_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_12YR ).or(isAgeGroup(AgeGroup.AGE_13_18YR)).and( isBreakfast ) )
			.when( mustHave( isGrainOrBreadItem, 1, UnitOfMeasure.OUNCES ))
			.thenFail( "Ages 6-18 must have 1 oz eq grain for snack");

	static MealRule snack_ADULT_GRAIN = MealRule.create("snack_ADULT_GRAIN")
			.appliesTo( isAgeGroup( AgeGroup.AGE_ADULT ).and( isSnack ) )
			.when( mustHave( isGrainOrBreadItem, 1, UnitOfMeasure.OUNCES ) )
			.thenFail( "Adults must have 1 oz eq grain or meat/alternative for snack");

	
	// OTHER RULES
	
	static MealRule warnOnlyMeatSubThreeTimePerWeek = MealRule.create("warnOnlyMeatSubThreeTimePerWeek")
			.appliesTo( isNonInfant.and( isBreakfast ) )
			.when( hasMeatComponent.and( hasGrainBreadComponent.negate() ) )
			.thenWarn( "Meat can only be used as a substitute for grains/breads up to 3 times per week" );
	
	
	static MealRule noFlavoredUnderSix = MealRule.create( "noFlavoredUnderSix" )
			.appliesTo( isUnder6YearsOld.and( hasFluidMilkComponent) ) 
			.when( hasFlavoredMilkComponent )
			.thenFail( "Flavored milk is not allowed for children under age six" );

	static MealRule mustHaveFlavoredFatFree = MealRule.create( "mustHaveFlavoredFatFree" )
			.appliesTo( is6OrOver.and( hasFlavoredMilkComponent) ) 
			.when( hasLowFatOrFatFreeMilkComponent.negate() )
			.thenFail( "Flavored milk must be fat-free" );	
	
	
	static List<MealRule> RULES = Arrays.asList( );
}
