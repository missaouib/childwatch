package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;

import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;

public class RulesTestUtils {
	
	public static FoodItem BREASTMILK = new FoodItem( "breastmilk", "breastmilk", Arrays.asList( "INFANT", "MILK" ) );	
	public static FoodItem FORMULA = new FoodItem( "formula", "iron fortified formula", Arrays.asList( "INFANT", "MILK" ) );
	public static FoodItem INFANT_CEREAL = new FoodItem( "cereal", "infant cereal", Arrays.asList( "INFANT", "CEREAL" ) );
	public static FoodItem INFANT_CORN = new FoodItem( "infant corn", "infant corn", Arrays.asList( "INFANT", "VEGETABLE" ) );	
	public static FoodItem INFANT_PEACHES = new FoodItem( "infant peaches", "infant peaches", Arrays.asList( "INFANT", "FRUIT" ) );
	public static FoodItem INFANT_MEAT = new FoodItem( "infant meat", "infant meat", Arrays.asList( "INFANT", "MEAT" ) );
	public static FoodItem INFANT_BREAD = new FoodItem( "infant bread", "infant bread", Arrays.asList( "INFANT", "BREAD" ) );
	public static FoodItem INFANT_CRACKER = new FoodItem( "infant cracker", "infant cracker", Arrays.asList( "INFANT", "CRACKER" ) );
	public static FoodItem INFANT_FRUITJUICE = new FoodItem( "infant fruit juice", "infant fruit juice", Arrays.asList( "INFANT", "FRUIT" ) );
	public static FoodItem INFANT_CHEESE = new FoodItem( "infant cheese", "infant cheese", Arrays.asList( "INFANT", "CHEESE" ) );
	public static FoodItem INFANT_CHEESESPREAD = new FoodItem( "infant cheesespread", "infant cheesespread", Arrays.asList( "INFANT", "CHEESESPREAD" ) );

	public static FoodItem SKIMMILK = new FoodItem( "skim milk", "skim milk", Arrays.asList( "MILK" ) );	
	public static FoodItem WHOLEMILK = new FoodItem( "whole milk", "whole milk", Arrays.asList( "MILK" ) );	
	public static FoodItem CHOCOLATEMILK = new FoodItem( "skim chocolate milk", "skim chocolate milk", Arrays.asList( "MILK" ) );	
	public static FoodItem CEREAL = new FoodItem( "cereal", "cereal", Arrays.asList( "GRAIN", "CEREAL" ) );
	public static FoodItem CORN = new FoodItem( "corn", "corn", Arrays.asList( "VEGETABLE" ) );	
	public static FoodItem PEACHES = new FoodItem( "peaches", "peaches", Arrays.asList( "FRUIT" ) );
	public static FoodItem MEAT = new FoodItem( "meat", "meat", Arrays.asList( "MEAT" ) );
	public static FoodItem BREAD = new FoodItem( "bread", "bread", Arrays.asList( "GRAIN", "BREAD" ) );
	public static FoodItem CRACKER = new FoodItem( "cracker", "cracker", Arrays.asList( "GRAIN", "CRACKER" ) );
	public static FoodItem FRUITJUICE = new FoodItem( "fruit juice", "fruit juice", Arrays.asList( "FRUIT" , "JUICE") );
	public static FoodItem CHEESE = new FoodItem( "cheese", "cheese", Arrays.asList( "CHEESE" ) );
	public static FoodItem CHEESESPREAD = new FoodItem( "cheesespread", "cheesespread", Arrays.asList( "CHEESESPREAD" ) );

	
	public static Meal BREAKFAST = new Meal( "BREAKFAST", "BREAKFAST", MealType.BREAKFAST );
	public static Meal SNACK = new Meal( "SNACK", "SNACK", MealType.AM_SNACK );
	public static Meal LUNCH = new Meal( "LUNCH", "DINNER", MealType.LUNCH );
	public static Meal DINNER = new Meal( "DINNER", "DINNER", MealType.DINNER );

}
