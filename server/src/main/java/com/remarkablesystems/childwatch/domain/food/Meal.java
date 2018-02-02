package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;

import javax.persistence.*;

import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.Spring;
import com.remarkablesystems.childwatch.domain.food.repository.MealEventRepository;
import com.remarkablesystems.childwatch.rules.RuleValidatorController;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
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
@NoArgsConstructor @RequiredArgsConstructor
public class Meal extends AuditedUser implements Serializable {

	private static final long serialVersionUID = 5924104304981855748L;

	@Id @Getter @Setter @NonNull String id;

	@Getter @Setter @NonNull String description;
	
	@Getter @Setter boolean inactive = false;

	@Enumerated(EnumType.STRING)
	@Column(name="meal_type")
	@Getter @Setter	@NonNull
	MealType type;
			
	
	@Transient public boolean isCompliant() {
		RuleValidatorController validator = Spring.bean(RuleValidatorController.class);
		return validator.validate(this).isEmpty();
	}
	
	@Transient public boolean isScheduled() {
		MealEventRepository repo = Spring.bean(MealEventRepository.class);
		return !repo.findByMealId(id).isEmpty();		
	}

}