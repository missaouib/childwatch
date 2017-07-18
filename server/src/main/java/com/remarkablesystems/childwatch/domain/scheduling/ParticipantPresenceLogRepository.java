package com.remarkablesystems.childwatch.domain.scheduling;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.time.OffsetDateTime;
import java.util.List;

interface ParticipantPresenceLogRepository extends Repository<ParticipantPresenceLog, Integer> {
    void save(ParticipantPresenceLog log);

    // "Between" in Spring Data JPA is inclusive on the right end
    @Query("from ParticipantPresenceLog l " +
            "where l.eventTime >= ?1 and l.eventTime < ?2 " +
            "order by l.participant.id, l.eventTime ")
    List<ParticipantPresenceLog> findByDateRange(OffsetDateTime start, OffsetDateTime end);
}
