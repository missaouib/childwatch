package com.remarkablesystems.childwatch.view.scheduling;

import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class PresenceEntry {
    @NotNull
    public String roomId;
    @NotNull
    public OffsetDateTime start;
    public OffsetDateTime end;

    public PresenceEntry(String roomId, OffsetDateTime start, OffsetDateTime end) {
        this.roomId = roomId;
        this.start = start;
        this.end = end;
    }

    public PresenceEntry(String roomId, OffsetDateTime start) {
        this(roomId, start, null);
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

    public boolean isOpen() {
        return end == null;
    }
}
