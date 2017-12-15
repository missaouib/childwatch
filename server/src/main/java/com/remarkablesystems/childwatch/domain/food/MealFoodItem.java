package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.SimpleObjectIdResolver;
import com.remarkablesystems.childwatch.domain.food.projection.MealFoodItemFull;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


/**
 * The persistent class for the meal_food_item database table.
 * 
 */
@Entity
@Table(name="meal_food_item")
@ToString(callSuper=true)
@EqualsAndHashCode()
public class MealFoodItem implements Serializable {
	
	private static final long serialVersionUID = 7341397807008242827L;

	@Id
	@Getter
	private String id;

	@Column(name="age_group") @Enumerated( EnumType.STRING )
	@Getter @Setter
	private AgeGroup ageGroup;
	
	@Getter @Setter
	private double quantity;
	
	@Enumerated(EnumType.STRING)
	@Getter @Setter
	private UnitOfMeasure unit;


	@ManyToOne
	@PrimaryKeyJoinColumn( name="food_item_id", referencedColumnName="id")
	@Getter @Setter
	private FoodItem foodItem;

	@ManyToOne
	@PrimaryKeyJoinColumn(name="meal_id", referencedColumnName="id")
	@Getter @Setter
	private Meal meal;
	
	public MealFoodItem() {}

	public MealFoodItem( String id, FoodItem item ) {
		this.id = id;
		this.foodItem = item;
	}
	
	public MealFoodItem( FoodItem item, AgeGroup ageGroup, double quantity, UnitOfMeasure unit, Meal meal ) {
		this.foodItem = item;
		this.ageGroup = ageGroup;
		this.quantity = quantity;
		this.unit = unit;
		this.meal = meal;
	}
	
	@Transient
	public Double convertTo(UnitOfMeasure uom) {
		return (uom!=null)? UnitOfMeasure.convert(this.quantity, this.getUnit(), uom) : this.quantity;
	}
	
	@Transient
	public Double add( UnitOfMeasure commonUoM, MealFoodItem mealFoodItem ) {
		return mealFoodItem.convertTo( this.getUnit() ) + this.convertTo(commonUoM);
	}

	@Transient
	public static Double add( UnitOfMeasure commonUoM, MealFoodItem ...mealFoodItems ) {
		return Arrays.stream(mealFoodItems).mapToDouble( mfi -> mfi.convertTo(commonUoM) ).sum();
	}

}