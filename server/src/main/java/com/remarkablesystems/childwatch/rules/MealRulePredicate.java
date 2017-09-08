package com.remarkablesystems.childwatch.rules;


import java.util.function.Predicate;

import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

public class MealRulePredicate {

	static Predicate<MealFoodItem> hasMilkItem = 
			(mealFoodItem) -> checkForFoodComponentType( mealFoodItem, "MILK" ) ||
							  checkForFoodComponentType( mealFoodItem, "MILKIE" ) ||
							  checkForFoodComponentType( mealFoodItem, "MILKALT" ); 
	
	
	private static boolean checkForFoodComponentType( MealFoodItem mealFoodItem, String type ) {	

		if( mealFoodItem.getFoodItem() == null )
			System.out.println("item - " + mealFoodItem.getId() + " doenst have a food item" );
		
		
		return mealFoodItem.getFoodItem() != null && 
			   mealFoodItem.getFoodItem().getFoodComponent() != null && 
			   mealFoodItem.getFoodItem().getFoodComponent().getId().equals(type);
	}
}
