package com.remarkablesystems.childwatch.domain.people;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.users.Tenant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

import lombok.AccessLevel;

@Entity
@Table(name="person")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="person_type")
@DiscriminatorValue( value="PERSON" )
@NoArgsConstructor 
@Builder @AllArgsConstructor( access=AccessLevel.PRIVATE )
public class Person extends AuditedUser {

	@Id 	
	@NonNull String id;
	
	@Column( name="given_name")
	String givenName;

	@Column( name="additional_name")
	String additionalName;
	
	@Column( name="family_name")
	String familyName;
	
	@Column( name="suffix")
	String suffix;
	
	@Column( name="inactive")
	@Builder.Default boolean inactive = false;
	
	@Column(name="person_type", insertable=false, updatable=false, nullable = false)
	@Enumerated(EnumType.STRING)
	@Builder.Default PersonType type = PersonType.PERSON;
		
	@ManyToOne
	@PrimaryKeyJoinColumn( name="tenant_id", referencedColumnName="id")
	Tenant tenant;
	
	@Transient
	public String getName() {
		return Stream.of(givenName, additionalName, familyName, suffix)
				.filter(s -> s != null && !s.isEmpty())
				.collect(Collectors.joining(" "));
	}

	@Transient
	public String getSortName() {
	    return Stream.of(familyName, suffix, givenName, additionalName)
		          .filter(s -> s != null && !s.isEmpty())
		          .collect(Collectors.joining(", "));
		
	}

	@Transient
	public String getShortName() {
		return Stream.of(givenName, familyName, suffix)
		          .filter(s -> s != null && !s.isEmpty())
		          .collect(Collectors.joining(" "));
		
	}

	
}
