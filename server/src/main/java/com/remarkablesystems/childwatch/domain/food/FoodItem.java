package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Comparator;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.remarkablesystems.childwatch.domain.food.projection.FoodItemFull;


@Entity 
@Table(name="food_item")
public class FoodItem implements Serializable{

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
	@JoinColumn(name="parent_id")
	private FoodItem parent;
	
	@OneToMany( mappedBy="parent" )
	private List<FoodItem> components;
	
	@Column(name="serving_quantity")
	private double servingQuantity;
	
	@Column(name="serving_type")
	private String servingType;
	
	@Column(name="portion_size")
	private double portionSize;
	
	
	public double getServingQuantity() {
		return servingQuantity;
	}

	public void setServingQuantity(double servingQuantity) {
		this.servingQuantity = servingQuantity;
	}

	public String getServingType() {
		return servingType;
	}

	public void setServingType(String servingType) {
		this.servingType = servingType;
	}

	public double getPortionSize() {
		return portionSize;
	}

	public void setPortionSize(double portionSize) {
		this.portionSize = portionSize;
	}

	public FoodItem getParent() {
		return parent;
	}

	public List<FoodItem> getComponents() {
		return components;
	}

	@ElementCollection
	@CollectionTable(
			name="food_item_tag",
			joinColumns=@JoinColumn( name="food_item_id" )
	)
	private Set<FoodItemTag> tags;
	
	public FoodItem() {}
	
	public FoodItem( String id, String description, List<String> tags ) {
		this.id = id;
		this.description = description;
		this.shortDescription = description;
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
		System.out.println( "items tags are " + getTags() );
		return this.tags != null && this.tags.contains( new FoodItemTag(tagValue) );
	}
	
	public boolean hasTag( FoodItemTag tag ) {
		return this.tags != null && this.tags.contains(tag); 
	}
	
	@Transient
	static String bestTagValue( FoodItem item ) {
		if( item == null ) return "OTHER";
		if( item.hasTag("MILK") ) return "MILK";
		if( item.hasTag("MEAT" ) || item.hasTag("MEATALT") ) return "MEAT";
		if( item.hasTag("VEGETABLE") ) return "VEGETABLE";
		if( item.hasTag("FRUIT") ) return "FRUIT";
		if( item.hasTag("GRAIN") ) return "GRAIN";
		return "OTHER";
	}
	
	public static Comparator<FoodItem> byFoodItemCategory = ( item1, item2 ) -> {
		List<String> tags = Arrays.asList( "MILK", "MEAT", "VEGETABLE", "FRUIT", "GRAIN", "OTHER" );		
		return tags.indexOf( bestTagValue(item1) ) - tags.indexOf( bestTagValue(item2) );
	};


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FoodItem other = (FoodItem) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
	
	
	
}
