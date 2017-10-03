package com.remarkablesystems.childwatch.domain.food;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class FoodItemTag {
	
	@Column( name="tag_value" )
	private String value;
	
	public FoodItemTag() {}
	
	public FoodItemTag( String value ) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
}
