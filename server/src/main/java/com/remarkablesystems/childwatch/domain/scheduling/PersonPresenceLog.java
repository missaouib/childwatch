package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.room.Room;

import java.time.OffsetDateTime;

import static java.util.Comparator.comparing;

public interface PersonPresenceLog extends Comparable<PersonPresenceLog> {
    String getPersonId();

    OffsetDateTime getEventTime();

    PresenceLogType getType();

    Room getRoom();

    @Override
    default int compareTo(PersonPresenceLog o) {
        return comparing((PersonPresenceLog l) -> l.getPersonId())
                .thenComparing(comparing((PersonPresenceLog l) -> l.getEventTime()))
                .compare(this, o);
    }
}
