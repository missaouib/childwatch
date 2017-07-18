package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Participant;
import org.springframework.data.repository.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface ParticipantRoomAssignmentRepository extends Repository<ParticipantRoomAssignment, Integer> {
    Optional<ParticipantRoomAssignment> findByParticipantAndDate(Participant participant, LocalDate date);

    void save(ParticipantRoomAssignment participantRoomAssignment);

    List<ParticipantRoomAssignment> findByDate(LocalDate date);
}
