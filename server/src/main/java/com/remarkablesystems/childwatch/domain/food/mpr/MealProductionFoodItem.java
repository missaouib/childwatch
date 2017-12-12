package com.remarkablesystems.childwatch.domain.food.mpr;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="meal_production_food_item")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealProductionFoodItem extends AuditedUser {
	
	@Id
	String id;
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="mpr_id", referencedColumnName="id")
	@Getter
	MealProductionRecord mpr;
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="food_item_id", referencedColumnName="id")
	@Getter @Setter
	private FoodItem foodItem;
	
	@Column(name="required")
	@Getter @Setter
	double required;

	@Column(name="prepared")
	@Getter @Setter
	double prepared;
	
	@Column(name="unit")
	@Enumerated(EnumType.STRING)
	@Getter @Setter
	UnitOfMeasure unit;
}
