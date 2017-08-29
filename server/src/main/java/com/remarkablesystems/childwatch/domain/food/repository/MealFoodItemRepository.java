package com.remarkablesystems.childwatch.domain.food.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.food.MealFoodItem;

@RepositoryRestResource(collectionResourceRel = "mealFoodItems", path = "mealFoodItem")
public interface MealFoodItemRepository extends CrudRepository<MealFoodItem, Integer>{

}

