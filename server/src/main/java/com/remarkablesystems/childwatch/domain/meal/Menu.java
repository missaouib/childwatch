package com.remarkablesystems.childwatch.domain.meal;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="menu")
public class Menu {

	@Id
	private String id;
	
	@ManyToOne
	@JoinColumn(name="meal_id")
	Meal meal;
	
	@Column( name="start_date" )
	Date startDate;

	@Column( name="end_date" )
	Date endDate;
	
	@Column( name="recurrence" )
	String recurrence;

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

	public String getRecurrence() {
		return recurrence;
	}

	public void setRecurrence(String recurrence) {
		this.recurrence = recurrence;
	}

	public String getId() {
		return id;
	}

	
	
	
}
