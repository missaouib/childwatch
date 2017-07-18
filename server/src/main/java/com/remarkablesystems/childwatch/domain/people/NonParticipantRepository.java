package com.remarkablesystems.childwatch.domain.people;

import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface NonParticipantRepository extends Repository<NonParticipant, String> {
    List<NonParticipant> findAll();

    void save(NonParticipant nonParticipant);

    Optional<NonParticipant> findById(String nonParticipantId);
}
