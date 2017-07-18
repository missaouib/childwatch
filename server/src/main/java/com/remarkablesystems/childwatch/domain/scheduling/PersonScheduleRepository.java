package com.remarkablesystems.childwatch.domain.scheduling;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.time.LocalDate;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface PersonScheduleRepository extends Repository<PersonSchedule, String> {
    @Query("from PersonSchedule ps where personId = ?1 and effectiveDate <= ?2 order by ps.effectiveDate desc")
    Optional<PersonSchedule> findEffectiveOn(String personId, LocalDate effectiveOn);

    Optional<PersonSchedule> findByPersonIdAndEffectiveDate(String personId, LocalDate effectiveDate);

    void save(PersonSchedule personSchedule);
}
