package com.remarkablesystems.childwatch.rules;


import static org.junit.Assert.*;
import static com.remarkablesystems.childwatch.rules.RulesTestUtils.*;


import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

public class NonInfantRulesTest {
	
	RuleValidatorController ctrl = new RuleValidatorController();
		
	@Test
	public void child1_Breakfast_Valid() {
		
		Meal meal = BREAKFAST;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( CORN, ageGroup, 0.25, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void child1_Breakfast_SumQuantity() {
		
		Meal meal = BREAKFAST;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( CORN, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( PEACHES, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
				);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Breakfast_SubstituteMeat() {
		
		Meal meal = BREAKFAST;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( CORN, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( PEACHES, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( MEAT, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
				);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		
		assertFalse( violations.isEmpty() );
		assertTrue( violations.size() == 1 && violations.get(0).getSeverity() == RuleViolationSeverity.WARN );
	}

	@Test
	public void NonInfant_InfantFoods() {
		
		Meal meal = BREAKFAST;
		AgeGroup ageGroup = AgeGroup.AGE_2YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( INFANT_CORN, ageGroup, 0.25, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void child1_Breakfast_InvalidQuantity() {
		
		Meal meal = BREAKFAST;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 3, UnitOfMeasure.OUNCES, meal ), 
			new MealFoodItem( CORN, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( PEACHES, ageGroup, 0.2, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void child1_LunchDinner_Valid() {
		
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( MEAT, ageGroup, 1, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( CORN, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( PEACHES, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void child1_LunchDinner_TwoVegValid() {
		
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( MEAT, ageGroup, 1, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( CORN, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( POTATOES, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void adultDinner_TwoVegNoMilkValid() {
		
		Meal meal = DINNER;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( POTATOES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 2, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void child1_LunchDinner_SumQuantity() {
		
		Meal meal = DINNER;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( MEAT, ageGroup, 1, UnitOfMeasure.OUNCES, meal ),
				new MealFoodItem( CORN, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( PEACHES, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( BREAD, ageGroup, 0.25, UnitOfMeasure.OUNCES, meal ), 
				new MealFoodItem( CRACKER, ageGroup, 0.25, UnitOfMeasure.OUNCES, meal ) 
				);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_LunchDinner_InvalidQuantity() {
		
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( MEAT, ageGroup, 1, UnitOfMeasure.OUNCES, meal ),
				new MealFoodItem( CORN, ageGroup, 1, UnitOfMeasure.TABLESPOONS, meal ), 
				new MealFoodItem( PEACHES, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void child1_LunchDinner_SkimMilk() {
		
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( SKIMMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( MEAT, ageGroup, 1, UnitOfMeasure.OUNCES, meal ),
				new MealFoodItem( CORN, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( PEACHES, ageGroup, 0.145, UnitOfMeasure.CUPS, meal ), 
				new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMilkMeat() {
		
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( MEAT, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMilkVeg() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMilkFruit() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMilkGrain() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMeatVeg() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( MEAT, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMeatFruit() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( MEAT, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidMeatGrain() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( MEAT, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidVegFruit() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_InvalidVegVeg() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( POTATOES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_InvalidVegVegSame() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void child1_Snack_ValidVegGrain() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ValidFruitGrain() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_MissingItem() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_ExtraItem() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( BREAD, ageGroup, 0.5, UnitOfMeasure.OUNCES, meal ),
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void child1_Snack_InvalidQuantitiesMilkFruit() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( PEACHES, ageGroup, 0.25, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void adultLunch_Valid() {
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( SKIMMILK, ageGroup, 1, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),			
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),						
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CRACKER, ageGroup, 2, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void adultLunch_InvalidWithNoMilk() {
		Meal meal = LUNCH;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),			
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),						
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CRACKER, ageGroup, 2, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);

		assertFalse( violations.isEmpty() );

	}

	@Test
	public void adultDinner_ValidWithMilk() {
		Meal meal = DINNER;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( SKIMMILK, ageGroup, 1, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),			
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),						
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CRACKER, ageGroup, 2, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void adultDinner_ValidWithNoMilk() {
		Meal meal = DINNER;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),			
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),						
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CRACKER, ageGroup, 2, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);

		assertTrue( violations.isEmpty() );

	}
	
	@Test
	public void adultDinner_ValidWithChocolateMilk() {
		Meal meal = DINNER;
		AgeGroup ageGroup = AgeGroup.AGE_ADULT;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( CHOCOLATEMILK, ageGroup, 1, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( MEAT, ageGroup, 2, UnitOfMeasure.OUNCES, meal ),			
			new MealFoodItem( CORN, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),						
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( CRACKER, ageGroup, 2, UnitOfMeasure.OUNCES, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void child1_Snack_MilkFruitJuice() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( FRUITJUICE, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	public void child1_Snack_MilkVegJuice() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( VEGJUICE, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	public void child1_Snack_MilkFruitVegJuice() {
		Meal meal = SNACK;
		AgeGroup ageGroup = AgeGroup.AGE_1YR;
		
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( WHOLEMILK, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ), 
			new MealFoodItem( VEGJUICE, ageGroup, 0.5, UnitOfMeasure.CUPS, meal ),
			new MealFoodItem( PEACHES, ageGroup, 0.5, UnitOfMeasure.CUPS, meal )
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(meal, ageGroup, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

}
