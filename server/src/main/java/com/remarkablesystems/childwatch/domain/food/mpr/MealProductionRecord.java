package com.remarkablesystems.childwatch.domain.food.mpr;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
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

import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealType;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="meal_production_record")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealProductionRecord extends AuditedUser {

	@Id
	@Getter
	String id;
		
	@Column(name="meal_date")
	@Getter
	@Temporal( TemporalType.DATE )
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
	@JoinColumn(name="meal_id")
	@Getter
	Meal meal;

	@Column(name="notes")
	@Getter @Setter
	String notes;
		
}
