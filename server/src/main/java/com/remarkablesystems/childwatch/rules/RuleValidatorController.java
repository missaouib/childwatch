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
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.repository.MealFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealRepository;

import static com.remarkablesystems.childwatch.rules.MealRule.*;

@RestController
public class RuleValidatorController {

	@Autowired
	MealFoodItemRepository mealFoodItemRepo;

	@Autowired
	MealRepository mealRepo;

	
	@RequestMapping( "/rules" )
	public List<RuleViolation> validate( @RequestParam( value="mealId", required=false ) String mealId ) {
		
		if( mealId == null ) return Collections.emptyList();
		
	
		Meal meal = mealRepo.findOne(mealId);
		
		if( meal == null ) return Collections.emptyList();
		
		List<RuleViolation> violations = new ArrayList<RuleViolation>();
		AgeGroup.ALL.stream().forEachOrdered( (ageGroup) -> {
			List<MealFoodItem>mealFoodItems = mealFoodItemRepo.findByMealIdAndAgeGroup( mealId, ageGroup );
			if( mealFoodItems.size() > 0 ) {
				violations.addAll( MealRule.RULES.stream()
										.map( (rule) -> rule.evaluate(meal, mealFoodItems) ) // evaluate the rules
										.filter( (violation) -> violation != null ) // filter out nulls
										.collect( Collectors.toList() ) );	// collect them into a list
				if( ageGroup.isInfant() )
					violations.addAll( InfantRule.RULES.stream()
							.map( (rule) -> rule.evaluate(meal, mealFoodItems) ) // evaluate the rules
							.filter( (violation) -> violation != null ) // filter out nulls
							.collect( Collectors.toList() ) );	// collect them into a list
			}
		});
		
		return violations;
	}
}
