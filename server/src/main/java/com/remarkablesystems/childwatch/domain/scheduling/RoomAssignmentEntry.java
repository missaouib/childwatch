package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.room.Room;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.Comparator;

@Embeddable
public class RoomAssignmentEntry implements Comparable<RoomAssignmentEntry> {
    @NotNull
    @ManyToOne
    @JoinColumn(name = "room_id")
    @Fetch(FetchMode.JOIN)
    private Room room;
    @NotNull
    @Column(name = "start_time", columnDefinition = "timestamptz")
    private OffsetDateTime start;
    @NotNull
    @Column(name = "end_time", columnDefinition = "timestamptz")
    private OffsetDateTime end;

    private RoomAssignmentEntry() {
    }

    public RoomAssignmentEntry(String roomId, OffsetDateTime start, OffsetDateTime end) {
        this(new Room(roomId), start, end);
    }

    public RoomAssignmentEntry(Room room, OffsetDateTime start, OffsetDateTime end) {
        this.room = room;
        this.start = start;
        this.end = end;
    }

    public Room getRoom() {
        return room;
    }

    public OffsetDateTime getStart() {
        return start;
    }

    public OffsetDateTime getEnd() {
        return end;
    }

    @Override
    public int compareTo(RoomAssignmentEntry o) {
        return Comparator.<RoomAssignmentEntry, OffsetDateTime>comparing(e -> e.getStart()).compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoomAssignmentEntry)) return false;

        RoomAssignmentEntry that = (RoomAssignmentEntry) o;

        if (!room.getId().equals(that.room.getId())) return false;
        if (!start.equals(that.start)) return false;
        return end.equals(that.end);
    }

    @Override
    public int hashCode() {
        int result = start.hashCode();
        result = 31 * result + end.hashCode();
        return result;
    }

    public String getRoomId() {
        return getRoom().getId();
    }
}
