package com.remarkablesystems.childwatch.rules;

public class MealRuleViolation extends RuleViolation {
	
	String mealId;
	
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
}
