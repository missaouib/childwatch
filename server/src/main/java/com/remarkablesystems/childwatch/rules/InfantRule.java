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
	
	static Predicate<MealFoodItem> isInfantMeat = isFoodComponentType( "BEEF" )
											 .or( isFoodComponentType( "LAMB") )
											 .or( isFoodComponentType( "CHICKEN") )
											 .or( isFoodComponentType( "PORK") )
											 .or( isFoodComponentType( "FISH") )
											 .or( descriptionContains( "egg" ).and( descriptionContains( "yolk" )) )
											 .or( descriptionContains( "bean" ).and( descriptionContains( "pea" )) )
											 .or( descriptionContains( "cheese" ) );
	
	static BiPredicate<Meal,List<MealFoodItem>> hasInfantMilk = hasAnyItem( isInfantMilk );

	private InfantRule( String name ) {
		super( name );
	}
	
	public InfantRule appliesTo( BiPredicate<Meal,List<MealFoodItem>> pred ) {
		return (InfantRule)super.appliesTo( isInfant.and( pred ) );
	}
	
	public static InfantRule breastMilkOrInfantFormula = (InfantRule)create( "breastMilkOrInfantFormula" )
			.appliesTo( isSnack.negate().or( isAgeGroup( AgeGroup.AGE_6_11MO ).negate() ) )
			.when( hasInfantMilk.negate() )
			.thenFail( "Breast Milk and/or Iron Fortified Infant Formula must be served for infants" );

	public static InfantRule breastMilkOrInfantFormula_4oz = (InfantRule)create( "breastMilkOrInfantFormula_4oz" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_0_5MO ) ) 
			.when(  hasAnyItem( isInfantMilk.and( isQuantityItem( 4, UnitOfMeasure.OUNCES ).negate() ) ) )
			.thenFail( "At least 4 oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 5mo and under" );

	public static InfantRule breastMilkOrInfantFormula_6oz = (InfantRule)create( "breastMilkOrInfantFormula_6oz" )
			.appliesTo( isAgeGroup( AgeGroup.AGE_6_11MO ) )
			.when(  hasAnyItem( isInfantMilk.and( isQuantityItem( 6, UnitOfMeasure.OUNCES ).negate() ) ) )
			.thenFail( "At least 6 oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 11mo and under" );

	public static InfantRule breastMilkOrInfantFormula_2ozSnack = (InfantRule)create( "breastMilkOrInfantFormula_6oz" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasAnyItem( isInfantMilk.and( isQuantityItem( 2, UnitOfMeasure.OUNCES ).negate() ) ) )
			.thenFail( "At least 2 oz of Breast Milk and/or Iron Fortified Infant Formula must be served for infants 11mo and under" );
	
	public static InfantRule infantCereal = (InfantRule)create( "infantCereal" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasNoItems( isInfantCereal ).or( hasAnyItem( isInfantCereal.and(isQuantityItem( 2, UnitOfMeasure.TABLESPOONS ).negate()))) ) 
			.thenFail( "At least 2 tbsp of of iron foritfied infant cereal must be served for infants 6 - 11mo" );
	
	public static InfantRule infantFruitVeg = (InfantRule)create( "infantFruitVeg" )
			.appliesTo( isBreakfast.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasNoItems( isVegOrFruitItem).or( hasAnyItem( isVegOrFruitItem.and(isQuantityItem( 1, UnitOfMeasure.TABLESPOONS ).negate()))) ) 
			.thenFail( "At least 1 tbsp of Fruit/Veg must be served for infants 6 - 11mo" );
	
	public static InfantRule snackMilkOrJuice = (InfantRule)create( "snackMilkOrJuice" )
			.appliesTo( isSnack.and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when( hasNoItems( isFruitJuiceItem.or( isInfantMilk ) ).or( hasAnyItem( isFruitJuiceItem.or( isInfantMilk).and( isQuantityItem( 2, UnitOfMeasure.OUNCES).negate() )) ) ) 
			.thenFail( "At least 2 oz of Breast milk, infant formula, and/or Fruit/Veg must be served for snacks for infants 6 - 11mo" );
	
	public static InfantRule lunchDinner_6 = (InfantRule)create( "lunchDinner_6" )
			.appliesTo( isLunch.or( isDinner ).and( isAgeGroup( AgeGroup.AGE_6_11MO ) ) )
			.when(  hasNoItems( isInfantCereal ).or( hasAnyItem( isInfantCereal.and(isQuantityItem( 2, UnitOfMeasure.TABLESPOONS ).negate())) )
			  .or( hasNoItems( isInfantMeat ).or( hasAnyItem( isInfantMeat.and(isQuantityItem( 1, UnitOfMeasure.TABLESPOONS ).negate())) ) ) )
			.thenFail( "At least 2 oz of infant formula or 1 oz of meat/alternates must be served for lunch/dinner for infants 6 - 11mo" );

	static List<MealRule> RULES = Arrays.asList(
			breastMilkOrInfantFormula,
			breastMilkOrInfantFormula_4oz,
			breastMilkOrInfantFormula_6oz,
			breastMilkOrInfantFormula_2ozSnack,
			infantCereal,
			infantFruitVeg,
			snackMilkOrJuice,
			lunchDinner_6
			);
}
