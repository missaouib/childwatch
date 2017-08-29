package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.food.FoodItem;

@RepositoryRestResource(collectionResourceRel = "foodItems", path = "foodItem")
public interface FoodItemRepository extends CrudRepository<FoodItem, String> {
	
	Set<FoodItem> findByFoodComponentDescription( String description );
	
	@RestResource(path="searchBy", rel="searchBy" )
	@Query( "select i from FoodItem i where i.description like %?1% or i.shortDescription like %?1% or i.foodComponent.description like %?1%" )
	Set<FoodItem> findByDescriptionContaining( @Param("filter") String descriptionString);

}
