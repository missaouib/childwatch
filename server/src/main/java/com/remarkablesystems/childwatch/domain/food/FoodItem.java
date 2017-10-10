package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
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
	
	@ElementCollection
	@CollectionTable(
			name="food_item_tag",
			joinColumns=@JoinColumn( name="food_item_id" )
	)
	private Set<FoodItemTag> tags;
	
	public FoodItem() {}
	
	public FoodItem( String id, String description, FoodComponent foodComponent, List<String> tags ) {
		this.id = id;
		this.description = description;
		this.foodComponent = foodComponent;
		if( tags != null )
			tags.stream().forEach( tag -> this.addTag( tag ) );
		
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
	
	public Set<FoodItemTag> getTags() {
		return this.tags;
	}
	
	public void clearTags() {
		if( this.tags != null ) this.tags.clear();
	}
	
	public void addTag( String tagValue ) {
		addTag( new FoodItemTag( tagValue ) );
	}
	
	public void addTag( FoodItemTag tag ) {
		if( this.tags == null ) this.tags = new HashSet<FoodItemTag>();
		this.tags.add( tag );
	}
	
	public boolean hasTag( String tagValue ) {
		return this.tags != null && this.tags.contains( new FoodItemTag(tagValue) );
	}
	
	public boolean hasTag( FoodItemTag tag ) {
		return this.tags != null && this.tags.contains(tag); 
	}
	
}
