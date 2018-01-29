package com.remarkablesystems.childwatch.domain.people.projection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.people.Person;
import com.remarkablesystems.childwatch.users.Tenant;

@Projection(name="personFull", types=Person.class)
public interface PersonFull {
	String getId();
	String getGivenName();
	String getAdditionalName();
	String getFamilyName();
	String getSuffix();
	boolean isInactive();
	Tenant getTenant();
	
	@Value( "#{target.getName()}")
	String getName();
	@Value( "#{target.getShortName()}")
	String getShortName();
	@Value( "#{target.getSortName()}")
	String getSortName();
	
	

}
