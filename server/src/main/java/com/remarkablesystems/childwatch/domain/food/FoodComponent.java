package com.remarkablesystems.childwatch.domain.food;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;


@Entity
@Table(name="food_component")
public class FoodComponent implements Serializable {
	
	private static final long serialVersionUID = -3589172633392001990L;

	@Id
	private String id;

	private String description;
	
	private String icon;
	
	@ManyToOne
	@JoinColumn(name="parent_component")
	private FoodComponent parentComponent;

	//bi-directional many-to-one association to Food
	@OneToMany(mappedBy="foodComponent")
	private Set<FoodItem> foodItems = new HashSet<FoodItem>();
	
	public FoodComponent() {}

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<FoodItem> getFoodItems() {
		return foodItems;
	}

	public void setFoodItems(Set<FoodItem> foodItems) {
		this.foodItems = foodItems;
	}

	public String getId() {
		return id;
	}

	public FoodComponent getParentComponent() {
		return parentComponent;
	}

	public void setParentComponent(FoodComponent parentComponent) {
		this.parentComponent = parentComponent;
	}

	public String getIcon() {
		return this.icon;		
	}
	
	public void setIcon( String icon ) {
		this.icon = icon;
	}
	
}
