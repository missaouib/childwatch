package com.remarkablesystems.childwatch.domain.people.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.people.Person;


@RepositoryRestResource(collectionResourceRel = "persons", path = "person")
public interface PersonRepository extends CrudRepository<Person, String> {

}
