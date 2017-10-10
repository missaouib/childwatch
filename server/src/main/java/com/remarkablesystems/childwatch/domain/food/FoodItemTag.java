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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((value == null) ? 0 : value.hashCode());
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
		FoodItemTag other = (FoodItemTag) obj;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "FoodItemTag [value=" + value + "]";
	}
	
	
}
