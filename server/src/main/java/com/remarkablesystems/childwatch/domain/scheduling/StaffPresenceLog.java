package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Staff;
import com.remarkablesystems.childwatch.domain.room.Room;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Entity
public class StaffPresenceLog implements PersonPresenceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @NotNull
    @Column(name = "event_time", columnDefinition = "timestamptz")
    private OffsetDateTime eventTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PresenceLogType type;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private StaffPresenceLog() {
    }

    public StaffPresenceLog(Staff staff, OffsetDateTime eventTime, PresenceLogType type, Room room) {
        this.staff = staff;
        this.eventTime = eventTime;
        this.type = type;
        this.room = room;
    }

    public Staff getStaff() {
        return staff;
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

    @Override
    public String getPersonId() {
        return getStaff().getId();
    }

    public static StaffPresenceLog arrival(Staff staff, OffsetDateTime eventTime, Room room) {
        return new StaffPresenceLog(staff, eventTime, PresenceLogType.ARRIVAL, room);
    }

    public static StaffPresenceLog departure(Staff staff, OffsetDateTime eventTime) {
        return new StaffPresenceLog(staff, eventTime, PresenceLogType.DEPARTURE, null);
    }
}
