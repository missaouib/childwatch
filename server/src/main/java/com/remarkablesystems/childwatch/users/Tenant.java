package com.remarkablesystems.childwatch.users;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString()
@EqualsAndHashCode()
@Table(name="cw_tenant")
public class Tenant {

	@Id
	@Getter
	String id;
	
	@Column(name="name")
	@Getter @Setter
	String name;
	
	@Column(name="active")
	@Getter @Setter
	boolean active;
	
	@Column(name="supports_AGE_0_5MO")
	@Getter @Setter
	boolean supportingAge0_5MO;

	@Column(name="supports_AGE_6_11MO")
	@Getter @Setter
	boolean supportingAge6_11MO;
	
	@Column(name="supports_AGE_1YR")
	@Getter @Setter
	boolean supportingAge1YR;

	@Column(name="supports_AGE_2YR")
	@Getter @Setter
	boolean supportingAge2YR;

	@Column(name="supports_AGE_3_5YR")
	@Getter @Setter
	boolean supportingAge3_5YR;

	@Column(name="supports_AGE_6_12YR")
	@Getter @Setter
	boolean supportingAge6_12YR;

	@Column(name="supports_AGE_13_18YR")
	@Getter @Setter
	boolean supportingAge13_18YR;
	
	@Column(name="supports_AGE_ADULT")
	@Getter @Setter
	boolean supportingAgeAdult;

	
	@Column(name="supports_BREAKFAST")
	@Getter @Setter
	boolean supportingBreakfast;

	@Column(name="supports_AM_SNACK")
	@Getter @Setter
	boolean supportingAMSnack;

	@Column(name="supports_LUNCH")
	@Getter @Setter
	boolean supportingLunch;

	@Column(name="supports_PM_SNACK")
	@Getter @Setter
	boolean supportingPMSnack;

	@Column(name="supports_SUPPER")
	@Getter @Setter
	boolean supportingSupper;

	@Column(name="supports_EV_SNACK")
	@Getter @Setter
	boolean supportingEVSnack;
	
	public Tenant() {}
	
	public Tenant( String id, String name ) {
		this.id = id;
		this.name = name;
		this.active = true;
	}
	
	@Transient
	public Set<AgeGroup> supportedAgeGroups(){
		HashSet<AgeGroup> supported = new HashSet<AgeGroup>();
		
		if( supportingAge0_5MO ) supported.add(AgeGroup.AGE_0_5MO);
		if( supportingAge6_11MO) supported.add(AgeGroup.AGE_6_11MO);
		if( supportingAge1YR) supported.add(AgeGroup.AGE_1YR);
		if( supportingAge2YR) supported.add(AgeGroup.AGE_2YR);
		if( supportingAge3_5YR) supported.add(AgeGroup.AGE_3_5YR);
		if( supportingAge6_12YR) supported.add(AgeGroup.AGE_6_12YR);
		if( supportingAge13_18YR) supported.add(AgeGroup.AGE_13_18YR);
		if( supportingAgeAdult) supported.add(AgeGroup.AGE_ADULT);
		
		return supported;
	}

	@Transient
	public Set<MealType> supportedMealTypes(){
		HashSet<MealType> supported = new HashSet<MealType>();
		
		if( supportingBreakfast ) supported.add(MealType.BREAKFAST);
		if( supportingAMSnack ) supported.add(MealType.AM_SNACK);
		if( supportingLunch ) supported.add(MealType.LUNCH);
		if( supportingPMSnack ) supported.add(MealType.PM_SNACK);
		if( supportingSupper ) supported.add(MealType.SUPPER);
		if( supportingEVSnack ) supported.add(MealType.EV_SNACK);
		
		return supported;
	}
	
}
