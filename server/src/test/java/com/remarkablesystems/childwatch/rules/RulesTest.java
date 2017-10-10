package com.remarkablesystems.childwatch.rules;


import static org.junit.Assert.*;
import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;
import static com.remarkablesystems.childwatch.rules.InfantRule.*;
import static com.remarkablesystems.childwatch.rules.MealRule.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodComponent;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

public class RulesTest {

	static FoodComponent MILK = new FoodComponent( "MILKIE", "Milk");
	static FoodComponent VEGETABLE = new FoodComponent( "VEG", "Vegetable" );
	static FoodComponent FRUIT = new FoodComponent( "FRUIT", "FRUIT" );
	
	static FoodItem BREASTMILK = new FoodItem( "breastmilk", "breastmilk", MILK, Arrays.asList( "INFANT", "MILK" ) );	
	static FoodItem FORMULA = new FoodItem( "formula", "iron fortified formula", MILK, Arrays.asList( "INFANT", "MILK" ) );
	static FoodItem CEREAL = new FoodItem( "cereal", "infant cereal", null, Arrays.asList( "INFANT", "CEREAL" ) );
	static FoodItem CORN = new FoodItem( "infant corn", "infant corn", VEGETABLE, Arrays.asList( "INFANT", "VEGETABLE" ) );	
	static FoodItem PEACHES = new FoodItem( "infant peaches", "infant peaches", FRUIT, Arrays.asList( "INFANT", "FRUIT" ) );
	static FoodItem MEAT = new FoodItem( "infant meat", "infant meat", MILK, Arrays.asList( "INFANT", "MEAT" ) );
	static FoodItem BREAD = new FoodItem( "infant bread", "infant bread", MILK, Arrays.asList( "INFANT", "BREAD" ) );
	static FoodItem CRACKER = new FoodItem( "infant cracker", "infant cracker", MILK, Arrays.asList( "INFANT", "CRACKER" ) );
	static FoodItem FRUITJUICE = new FoodItem( "infant fruit juice", "infant fruit juice", FRUIT, Arrays.asList( "INFANT", "FRUIT" ) );
	static FoodItem CHEESE = new FoodItem( "infant cheese", "infant cheese", MILK, Arrays.asList( "INFANT", "CHEESE" ) );
	static FoodItem CHEESESPREAD = new FoodItem( "infant cheesespread", "infant cheesespread", MILK, Arrays.asList( "INFANT", "CHEESESPREAD" ) );

	
	static Meal BREAKFAST = new Meal( "BREAKFAST", "BREAKFAST", MealType.BREAKFAST );
	static Meal SNACK = new Meal( "SNACK", "SNACK", MealType.AM_SNACK );
	static Meal LUNCH = new Meal( "LUNCH", "DINNER", MealType.LUNCH );
	static Meal DINNER = new Meal( "DINNER", "DINNER", MealType.DINNER );

	
	RuleValidatorController ctrl = new RuleValidatorController();
	
	MealFoodItem createItem( FoodItem item, AgeGroup ageGroup, double quantity, UnitOfMeasure unit, Meal meal ) {
		MealFoodItem item1 = new MealFoodItem( "item1", item );
		item1.setAgeGroup(ageGroup);
		item1.setMeal(meal);
		item1.setQuantity(quantity);
		item1.setUnit(unit);
		return item1;
	}

