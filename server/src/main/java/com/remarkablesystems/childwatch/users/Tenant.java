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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="cw_tenant")
@Builder
@AllArgsConstructor
@Data @NoArgsConstructor
public class Tenant {

	@Id
	@Getter
	String id;
	
	@Column(name="name")
	@Getter @Setter
	String name;
	
	@Column(name="active")
	@Getter @Setter
	@Builder.Default boolean active = true;
	
	@Column(name="supports_AGE_0_5MO")
	@Getter @Setter
	@Builder.Default boolean supportingAge0_5MO = true;

	@Column(name="supports_AGE_6_11MO")
	@Getter @Setter
	@Builder.Default boolean supportingAge6_11MO = true;
	
	@Column(name="supports_AGE_1YR")
	@Getter @Setter
	@Builder.Default boolean supportingAge1YR = true;

	@Column(name="supports_AGE_2YR")
	@Getter @Setter
	@Builder.Default boolean supportingAge2YR = true;

	@Column(name="supports_AGE_3_5YR")
	@Getter @Setter
	@Builder.Default boolean supportingAge3_5YR = true;

	@Column(name="supports_AGE_6_12YR")
	@Getter @Setter
	@Builder.Default boolean supportingAge6_12YR = true;

	@Column(name="supports_AGE_13_18YR")
	@Getter @Setter
	@Builder.Default boolean supportingAge13_18YR = true;
	
	@Column(name="supports_AGE_ADULT")
	@Getter @Setter
	@Builder.Default boolean supportingAgeAdult = true;

	
	@Column(name="supports_BREAKFAST")
	@Getter @Setter
	@Builder.Default boolean supportingBreakfast = true;

	@Column(name="supports_AM_SNACK")
	@Getter @Setter
	@Builder.Default boolean supportingAMSnack = true;

	@Column(name="supports_LUNCH")
	@Getter @Setter
	@Builder.Default boolean supportingLunch = true;

	@Column(name="supports_PM_SNACK")
	@Getter @Setter
	@Builder.Default boolean supportingPMSnack = true;

	@Column(name="supports_SUPPER")
	@Getter @Setter
	@Builder.Default boolean supportingSupper = true;

	@Column(name="supports_EV_SNACK")
	@Getter @Setter
	@Builder.Default boolean supportingEVSnack = true;
		
	
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
