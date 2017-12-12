package com.remarkablesystems.childwatch.domain.food.mpr;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.MealType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealAttendanceRecord extends AuditedUser{

	@Id
	String id;
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="mpr_id", referencedColumnName="id")
	@Getter
	MealProductionRecord mpr;
	
	@Column(name="age_group") 
	@Enumerated( EnumType.STRING )
	@Getter
	AgeGroup ageGroup;	
	
	@Column(name="projected") 
	@Getter @Setter
	double projected;

	@Column(name="actual") 
	@Getter @Setter
	double actual;
	
}
