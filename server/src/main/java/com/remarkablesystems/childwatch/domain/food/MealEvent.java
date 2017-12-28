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

import com.remarkablesystems.childwatch.domain.AuditedUser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name="meal_event")
@ToString(callSuper=true)
@EqualsAndHashCode(callSuper=true)
public class MealEvent extends AuditedUser implements Serializable {

	private static final long serialVersionUID = -5742620367800403437L;

	@Id
	@Getter
	private String id;
	
	@ManyToOne
	@JoinColumn(name="meal_id")
	@Getter @Setter
	Meal meal;
	
	@Column( name="start_date" )
	@Temporal( TemporalType.TIMESTAMP)
	@Getter @Setter
	Date startDate;

	@Column( name="end_date" )
	@Temporal( TemporalType.TIMESTAMP )
	@Getter @Setter
	Date endDate;
	
	@Enumerated(EnumType.STRING) @Column( name="recurrence" )
	@Getter @Setter
	Recurrence recurrence;
	
	
}
