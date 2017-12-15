package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.food.MealProductionFoodItem;

@RepositoryRestResource(collectionResourceRel = "mealProductionFoodItems", path = "mealProductionFoodItem")
public interface MealProductionFoodItemRepository extends CrudRepository<MealProductionFoodItem, String> {
	
	@RestResource(path="byMPRId", rel="byMPRId" )
	Set<MealProductionFoodItem> findByMprId( @Param("id") String mprId );
}
