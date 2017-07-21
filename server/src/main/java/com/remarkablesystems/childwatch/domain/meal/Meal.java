package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;


/**
 * The persistent class for the meal database table.
 * 
 */
@Entity
@Table(name="meal")
@NoArgsConstructor @AllArgsConstructor @ToString
public class Meal implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @Getter @NonNull
	private String id;

	@Getter @Setter @NonNull @Enumerated(EnumType.STRING)
	private MealType type;

	//uni-directional many-to-many association to Food
	@ManyToMany(cascade={CascadeType.ALL})
	@JoinTable(
		name="meal_food_item", 
		joinColumns={@JoinColumn(name="meal_id", referencedColumnName="id")}, 
		inverseJoinColumns={@JoinColumn(name="food_item_id", referencedColumnName="id")}
		)
	@Getter @NonNull
	private List<FoodItem> foodItems = new ArrayList<FoodItem>();
	
	public Meal( String id, MealType type ) {
		this.id = id;
		this.type = type;
	}
	
	public void addFoodItem( FoodItem foodItem ) {
		foodItems.add(foodItem);
	}

}