package com.remarkablesystems.childwatch.domain.food;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.remarkablesystems.childwatch.domain.AuditedUser;
import com.remarkablesystems.childwatch.domain.Spring;
import com.remarkablesystems.childwatch.mpr.MprController;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="meal_production_food_item")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealProductionFoodItem extends AuditedUser {
	
	@Transient
	Logger logger = LoggerFactory.getLogger( getClass().getName() );
	
	public MealProductionFoodItem(){ super(); }
	
	public MealProductionFoodItem( String id, MealProductionRecord mpr, FoodItem foodItem ) {
		this.id = id;
		this.mpr = mpr;
		this.foodItem = foodItem;
		required = 0;
		prepared = 0;
		this.unit = foodItem.getPurchaseUom();
	}
	
	@Id
	@Getter
	String id;
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="mpr_id", referencedColumnName="id")
	@Getter
	@JsonIgnore()
	MealProductionRecord mpr;
	
	@ManyToOne
	@PrimaryKeyJoinColumn( name="food_item_id", referencedColumnName="id")
	@Getter @Setter
	private FoodItem foodItem;
	
	
	@Column(name="required")
	@Getter @Setter
	double required;

	@Column(name="prepared")
	@Getter @Setter
	double prepared;
	
	@Column(name="unit")
	@Enumerated(EnumType.STRING)
	@Getter @Setter
	UnitOfMeasure unit;
	
	@Transient
	public double getCalcRequired() {
		MprController mprController = Spring.bean(MprController.class);
		return ( mpr.locked )? this.required:mprController.calcRequired(this);			
	}
	
	
}
