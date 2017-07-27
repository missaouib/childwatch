package com.remarkablesystems.childwatch.domain.meal.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.meal.MealFoodItem;

@RepositoryRestResource(collectionResourceRel = "mealFoodItems", path = "mealFoodItem")
public interface MealFoodItemRepository extends PagingAndSortingRepository<MealFoodItem, Integer>{

}

