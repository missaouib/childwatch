package com.remarkablesystems.childwatch.domain.food;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapKey;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.remarkablesystems.childwatch.domain.AuditedTenantUser;
import com.remarkablesystems.childwatch.domain.AuditedUser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="meal_production_record")
@ToString(callSuper=true,exclude={"attendanceRecords","productionFoodItems"})
@EqualsAndHashCode(callSuper=true,exclude={"attendanceRecords","productionFoodItems"})
public class MealProductionRecord extends AuditedUser {

	public MealProductionRecord() {
		super();
	}
	
	public MealProductionRecord( String id, MealEvent event ) {
		super();
		this.id = id;
		this.mealEvent = event;
		this.mealDate = event.getStartDate();
		this.type = event.getMeal().getType();
	}
	
	public MealProductionRecord( String id, Date mealDate, MealType type ) {
		super();
		this.id = id;
		this.mealDate = mealDate;
		this.type = type;
	}
	
	@Id
	@Getter
	String id;
	
		
	@Column(name="meal_date")
	@Getter
	@Temporal( TemporalType.TIMESTAMP )
	Date mealDate;
	
	@Enumerated(EnumType.STRING)
	@Column(name="meal_type")
	@Getter @Setter	
	private MealType type;
	
	@Column(name="locked")
	@Getter @Setter
	boolean locked;
	
	@Column(name="lock_date")
	@Getter @Setter
	@Temporal( TemporalType.DATE )
	Date lockDate;
	
	@ManyToOne
	@JoinColumn(name="meal_event_id")
	@Getter
	MealEvent mealEvent;

	@Column(name="notes")
	@Getter @Setter
	String notes;
	
	@OneToMany(mappedBy="mpr")
	@Getter
	Set<MealAttendanceRecord> attendanceRecords = new HashSet<MealAttendanceRecord>();	

	@OneToMany(mappedBy="mpr")
	@Getter
	Set<MealProductionFoodItem> productionFoodItems = new HashSet<MealProductionFoodItem>();		

}
