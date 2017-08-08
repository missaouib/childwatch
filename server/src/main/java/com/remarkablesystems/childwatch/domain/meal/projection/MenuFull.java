package com.remarkablesystems.childwatch.domain.meal.projection;

import java.util.Date;

import org.springframework.data.rest.core.config.Projection;

import com.remarkablesystems.childwatch.domain.meal.Menu;

@Projection(name="menuFull", types= Menu.class )
public interface MenuFull {

	MealFull getMeal();

	Date getStartDate();

	Date getEndDate();

	String getRecurrence();

	String getId();

}
