package com.remarkablesystems.childwatch.rules;

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
	public List<RuleViolation> validate( @RequestParam( value="mealId", required=false ) String mealId, @RequestParam( value="ageGroup", required=false ) AgeGroup ageGroup ) {
		
		if( mealId == null && ageGroup == null ) return Collections.emptyList();
		
	
		Meal meal = mealRepo.findOne(mealId);
		
		if( meal == null ) return Collections.emptyList();
		
		List<MealFoodItem>mealFoodItems = (ageGroup!= null)? mealFoodItemRepo.findByMealId( mealId ) : mealFoodItemRepo.findByMealIdAndAgeGroup(mealId, ageGroup);
		
		return MEAL_RULES.stream().map( (rule) -> rule.evaluate(meal, mealFoodItems) ).collect(Collectors.toList() );
	}
}
