package com.remarkablesystems.childwatch.view.scheduling;

import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class RoomAssignmentEntry {
    @NotNull
    private final String roomId;
    @NotNull
    private final OffsetDateTime start;
    @NotNull
    private final OffsetDateTime end;

    public RoomAssignmentEntry(String roomId, OffsetDateTime start, OffsetDateTime end) {
        this.roomId = roomId;
        this.start = start;
        this.end = end;
    }

    public String getRoomId() {
        return roomId;
    }

    public OffsetDateTime getStart() {
        return start;
    }

    public OffsetDateTime getEnd() {
        return end;
    }

    @Override
    public String toString() {
        return "RoomAssignmentEntry{" +
                "roomId='" + roomId + '\'' +
                ", start=" + start +
                ", end=" + end +
                '}';
    }
}