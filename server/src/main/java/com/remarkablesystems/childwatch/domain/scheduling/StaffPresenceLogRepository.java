package com.remarkablesystems.childwatch.domain.scheduling;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.time.OffsetDateTime;
import java.util.List;

interface StaffPresenceLogRepository extends Repository<StaffPresenceLog, Integer> {
    void save(StaffPresenceLog log);

    // "Between" in Spring Data JPA is inclusive on the right end
    @Query("from StaffPresenceLog l " +
            "where l.eventTime >= ?1 and l.eventTime < ?2 " +
            "order by l.staff.id, l.eventTime ")
    List<StaffPresenceLog> findByDateRange(OffsetDateTime start, OffsetDateTime end);
}
