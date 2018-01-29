package com.remarkablesystems.childwatch.domain.people.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.remarkablesystems.childwatch.domain.people.Participant;

@RepositoryRestResource(collectionResourceRel = "participants", path = "participant")
public interface ParticipantRepository extends CrudRepository<Participant, String> {

}