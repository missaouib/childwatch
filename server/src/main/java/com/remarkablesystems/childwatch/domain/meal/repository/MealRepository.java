package com.remarkablesystems.childwatch.domain.meal.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.remarkablesystems.childwatch.domain.meal.Meal;

public interface MealRepository extends PagingAndSortingRepository<Meal, String> {

}
