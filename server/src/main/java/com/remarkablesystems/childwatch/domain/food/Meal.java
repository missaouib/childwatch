package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import javax.persistence.*;



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
	@Column(name="meal_type")
	private MealType type;


	public Meal() {}
	
	public Meal( String id, String description, MealType type ) {
		this.id = id;
		this.description = description;
		this.type = type;
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