	@Test public void infantSetup() {

		List<MealFoodItem> mealFoodItems = Arrays.asList(
				createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, BREAKFAST ) 
			);	

		
		//assertTrue( hasInfantMilk.test( null, mealFoodItems));		
		assertTrue( sumHasQuantityBetween( isInfantMilk, 4, 6, UnitOfMeasure.OUNCES ).test(null, mealFoodItems) );
		
	}
	
	
	@Test
	public void infant0_5Breakfast_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant0_5Breakfast_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, BREAKFAST ), 
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5Breakfast_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 3.9, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	
	@Test
	public void infant0_5Breakfast_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, BREAKFAST ), 
			createItem( CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, BREAKFAST ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Breakfast_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( PEACHES, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11Breakfast_InvalidQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( PEACHES, AgeGroup.AGE_6_11MO, 0.2, UnitOfMeasure.TABLESPOONS, BREAKFAST )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void infant6_11Breakfast_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, BREAKFAST ),
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( PEACHES, AgeGroup.AGE_6_11MO, 0.2, UnitOfMeasure.TABLESPOONS, BREAKFAST ),
			createItem( MEAT, AgeGroup.AGE_6_11MO, 16, UnitOfMeasure.OUNCES, BREAKFAST )			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(BREAKFAST, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void infant0_5Snack_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant0_5Snack_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, SNACK ), 
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 2, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5Snack_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 1, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );		
	}

	
	
	@Test
	public void infant0_5Snack_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, SNACK ), 
			createItem( CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, SNACK ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Snack_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
			createItem( BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11Snack_ValidFruitJuice() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( FRUITJUICE, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ),
			createItem( BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11Snack_ValidCrackers() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( FRUITJUICE, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ), 
			createItem( CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	
	@Test
	public void infant6_11Snack_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( FRUITJUICE, AgeGroup.AGE_6_11MO, 5, UnitOfMeasure.OUNCES, SNACK ),
			createItem( BREAD, AgeGroup.AGE_6_11MO, 0.5, UnitOfMeasure.EACH, SNACK )
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );		
	}

	
	
	@Test
	public void infant6_11Snack_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( FRUITJUICE, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, SNACK ), 
			createItem( CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, SNACK ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.OUNCES, SNACK ) 			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(SNACK, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	@Test
	public void infant0_5LunchDinner_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 5, UnitOfMeasure.OUNCES, DINNER )
		
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	
	@Test
	public void infant0_5LunchDinner_SumQuantities() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 1, UnitOfMeasure.OUNCES, LUNCH ), 
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(LUNCH, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}
	

	
	@Test
	public void infant0_5LunchDinner_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 6.01, UnitOfMeasure.OUNCES, DINNER) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	
	@Test
	public void infant0_5LunchDinner_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ), 
			createItem( CORN, AgeGroup.AGE_0_5MO, 4, UnitOfMeasure.OUNCES, LUNCH ) 
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(LUNCH, AgeGroup.AGE_0_5MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	@Test
	public void infant6_11LunchDinner_Valid() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			createItem( MEAT, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11LunchDinner_ValidNoMeat() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11LunchDinner_ValidCheese() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			createItem( CHEESE, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.OUNCES, DINNER ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11LunchDinner_ValidCheeseSpread() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
			createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
			createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
			createItem( CHEESESPREAD, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, DINNER ),
			createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 			
			
		);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertTrue( violations.isEmpty() );
	}

	@Test
	public void infant6_11LunchDinner_InvalidQuantity() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
				createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
				createItem( CHEESESPREAD, AgeGroup.AGE_6_11MO, 5, UnitOfMeasure.OUNCES, DINNER ),
				createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 							
			);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
	
	@Test
	public void infant6_11LunchDinner_ExtraItems() {
		List<MealFoodItem> mealFoodItems = Arrays.asList(
				createItem( BREASTMILK, AgeGroup.AGE_6_11MO, 7, UnitOfMeasure.OUNCES, DINNER ), 
				createItem( CEREAL, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.TABLESPOONS, DINNER ),
				createItem( CHEESESPREAD, AgeGroup.AGE_6_11MO, 3, UnitOfMeasure.OUNCES, DINNER ),
				createItem( CRACKER, AgeGroup.AGE_6_11MO, 1, UnitOfMeasure.EACH, DINNER ),
				createItem( CORN, AgeGroup.AGE_6_11MO, 4, UnitOfMeasure.TABLESPOONS, DINNER ) 							
			);	
		
		List<RuleViolation> violations = ctrl.doValidation(DINNER, AgeGroup.AGE_6_11MO, mealFoodItems);
		
		assertFalse( violations.isEmpty() );
	}

	
}
