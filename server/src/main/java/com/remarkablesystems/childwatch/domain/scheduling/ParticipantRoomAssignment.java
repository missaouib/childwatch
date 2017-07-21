package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Participant;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.unmodifiableList;

@Entity
@Table(name="participant_room_assignment", indexes = {@Index(columnList = "participant_id,date")})
public class ParticipantRoomAssignment implements PersonRoomAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @NotNull
    private LocalDate date;

    @ElementCollection
    @OrderBy("start")
    @CollectionTable( name="participant_room_assignment_entries", joinColumns=@JoinColumn(name="participant_room_assignment_id") )
    @Fetch(FetchMode.JOIN)
    private List<RoomAssignmentEntry> entries = new ArrayList<>();

    ParticipantRoomAssignment() {
    }

    public ParticipantRoomAssignment(Participant participant, LocalDate date, List<RoomAssignmentEntry> entries) {
        this.participant = participant;
        this.date = date;
        this.entries = entries;
    }

    public void update(List<RoomAssignmentEntry> entries) {
        this.entries.clear();
        this.entries.addAll(entries);
    }

    @Override
    public String getPersonId() {
        return participant.getId();
    }

    @Override
    public List<RoomAssignmentEntry> getEntries() {
        return unmodifiableList(entries);
    }
}
