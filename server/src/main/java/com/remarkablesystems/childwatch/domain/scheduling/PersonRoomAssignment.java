package com.remarkablesystems.childwatch.domain.scheduling;

import java.util.List;

public interface PersonRoomAssignment {
    String getPersonId();

    List<RoomAssignmentEntry> getEntries();
}
