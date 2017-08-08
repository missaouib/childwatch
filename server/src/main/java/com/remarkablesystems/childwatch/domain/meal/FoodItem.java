package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity 
@Table(name="food_item")
public class FoodItem implements Serializable {

	private static final long serialVersionUID = 3576833611221593267L;

	@Id
	private String id;

	private String description;

	@Column(name="short_description")
	private String shortDescription;
	
	@Column(name="purchase_unit")
	private String purchaseUom;

	@Column(name="serving_unit")
	private String servingUom;
	
	@Column(name="notes")
	private String notes;
	
	@ManyToOne
	@JoinColumn(name="food_component_id")	
	private FoodComponent foodComponent;
	
	public FoodItem() {}
	
	public FoodItem( String id, String description, FoodComponent foodComponent ) {
		this.id = id;
		this.description = description;
		this.foodComponent = foodComponent;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getPurchaseUom() {
		return purchaseUom;
	}

	public void setPurchaseUom(String purchaseUom) {
		this.purchaseUom = purchaseUom;
	}

	public String getServingUom() {
		return servingUom;
	}

	public void setServingUom(String servingUom) {
		this.servingUom = servingUom;
	}

	public FoodComponent getFoodComponent() {
		return foodComponent;
	}

	public void setFoodComponent(FoodComponent foodComponent) {
		this.foodComponent = foodComponent;
	}

	public String getId() {
		return id;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
}
