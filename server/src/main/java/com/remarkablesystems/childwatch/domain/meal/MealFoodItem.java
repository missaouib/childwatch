package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;
import javax.persistence.*;

import java.math.BigDecimal;


/**
 * The persistent class for the meal_food_item database table.
 * 
 */
@Entity
@Table(name="meal_food_item")
public class MealFoodItem implements Serializable {
	
	private static final long serialVersionUID = 7341397807008242827L;

	@Id
	private Integer id;

	@Column(name="age_group") @Enumerated( EnumType.STRING )
	private AgeGroup ageGroup;

	
	private BigDecimal amount;


	@ManyToOne
	@PrimaryKeyJoinColumn( name="food_item_id", referencedColumnName="id")
	private FoodItem foodItem;

	@ManyToOne
	@PrimaryKeyJoinColumn(name="meal_id", referencedColumnName="id")
	private Meal meal;
	
	public MealFoodItem() {}

	public AgeGroup getAgeGroup() {
		return ageGroup;
	}

	public void setAgeGroup(AgeGroup ageGroup) {
		this.ageGroup = ageGroup;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public FoodItem getFoodItem() {
		return foodItem;
	}

	public void setFoodItem(FoodItem foodItem) {
		this.foodItem = foodItem;
	}

	public Meal getMeal() {
		return meal;
	}

	public void setMeal(Meal meal) {
		this.meal = meal;
	}

	public Integer getId() {
		return id;
	}
	
	
	

}