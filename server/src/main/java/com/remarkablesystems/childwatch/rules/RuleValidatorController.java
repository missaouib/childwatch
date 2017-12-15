package com.remarkablesystems.childwatch.rules;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.domain.food.repository.MealFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealRepository;

import static com.remarkablesystems.childwatch.rules.MealRule.*;

@RestController
public class RuleValidatorController {

	@Autowired
	MealFoodItemRepository mealFoodItemRepo;

	@Autowired
	MealRepository mealRepo;
	
	
	private List<MealFoodItem> explodeMealFoodItems( List<MealFoodItem> originalList ){
	
		List<MealFoodItem> explodedList = new ArrayList<MealFoodItem>();
		
		originalList.stream().forEach(  (mealFoodItem) -> {
			if( mealFoodItem.getFoodItem().hasTag("CNITEM") ) {
				List<FoodItem> components = mealFoodItem.getFoodItem().getComponents();
				components.forEach( (foodItem) -> {
					System.out.println( "adding " + foodItem.getPortionSize() * mealFoodItem.getQuantity() + " " + foodItem.getServingUom()+ " of " + foodItem.getDescription() );
					MealFoodItem mfi = new MealFoodItem(foodItem, mealFoodItem.getAgeGroup(), mealFoodItem.getQuantity() * foodItem.getPortionSize(), foodItem.getServingUom(), mealFoodItem.getMeal() );
					explodedList.add( mfi );
				});
				
			}
			else {
				explodedList.add(mealFoodItem);
			}
		});
		
		return explodedList;
		
	}
	
	
	List<RuleViolation> doValidation( Meal meal, AgeGroup ageGroup, List<MealFoodItem> mealFoodItems ){
		List<RuleViolation> violations = new ArrayList<RuleViolation>();
		
		List<MealFoodItem> explodedList = explodeMealFoodItems( mealFoodItems );

		if( mealFoodItems.size() > 0 ) {
			violations.addAll( MealRule.RULES.stream()
									.map( (rule) -> rule.evaluate(meal, explodedList) ) // evaluate the rules
									.filter( (violation) -> violation != null ) // filter out nulls
									.collect( Collectors.toList() ) );	// collect them into a list
			if( ageGroup.isInfant() )
				violations.addAll( InfantRule.RULES.stream()
						.map( (rule) -> rule.evaluate(meal, explodedList ) ) // evaluate the rules
						.filter( (violation) -> violation != null ) // filter out nulls
						.collect( Collectors.toList() ) );	// collect them into a list
		}
		return violations;
	}

	
	@RequestMapping( "/rules" )
	public List<RuleViolation> validate( @RequestParam( value="mealId", required=false ) String mealId ) {
		
		if( mealId == null ) return Collections.emptyList();
		
	
		Meal meal = mealRepo.findOne(mealId);
		
		return ( meal == null )? Collections.emptyList() : validate( meal );
		
	}
	
	
	public List<RuleViolation> validate( Meal meal ){
		List<RuleViolation> violations = new ArrayList<RuleViolation>();
		AgeGroup.ALL.stream().forEachOrdered( (ageGroup) -> violations.addAll( doValidation( meal, ageGroup, mealFoodItemRepo.findByMealIdAndAgeGroup( meal.getId(), ageGroup ) ) ) );		
		return violations;		
	}
}
