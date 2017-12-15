package com.remarkablesystems.childwatch.domain.food.repository;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.food.MealAttendanceRecord;

@RepositoryRestResource(collectionResourceRel = "mealAttendanceRecords", path = "mealAttendanceRecord")
public interface MealAttendanceRecordRepository extends CrudRepository<MealAttendanceRecord, String> {
	
	@RestResource(path="byMPRId", rel="byMPRId" )
	Set<MealAttendanceRecord> findByMprId( @Param("id") String mprId );
}
