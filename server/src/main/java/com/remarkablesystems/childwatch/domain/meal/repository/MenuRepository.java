package com.remarkablesystems.childwatch.domain.meal.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import com.remarkablesystems.childwatch.domain.meal.Menu;

@RepositoryRestResource(collectionResourceRel = "menus", path = "menu")
public interface MenuRepository extends CrudRepository<Menu, String> {
	
	@RestResource(path="between", rel="between" )
	@Query( "select m from Menu m where (:start <= m.endDate) and (:end >= m.startDate)" ) 
	List<Menu> findBetween( @Param("start") Date start,  @Param("end") Date end);

}