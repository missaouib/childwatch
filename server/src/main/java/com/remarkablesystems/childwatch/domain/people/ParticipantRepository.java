package com.remarkablesystems.childwatch.domain.people;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface ParticipantRepository extends Repository<Participant, String> {
    List<Participant> findAll();

    List<Participant> findByFamiliesId(String familyId);

    void save(Participant participant);

    Optional<Participant> findById(String participantId);

    @Query("select p from Participant p join fetch p.families")
    List<Participant> findAllWithFamilies();

    @Query("select p from Participant p join fetch p.nonParticipantRelationships")
    List<Participant> findAllWithNonParticipantRelationships();
}
