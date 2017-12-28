package com.remarkablesystems.childwatch.users;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.rest.core.config.Projection;

import lombok.Getter;
import lombok.Setter;


@Projection(name="userFull", types=User.class )
public interface UserFull {

	String getId();
	
	String getUsername();
	
	String getFullName();	
	
	String getAvatar();
	
	boolean isWeekendsShowing();

	Set<String> getAuthorities();
	
	TenantFull getTenant();

}
