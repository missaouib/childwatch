package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;


/**
 * The persistent class for the meal_food_item database table.
 * 
 */
@Entity
@Table(name="meal_food_item")
@NoArgsConstructor @AllArgsConstructor @ToString
public class MealFoodItem implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @Getter @NonNull
	private Integer id;

	@Getter @Setter @Column(name="age_group")
	private AgeGroup ageGroup;

	@Getter @Setter
	private BigDecimal amount;


	@ManyToOne
	@PrimaryKeyJoinColumn( name="food_item_id", referencedColumnName="id")
	@Getter @Setter
	private FoodItem foodItem;

	@ManyToOne
	@PrimaryKeyJoinColumn(name="meal_id", referencedColumnName="id")
	@Getter @Setter
	private Meal meal;


}