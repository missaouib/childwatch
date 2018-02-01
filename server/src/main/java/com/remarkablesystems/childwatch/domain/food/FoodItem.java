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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.remarkablesystems.childwatch.domain.AuditedTenantUser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Entity 
@Table(name="food_item")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class FoodItem extends AuditedTenantUser implements Serializable{

	private static final long serialVersionUID = 3576833611221593267L;

	@Id @Getter
	private String id;

	@Getter @Setter
	private String description;

	@Column(name="short_description")
	@Getter @Setter
	private String shortDescription;
	
	@Column(name="purchase_unit")
	@Enumerated(EnumType.STRING)	
	@Getter @Setter
	private UnitOfMeasure purchaseUom;

	@Column(name="serving_unit")
	@Enumerated(EnumType.STRING)
	@Getter @Setter
	private UnitOfMeasure servingUom;
	
	@Column(name="notes")
	@Getter @Setter
	private String notes;
	
	@ManyToOne
	@JoinColumn(name="parent_id")
	@Getter
	private FoodItem parent;
	
	@OneToMany( mappedBy="parent" )
	@Getter
	private List<FoodItem> components;
	
	@Column(name="serving_quantity")
	@Getter @Setter
	private double servingQuantity;
	
	@Column(name="serving_type")
	@Getter @Setter
	private String servingType;
	
	@Column(name="portion_size")
	@Getter @Setter
	private double portionSize;
	

	@ElementCollection
	@CollectionTable( name="food_item_tag", joinColumns=@JoinColumn( name="food_item_id" ) )
	@Getter
	private Set<FoodItemTag> tags;
	
	public FoodItem() {}
	
	public FoodItem( String id, String description, List<String> tags ) {
		this.id = id;
		this.description = description;
		this.shortDescription = description;
		if( tags != null )
			tags.stream().forEach( tag -> this.addTag( tag ) );
		
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
	
	@Transient
	static String bestTagValue( FoodItem item ) {
		if( item == null ) return "OTHER";
		if( item.hasTag("MILK") ) return "MILK";
		if( item.hasTag("MEAT" ) || item.hasTag("MEATALT") ) return "MEAT";
		if( item.hasTag("VEGETABLE") ) return "VEGETABLE";
		if( item.hasTag("FRUIT") ) return "FRUIT";
		if( item.hasTag("GRAIN") ) return "GRAIN";
		if( item.hasTag("CNITEM") ) return "CNITEM";
		return "OTHER";
	}
	
	@Transient
	public String bestTag() {
		return FoodItem.bestTagValue(this);
	}
	
	@Transient
	public static Comparator<FoodItem> byFoodItemCategory = ( item1, item2 ) -> {
		List<String> tags = Arrays.asList( "MILK", "CNITEM", "MEAT", "VEGETABLE", "FRUIT", "GRAIN", "OTHER" );		
		int val = tags.indexOf( bestTagValue(item1) ) - tags.indexOf( bestTagValue(item2) );
		if( val < 0 ) val = -1;
		if( val > 0 ) val = 1;
		return val == 0 && item1 != null && item1.description != null && item2 != null ? item1.description.compareToIgnoreCase(item2.description ) : val;
	};
	
}
