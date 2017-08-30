package com.remarkablesystems.childwatch.domain.food.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.food.FoodComponent;

@RepositoryRestResource(collectionResourceRel = "foodComponents", path = "foodComponent")
public interface FoodComponentRepository extends CrudRepository<FoodComponent, String>{
	FoodComponent findByDescription(String description);
}