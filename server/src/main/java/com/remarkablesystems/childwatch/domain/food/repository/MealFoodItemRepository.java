package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

@RepositoryRestResource(collectionResourceRel = "mealFoodItems", path = "mealFoodItem")
public interface MealFoodItemRepository extends CrudRepository<MealFoodItem, String>{
	List<MealFoodItem> findByMealId( @Param("mealId")String mealId );
	List<MealFoodItem> findByMealIdAndAgeGroup( @Param("mealId")String mealId, @Param("ageGroup")AgeGroup ageGroup );
}

