package com.remarkablesystems.childwatch.domain.meal.repository;

import java.util.Set;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.meal.FoodItem;

@RepositoryRestResource(collectionResourceRel = "foodItem", path = "foodItem")
public interface FoodItemRepository extends PagingAndSortingRepository<FoodItem, String> {
	
	Set<FoodItem> findByFoodComponentDescription( String description );

}
