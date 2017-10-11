package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;

import com.remarkablesystems.childwatch.domain.food.FoodComponent;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;

public class RulesTestUtils {

	public static FoodComponent MILK = new FoodComponent( "MILKIE", "Milk");
	public static FoodComponent VEGETABLE = new FoodComponent( "VEG", "Vegetable" );
	public static FoodComponent FRUIT = new FoodComponent( "FRUIT", "FRUIT" );
	
	public static FoodItem BREASTMILK = new FoodItem( "breastmilk", "breastmilk", MILK, Arrays.asList( "INFANT", "MILK" ) );	
	public static FoodItem FORMULA = new FoodItem( "formula", "iron fortified formula", MILK, Arrays.asList( "INFANT", "MILK" ) );
	public static FoodItem INFANT_CEREAL = new FoodItem( "cereal", "infant cereal", null, Arrays.asList( "INFANT", "CEREAL" ) );
	public static FoodItem INFANT_CORN = new FoodItem( "infant corn", "infant corn", VEGETABLE, Arrays.asList( "INFANT", "VEGETABLE" ) );	
	public static FoodItem INFANT_PEACHES = new FoodItem( "infant peaches", "infant peaches", FRUIT, Arrays.asList( "INFANT", "FRUIT" ) );
	public static FoodItem INFANT_MEAT = new FoodItem( "infant meat", "infant meat", MILK, Arrays.asList( "INFANT", "MEAT" ) );
	public static FoodItem INFANT_BREAD = new FoodItem( "infant bread", "infant bread", MILK, Arrays.asList( "INFANT", "BREAD" ) );
	public static FoodItem INFANT_CRACKER = new FoodItem( "infant cracker", "infant cracker", MILK, Arrays.asList( "INFANT", "CRACKER" ) );
	public static FoodItem INFANT_FRUITJUICE = new FoodItem( "infant fruit juice", "infant fruit juice", FRUIT, Arrays.asList( "INFANT", "FRUIT" ) );
	public static FoodItem INFANT_CHEESE = new FoodItem( "infant cheese", "infant cheese", MILK, Arrays.asList( "INFANT", "CHEESE" ) );
	public static FoodItem INFANT_CHEESESPREAD = new FoodItem( "infant cheesespread", "infant cheesespread", MILK, Arrays.asList( "INFANT", "CHEESESPREAD" ) );

	public static FoodItem SKIMMILK = new FoodItem( "skim milk", "skim milk", MILK, Arrays.asList( "MILK" ) );	
	public static FoodItem WHOLEMILK = new FoodItem( "whole milk", "whole milk", MILK, Arrays.asList( "MILK" ) );	
	public static FoodItem CHOCOLATEMILK = new FoodItem( "skim chocolate milk", "skim chocolate milk", MILK, Arrays.asList( "MILK" ) );	
	public static FoodItem CEREAL = new FoodItem( "cereal", "cereal", null, Arrays.asList( "GRAIN", "CEREAL" ) );
	public static FoodItem CORN = new FoodItem( "corn", "corn", VEGETABLE, Arrays.asList( "VEGETABLE" ) );	
	public static FoodItem PEACHES = new FoodItem( "peaches", "peaches", FRUIT, Arrays.asList( "FRUIT" ) );
	public static FoodItem MEAT = new FoodItem( "meat", "meat", MILK, Arrays.asList( "MEAT" ) );
	public static FoodItem BREAD = new FoodItem( "bread", "bread", MILK, Arrays.asList( "GRAIN", "BREAD" ) );
	public static FoodItem CRACKER = new FoodItem( "cracker", "cracker", MILK, Arrays.asList( "GRAIN", "CRACKER" ) );
	public static FoodItem FRUITJUICE = new FoodItem( "fruit juice", "fruit juice", FRUIT, Arrays.asList( "FRUIT" , "JUICE") );
	public static FoodItem CHEESE = new FoodItem( "cheese", "cheese", MILK, Arrays.asList( "CHEESE" ) );
	public static FoodItem CHEESESPREAD = new FoodItem( "cheesespread", "cheesespread", MILK, Arrays.asList( "CHEESESPREAD" ) );

	
	public static Meal BREAKFAST = new Meal( "BREAKFAST", "BREAKFAST", MealType.BREAKFAST );
	public static Meal SNACK = new Meal( "SNACK", "SNACK", MealType.AM_SNACK );
	public static Meal LUNCH = new Meal( "LUNCH", "DINNER", MealType.LUNCH );
	public static Meal DINNER = new Meal( "DINNER", "DINNER", MealType.DINNER );

}
