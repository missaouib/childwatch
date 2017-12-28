package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.food.MealEvent;

@RepositoryRestResource(collectionResourceRel = "mealEvent", path = "mealEvent")
public interface MealEventRepository extends CrudRepository<MealEvent, String> {
	
	@RestResource(path="between", rel="between" )
	List<MealEvent> findByStartDateGreaterThanEqualAndStartDateLessThanEqual( @Param("start") Date start,  @Param("end") Date end);
	
	List<MealEvent> findByStartDate( Date start );

	
	List<MealEvent> findByMealId( @Param("mealId") String mealId );
	
}