package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

import java.util.List;


/**
 * The persistent class for the meal database table.
 * 
 */
@Entity
@NoArgsConstructor @AllArgsConstructor @ToString
public class Meal implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @NonNull @Getter
	private String id;

	@Getter @Setter @NonNull
	private String description;

	@Getter @Setter @NonNull
	private MealType type;

	//bi-directional many-to-one association to MealFoodItem
	@OneToMany(mappedBy="meal")
	@Getter @Setter
	private List<MealFoodItem> mealFoodItems;


	public MealFoodItem addMealFoodItem(MealFoodItem mealFoodItem) {
		getMealFoodItems().add(mealFoodItem);

		return mealFoodItem;
	}

	public MealFoodItem removeMealFoodItem(MealFoodItem mealFoodItem) {
		getMealFoodItems().remove(mealFoodItem);

		return mealFoodItem;
	}

}