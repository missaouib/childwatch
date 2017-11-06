package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;

import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;

public class RulesTestUtils {
	
	public static FoodItem BREASTMILK = new FoodItem( "breastmilk", "breastmilk", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "MILK" ) );	
	public static FoodItem FORMULA = new FoodItem( "formula", "iron fortified formula", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "MILK" ) );
	public static FoodItem INFANT_CEREAL = new FoodItem( "cereal", "infant cereal", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "CEREAL" ) );
	public static FoodItem INFANT_CORN = new FoodItem( "infant corn", "infant corn", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "VEGETABLE" ) );	
	public static FoodItem INFANT_PEACHES = new FoodItem( "infant peaches", "infant peaches", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "FRUIT" ) );
	public static FoodItem INFANT_MEAT = new FoodItem( "infant meat", "infant meat", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "MEAT" ) );
	public static FoodItem INFANT_BREAD = new FoodItem( "infant bread", "infant bread", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "BREAD" ) );
	public static FoodItem INFANT_CRACKER = new FoodItem( "infant cracker", "infant cracker", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "GRAIN", "CRACKER" ) );
	public static FoodItem INFANT_FRUITJUICE = new FoodItem( "infant fruit juice", "infant fruit juice", Arrays.asList( "AGE_0_5MO", "AGE_6_11MO", "FRUIT", "JUICE" ) );

	public static FoodItem LOWFATMILK = new FoodItem( "Milk, Fluid, Low-Fat or 1%", "Milk, Fluid, Low-Fat or 1%", Arrays.asList( "MILK" ) );
	public static FoodItem SKIMMILK = new FoodItem( "skim milk", "skim milk", Arrays.asList( "MILK" ) );	
	public static FoodItem WHOLEMILK = new FoodItem( "whole milk", "whole milk", Arrays.asList( "MILK" ) );	
	public static FoodItem CHOCOLATEMILK = new FoodItem( "skim chocolate milk", "skim chocolate milk", Arrays.asList( "MILK" ) );	
	public static FoodItem CEREAL = new FoodItem( "cereal", "cereal", Arrays.asList( "GRAIN", "CEREAL" ) );
	public static FoodItem CORN = new FoodItem( "corn", "corn", Arrays.asList( "VEGETABLE" ) );	
	public static FoodItem POTATOES = new FoodItem( "potatoes", "potatoes", Arrays.asList( "VEGETABLE" ) );	
	public static FoodItem PEACHES = new FoodItem( "peaches", "peaches", Arrays.asList( "FRUIT" ) );
	public static FoodItem MEAT = new FoodItem( "meat", "meat", Arrays.asList( "MEAT" ) );
	public static FoodItem BREAD = new FoodItem( "bread", "bread", Arrays.asList( "GRAIN", "BREAD" ) );
	public static FoodItem CRACKER = new FoodItem( "cracker", "cracker", Arrays.asList( "GRAIN", "CRACKER" ) );
	public static FoodItem FRUITJUICE = new FoodItem( "fruit juice", "fruit juice", Arrays.asList( "FRUIT" , "JUICE") );
	public static FoodItem VEGJUICE = new FoodItem( "vegie juice", "vegie juice", Arrays.asList( "VEGETABLE" , "JUICE") );

	
	public static Meal BREAKFAST = new Meal( "BREAKFAST", "BREAKFAST", MealType.BREAKFAST );
	public static Meal SNACK = new Meal( "SNACK", "SNACK", MealType.AM_SNACK );
	public static Meal LUNCH = new Meal( "LUNCH", "DINNER", MealType.LUNCH );
	public static Meal DINNER = new Meal( "DINNER", "DINNER", MealType.DINNER );

}
