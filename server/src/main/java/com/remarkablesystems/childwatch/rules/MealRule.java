package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;

public class MealRule extends Rule<Meal,List<MealFoodItem>,MealRuleViolation>{
	
	String name;

	static MealRule create( String name ) { return  new MealRule( name ); };
	
	
	private MealRule( String name ) {
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
	
	static MealRule mustHaveFluidMilk = MealRule.create("mustHaveMilk")
			.appliesTo( isNonInfant.and( isBreakfast ) )
			.when( hasFluidMilkComponent.negate() ) 
			.thenFail( "Non-infant breakfasts must have a fluid milk component" );
		
		
	static MealRule mustHaveVegetableFruit = MealRule.create("mustHaveVegFruit")
			.appliesTo( isNonInfant.and( isBreakfast ) )
			.when( hasVegFruitComponent.negate() )
			.thenFail( "Non-infant breakfasts must have a Vegetable/Fruit component" );
	
	static MealRule mustHaveGrainBreadOrMeat = MealRule.create("mustHaveGrainBreadOrMeat")
			.appliesTo( isNonInfant.and(isBreakfast ) )
			.when( hasGrainBreadComponent.negate().and( hasMeatComponent.negate() ) )
			.thenFail( "Non-infant breakfasts must have a Grain/Bread or Meat/Meat Alt" );
	
	static MealRule warnOnlyMeatSubThreeTimePerWeek = MealRule.create("warnOnlyMeatSubThreeTimePerWeek")
			.appliesTo( isNonInfant.and( isBreakfast ) )
			.when( hasMeatComponent.and( hasGrainBreadComponent.negate() ) )
			.thenWarn( "Meat can only be used as a substitute for grains/breads up to 3 times per week" );
	
	static MealRule wholeMilkFor1to2YearOlds = MealRule.create( "wholeMilkFor1to2YearOlds" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_1_2YR).and( hasFluidMilkComponent) )
			.when( hasWholeMilkComponent.negate() )
			.thenFail( "After a child’s first birthday and prior to the second birthday, whole milk must be served.");
	
	static MealRule fatFreeSkimAfter2Years = MealRule.create( "fatFreeSkimAfter2Years" )
			.appliesTo( isUnder2YearsOld.negate().and( hasFluidMilkComponent) ) 
			.when( hasLowFatOrFatFreeMilkComponent.negate() )
			.thenFail( "After a child’s second birthday, lowfat (1%) or fat-free (skim) milk must be served" );

	static MealRule noFlavoredUnderSix = MealRule.create( "noFlavoredUnderSix" )
			.appliesTo( isUnder6YearsOld.and( hasFluidMilkComponent) ) 
			.when( hasFlavoredMilkComponent )
			.thenFail( "Flavored milk is not allowed for children under age six" );

	static MealRule mustHaveFlavoredFatFree = MealRule.create( "noFlavoredUnderSix" )
			.appliesTo( isUnder6YearsOld.negate().and( hasFlavoredMilkComponent) ) 
			.when( hasLowFatOrFatFreeMilkComponent.negate() )
			.thenFail( "Flavored milk must be fat-free" );	
		
	static List<MealRule> MEAL_RULES = Arrays.asList( 
			mustHaveFluidMilk, 
			mustHaveVegetableFruit, 
			mustHaveGrainBreadOrMeat, 
			warnOnlyMeatSubThreeTimePerWeek,
			wholeMilkFor1to2YearOlds,
			fatFreeSkimAfter2Years,
			noFlavoredUnderSix,
			mustHaveFlavoredFatFree);
}
