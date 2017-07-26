package com.remarkablesystems.childwatch.domain.meal;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Entity 
@Table(name="food_item")
@NoArgsConstructor @AllArgsConstructor @ToString
public class FoodItem implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id @NonNull @Getter 
	private String id;

	@NonNull @Getter @Setter
	private String description;

	@Column(name="short_description")
	@Getter @Setter
	private String shortDescription;
	
	@Column(name="purchase_uom")
	@Getter @Setter
	private String purchaseUom;

	@Column(name="serving_uom")
	@Getter @Setter
	private String servingUom;

	@ManyToOne
	@JoinColumn(name="food_component_id")	
	@Getter @Setter
	private FoodComponent foodComponent;
	
	
	public FoodItem( String id, String description, FoodComponent foodComponent ) {
		this.id = id;
		this.description = description;
		this.foodComponent = foodComponent;
	}
}
