package com.remarkablesystems.childwatch.domain.scheduling;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

import static java.util.Arrays.asList;
import static java.util.Collections.unmodifiableList;
import static java.util.stream.Collectors.toList;

@Entity
@Table(indexes = {@Index(columnList = "person_id,effective_date", unique = true)})
public class PersonSchedule {
    @NotNull
    @Id
    @Column(name = "person_id")
    private String personId;
    @Column(name = "effective_date")
    private LocalDate effectiveDate;
    private ScheduleEntry[][] schedule;

    private PersonSchedule() {
    }

    public PersonSchedule(String personId, LocalDate effectiveDate, List<List<ScheduleEntry>> entries) {
        this.personId = personId;
        this.effectiveDate = effectiveDate;
        updateSchedule(entries);
    }

    public String getPersonId() {
        return personId;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public List<List<ScheduleEntry>> getSchedule() {
        return unmodifiableList(
                Stream.of(schedule)
                        .map(inner -> unmodifiableList(asList(inner)))
                        .collect(toList())
        );
    }

    public void updateSchedule(List<List<ScheduleEntry>> entries) {
        this.schedule = entries.stream()
                .map(l -> l.toArray(new ScheduleEntry[l.size()]))
                .toArray(n -> new ScheduleEntry[n][]);
    }
}
