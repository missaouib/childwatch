package com.remarkablesystems.childwatch.domain.food;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="meal_event")
public class MealEvent {

	@Id
	private String id;
	
	@ManyToOne
	@JoinColumn(name="meal_id")
	Meal meal;
	
	@Column( name="start_date" )
	Date startDate;

	@Column( name="end_date" )
	Date endDate;
	
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

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
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
