package com.remarkablesystems.childwatch.domain.food.mpr;

import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(collectionResourceRel = "mealAttendanceRecords", path = "mealAttendanceRecord")
public interface MealAttendanceRecordRepository extends CrudRepository<MealAttendanceRecord, String> {
	
	@RestResource(path="byMPRId", rel="byMPRId" )
	Set<MealAttendanceRecord> findByMprId( @Param("id") String mprId );
}
