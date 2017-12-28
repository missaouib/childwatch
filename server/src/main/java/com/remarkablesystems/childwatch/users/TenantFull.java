package com.remarkablesystems.childwatch.users;

import java.util.Set;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealType;


@Projection(name="tenantFull", types=Tenant.class )
public interface TenantFull {

	String getId();
	
	String getName();
	
	boolean isActive();
	
	@Value( "#{target.supportedAgeGroups()}")
	Set<AgeGroup> getAgeGroups();

	@Value( "#{target.supportedMealTypes()}")	
	Set<MealType> getMealTypes();
}
