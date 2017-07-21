package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Participant;
import com.remarkablesystems.childwatch.domain.room.Room;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Entity
@Table(name="participant_presence_log")
public class ParticipantPresenceLog implements PersonPresenceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @NotNull
    @Column(name = "event_time", columnDefinition = "timestamptz")
    private OffsetDateTime eventTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PresenceLogType type;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    ParticipantPresenceLog() {
    }

    public ParticipantPresenceLog(Participant participant, OffsetDateTime eventTime, PresenceLogType type, Room room) {
        this.participant = participant;
        this.eventTime = eventTime;
        this.type = type;
        this.room = room;
    }

    public Participant getParticipant() {
        return participant;
    }

    @Override
    public String getPersonId() {
        return participant.getId();
    }

    public OffsetDateTime getEventTime() {
        return eventTime;
    }

    public PresenceLogType getType() {
        return type;
    }

    public Room getRoom() {
        return room;
    }

    public static ParticipantPresenceLog arrival(Participant participant, OffsetDateTime eventTime, Room room) {
        return new ParticipantPresenceLog(participant, eventTime, PresenceLogType.ARRIVAL, room);
    }

    public static ParticipantPresenceLog departure(Participant participant, OffsetDateTime eventTime) {
        return new ParticipantPresenceLog(participant, eventTime, PresenceLogType.DEPARTURE, null);
    }
}
