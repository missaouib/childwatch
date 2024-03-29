package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.Date;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.food.MealProductionRecord;

@RepositoryRestResource(collectionResourceRel = "mealProductionRecords", path = "mealProductionRecord")
public interface MealProductionRecordRepository extends CrudRepository<MealProductionRecord, String> {
	
	@RestResource(path="byDate", rel="byDate" )
	Set<MealProductionRecord> findByMealDate( @Param("date") Date mealDate );
}
