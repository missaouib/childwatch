package com.remarkablesystems.childwatch.domain.meal;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Entity @NoArgsConstructor @ToString(exclude="foodItems")
@Table(name="food_component")
public class FoodComponent implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @NonNull
	private String id;

	@NonNull @Getter @Setter
	private String description;

	//bi-directional many-to-one association to Food
	@OneToMany(fetch=FetchType.EAGER, mappedBy="foodComponent")
	@Getter
	@NonNull
	private Set<FoodItem> foodItems = new HashSet<FoodItem>();

	public FoodComponent( String id, String description ) {
		this.id = id;
		this.description = description;
	}
	
	public FoodItem addFoodItem(FoodItem foodItem) {
		foodItems.add(foodItem);
		foodItem.setFoodComponent(this);

		return foodItem;
	}

	public FoodItem removeFoodItem(FoodItem foodItem) {
		foodItems.remove(foodItem);
		foodItem.setFoodComponent(null);

		return foodItem;
	}

}
