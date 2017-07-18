package com.remarkablesystems.childwatch.graphql;

import com.remarkablesystems.childwatch.domain.scheduling.RoomAssignmentEntry;

import java.time.OffsetDateTime;

/**
 * This class is only here because the GraphQL library requires different one for input and query.
 */
public class RoomAssignmentInput extends RoomAssignmentEntry {
    public RoomAssignmentInput(String roomId, OffsetDateTime start, OffsetDateTime end) {
        super(roomId, start, end);
    }
}
