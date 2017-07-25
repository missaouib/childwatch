package com.remarkablesystems.childwatch.domain.meal.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.meal.Meal;

@RepositoryRestResource(collectionResourceRel = "meals", path = "meal")
public interface MealRepository extends PagingAndSortingRepository<Meal, String> {

}
