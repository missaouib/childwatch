package com.remarkablesystems.childwatch.rules;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;

public class MealRuleViolation extends RuleViolation {
	
	String mealId;
	AgeGroup ageGroup;
	
	public MealRuleViolation() {
		super( RuleViolationSeverity.FAIL, "Unknown Error", null );
	}

	public MealRuleViolation(RuleViolationSeverity severity, String message, IRule rule, String mealId ) {
		super(severity, message, rule);
		this.mealId = mealId;
	}
	
	public String getMealId() {
		return this.mealId;
	}	
	
	public void setMealId( String mealId ) {
		this.mealId = mealId;
	}
	
	public AgeGroup getAgeGroup() {
		return this.ageGroup;
	}
	
	public void setAgeGroup( AgeGroup ageGroup ) {
		this.ageGroup = ageGroup;
	}
}
