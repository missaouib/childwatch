package com.remarkablesystems.childwatch.domain.food;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import com.remarkablesystems.childwatch.domain.AuditedUser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Embeddable
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class FoodItemTag extends AuditedUser {
	
	@Column( name="tag_value" )
	@Getter
	private String value;
	
	public FoodItemTag() {}
	
	public FoodItemTag( String value ) {
		this.value = value;
	}
	
}
