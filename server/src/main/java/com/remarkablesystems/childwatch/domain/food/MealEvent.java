package com.remarkablesystems.childwatch.domain.food;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.remarkablesystems.childwatch.domain.food.projection.MealEventFull;


@Entity
@Table(name="meal_event")
public class MealEvent implements Serializable {

	private static final long serialVersionUID = -5742620367800403437L;

	@Id
	private String id;
	
	@ManyToOne
	@JoinColumn(name="meal_id")
	Meal meal;
	
	@Column( name="start_date" )
	java.sql.Timestamp startDate;

	@Column( name="end_date" )
	java.sql.Timestamp endDate;
	
	@Enumerated(EnumType.STRING) @Column( name="recurrence" )
	Recurrence recurrence;

	public Meal getMeal() {
		return meal;
	}

	public void setMeal(Meal meal) {
		this.meal = meal;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(java.sql.Timestamp startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(java.sql.Timestamp endDate) {
		this.endDate = endDate;
	}

	public Recurrence getRecurrence() {
		return recurrence;
	}

	public void setRecurrence(Recurrence recurrence) {
		this.recurrence = recurrence;
	}

	public String getId() {
		return id;
	}

	
	
	
}
