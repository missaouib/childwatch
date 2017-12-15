package com.remarkablesystems.childwatch.domain.food;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.remarkablesystems.childwatch.domain.AuditedTenantUser;
import com.remarkablesystems.childwatch.domain.AuditedUser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealAttendanceRecord extends AuditedUser{

	
	public MealAttendanceRecord() { super(); }
	
	public MealAttendanceRecord( String id, MealProductionRecord mpr, AgeGroup ageGroup ) {
		this.id = id;
		this.mpr = mpr;
		this.ageGroup = ageGroup;
		this.projected = 0;
		this.actual = 0;
	}
	
	@Id
	@Getter
	String id;
	
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="mpr_id", referencedColumnName="id")
	@Getter
	@JsonBackReference
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
