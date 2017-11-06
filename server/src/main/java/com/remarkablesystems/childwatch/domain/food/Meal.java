package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import javax.persistence.*;

import com.remarkablesystems.childwatch.domain.food.projection.MealFull;



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
	
	private boolean inactive;

	@Enumerated(EnumType.STRING)
	@Column(name="meal_type")
	private MealType type;


	public Meal() {}
	
	public Meal( String id, String description, MealType type ) {
		this.id = id;
		this.description = description;
		this.type = type;
	}
	

	public boolean isInactive() {
		return inactive;
	}

	public void setInactive(boolean inactive) {
		this.inactive = inactive;
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

	public String getId() {
		return id;
	}

	

}