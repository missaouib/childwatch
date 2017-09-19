package com.remarkablesystems.childwatch.rules;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiPredicate;
import java.util.function.Predicate;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

import static com.remarkablesystems.childwatch.rules.MealPredicate.*;
import static com.remarkablesystems.childwatch.rules.MealFoodItemPredicate.*;

public class InfantRule extends MealRule {
	
	static InfantRule create( String name ) { return new InfantRule( name ); };
	
	
	static Predicate<MealFoodItem> isBreastmilk = isMilkItem.and( descriptionContains( "breastmilk" ) );	
	static Predicate<MealFoodItem> isFormula = isMilkItem.and( descriptionContains( "iron" ) ).and( descriptionContains("fortified") ).and( descriptionContains("formula" ) );
	
	
	static Predicate<MealFoodItem> isInfantMilk =  isBreastmilk.or( isFormula );
	static Predicate<MealFoodItem> isInfantCereal = isFoodComponentType( "CEREAL" ).and( descriptionContains("infant") );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasInfantMilk = hasAnyItem( isInfantMilk );

	private InfantRule( String name ) {
		super( name );
	}
	
	public InfantRule appliesTo( BiPredicate<Meal,List<MealFoodItem>> pred ) {
		return (InfantRule)super.appliesTo( isInfant.and( pred ) );
	}
	
	public static InfantRule breastMilkOrInfantFormula = (InfantRule)create( "breastMilkOrInfantFormula" )
			.appliesTo( isBreakfast )
			.when( hasInfantMilk.negate() )
			.thenFail( "Breast Milk and/or Iron Fortified Infant Formula must be served for infant breakfasts" );

	public static InfantRule breastMilkOrInfantFormula_4oz = (InfantRule)create( "breastMilkOrInfantFormula_4oz" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_0_5MO ) ) )
			.when(  hasAnyItem( isInfantMilk.and( isQuantityItem( 4, UnitOfMeasure.OUNCES ) ) ) )
			.thenFail( "At least 4 oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 5mo and under" );

	public static InfantRule breastMilkOrInfantFormula_6oz = (InfantRule)create( "breastMilkOrInfantFormula_6oz" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasAnyItem( isInfantMilk.and( isQuantityItem( 4, UnitOfMeasure.OUNCES ) ) ) )
			.thenFail( "At least 6 oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 11mo and under" );

	public static InfantRule infantCereal = (InfantRule)create( "infantCereal" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasAnyItem( isInfantCereal.negate().or( isInfantCereal.and( isQuantityItem( 2, UnitOfMeasure.TABLESPOONS ) ) ) ) ) 
			.thenFail( "At least 2 tbsp of of iron foritfied infant cereal must be served for infants infants 11mo and under" );

	static List<MealRule> RULES = Arrays.asList(
			breastMilkOrInfantFormula,
			breastMilkOrInfantFormula_4oz,
			breastMilkOrInfantFormula_6oz,
			infantCereal
			);
}
