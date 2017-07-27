package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;
import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;


/**
 * The persistent class for the meal database table.
 * 
 */
@Entity
@Table(name="meal")
public class Meal implements Serializable {

	private static final long serialVersionUID = 5924104304981855748L;

	@Id
	private String id;

	private String description;

	@Enumerated(EnumType.STRING)
	private MealType type;

	//bi-directional many-to-one association to MealFoodItem
	@OneToMany(mappedBy="meal",fetch=FetchType.EAGER)
	private List<MealFoodItem> mealFoodItems = new ArrayList<MealFoodItem>();


	public Meal() {}
	
	public MealFoodItem addMealFoodItem(MealFoodItem mealFoodItem) {
		this.mealFoodItems.add(mealFoodItem);
		mealFoodItem.setMeal(this);

		return mealFoodItem;
	}

	public MealFoodItem removeMealFoodItem(MealFoodItem mealFoodItem) {
		this.mealFoodItems.remove(mealFoodItem);
		mealFoodItem.setMeal(null);

		return mealFoodItem;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public MealType getType() {
		return type;
	}

	public void setType(MealType type) {
		this.type = type;
	}

	public List<MealFoodItem> getMealFoodItems() {
		return mealFoodItems;
	}

	public void setMealFoodItems(List<MealFoodItem> mealFoodItems) {
		this.mealFoodItems = mealFoodItems;
	}

	public String getId() {
		return id;
	}


}