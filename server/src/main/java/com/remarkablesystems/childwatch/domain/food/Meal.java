package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.SimpleObjectIdResolver;
import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.Spring;
import com.remarkablesystems.childwatch.domain.food.projection.MealFull;
import com.remarkablesystems.childwatch.rules.RuleValidatorController;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;



/**
 * The persistent class for the meal database table.
 * 
 */
@Entity
@Table(name="meal")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class Meal extends AuditedUser implements Serializable {

	private static final long serialVersionUID = 5924104304981855748L;

	@Id @Getter @Setter
	String id;

	@Getter @Setter
	String description;
	
	@Getter @Setter
	boolean inactive;

	@Enumerated(EnumType.STRING)
	@Column(name="meal_type")
	@Getter @Setter	
	MealType type;
			
	public Meal() {
		super();
	}
	
	public Meal( String id, String description, MealType type ) {
		super();
		this.id = id;
		this.description = description;
		this.type = type;
	}
	
	@Transient
	public boolean isCompliant() {
		RuleValidatorController validator = Spring.bean(RuleValidatorController.class);
		return validator.validate(this).isEmpty();
	}

}