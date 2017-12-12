package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import javax.persistence.*;

import org.springframework.beans.factory.annotation.Autowired;

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

	@Id @Getter
	private String id;

	@Getter @Setter
	private String description;
	
	@Getter @Setter
	private boolean inactive;

	@Enumerated(EnumType.STRING)
	@Column(name="meal_type")
	@Getter @Setter	
	private MealType type;
	
	
	public Meal() {}
	
	public Meal( String id, String description, MealType type ) {
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