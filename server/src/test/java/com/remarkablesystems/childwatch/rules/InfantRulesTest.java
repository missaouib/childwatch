package com.remarkablesystems.childwatch.rules;


import static org.junit.Assert.*;
import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.InfantRule.*;
import static com.remarkablesystems.childwatch.rules.RulesTestUtils.*;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

public class InfantRulesTest {

	
	RuleValidatorController ctrl = new RuleValidatorController();	
	
	@Test
	public void infant0_5Breakfast_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant0_5Breakfast_InvalidItem() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 3.9, UnitOfMeasure.OUNCES, BREAKFAST ), 
			new MealFoodItem( PEACHES, AgeGroup.AGE_0_5MO, 1, UnitOfMeasure.CUPS, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}


	
	@Test
	public void infant0_5Breakfast_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, BREAKFAST ), 
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5Breakfast_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 3.9, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}	
	
	
	@Test
	public void infant0_5Breakfast_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, BREAKFAST ), 
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Breakfast_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_PEACHES, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11Breakfast_InvalidQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_PEACHES, AgeGroup.AGE_6_11MO, 0.2, UnitOfMeasure.TABLESPOONS, BREAKFAST )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void infant6_11Breakfast_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_PEACHES, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			new MealFoodItem( INFANT_MEAT, AgeGroup.AGE_6_11MO, 12, UnitOfMeasure.LBS, BREAKFAST )			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant0_5Snack_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant0_5Snack_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, SNACK ), 
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5Snack_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 1, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );		
	}

	
	
	@Test
	public void infant0_5Snack_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, SNACK ), 
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Snack_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
			new MealFoodItem( INFANT_BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11Snack_InvalidFruitJuice() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( INFANT_FRUITJUICE, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
			new MealFoodItem( INFANT_BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void infant6_11Snack_ValidCrackers() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
				new MealFoodItem( INFANT_CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, SNACK )
			);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Snack_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( INFANT_PEACHES, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ), 
			new MealFoodItem( INFANT_BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );		
	}

	
	
	@Test
	public void infant6_11Snack_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
			new MealFoodItem( INFANT_CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, SNACK ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.OUNCES, SNACK ) 			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant0_5LunchDinner_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, DINNER )
		
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant0_5LunchDinner_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 1, UnitOfMeasure.OUNCES, LUNCH ), 
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(LUNCH, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5LunchDinner_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 3.99, UnitOfMeasure.OUNCES, DINNER) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	
	@Test
	public void infant0_5LunchDinner_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ), 
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(LUNCH, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant6_11LunchDinner_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			new MealFoodItem( INFANT_MEAT, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11LunchDinner_ValidNoMeat() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}



	@Test
	public void infant6_11LunchDinner_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
				new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.TABLESPOONS, DINNER ),
				new MealFoodItem( INFANT_MEAT, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
				new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	
	@Test
	public void infant6_11LunchDinner_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				new MealFoodItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
				new MealFoodItem( INFANT_CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
				new MealFoodItem( INFANT_CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, DINNER ),
				new MealFoodItem( INFANT_CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 							
			);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
}
