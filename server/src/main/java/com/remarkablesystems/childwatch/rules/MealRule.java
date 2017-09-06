package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;

import static com.remarkablesystems.childwatch.rules.MealRulePredicate.*;

import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

public class MealRule extends Rule<Meal,List<MealFoodItem>,MealRuleViolation>{
	
	String name;

	static MealRule create( String name ) { return  new MealRule( name ); };
	
	
	private MealRule( String name ) {
		this.name = name;
	}
	
	
	public String getName() {
		return this.name;
	}
	
	public MealRule when( BiPredicate<Meal,List<MealFoodItem>> pred) {
		super.when( pred );
		return this;
	}
	
	public MealRule thenFail() {
		return then( RuleViolationSeverity.FAIL );
	}
	
	public MealRule then( RuleViolationSeverity severity ) {
		return (MealRule)super.then( (meal,mealFoodItemList) -> new MealRuleViolation( severity, Messages.getString( "rule." + this.getName() ), this, meal.getId() ) );
	}
	
	public MealRuleViolation evaluate( Meal meal, List<MealFoodItem> mealFoodItems ) {
		return super.evaluate(meal,mealFoodItems);
	}
	
	static MealRule mustHaveMilk = MealRule.create("mustHaveMilk")
			.when( (meal,mealFoodItems) -> mealFoodItems.stream().anyMatch( hasMilkItem.negate() ) ).thenFail();
	
	static MealRule shouldHaveThreeItems = MealRule.create( "shouldHaveThreeItems" )
			.when( (meal,mealFoodItems) -> mealFoodItems.size() >= 3 ).then(RuleViolationSeverity.INFO );
	
	static List<MealRule> MEAL_RULES = Arrays.asList(MealRule.mustHaveMilk, MealRule.shouldHaveThreeItems );
}
