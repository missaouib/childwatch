package com.remarkablesystems.childwatch.domain.food;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
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
	
	@Column( name="recurrence_id" )
	String recurrenceId;

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

	public String getRecurrenceId() {
		return recurrenceId;
	}

	public void setRecurrenceId(String recurrenceId) {
		this.recurrenceId = recurrenceId;
	}

	public String getId() {
		return id;
	}

	
	
	
}
