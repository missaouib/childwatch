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

	@Getter @Setter
	@Column(name="short_description")
	private String shortDescription;

	@ManyToOne
	@JoinColumn(name="food_component_id")
	@NonNull @Getter @Setter
	private FoodComponent foodComponent;
}
