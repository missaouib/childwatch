package com.remarkablesystems.childwatch.view.scheduling;

import java.util.List;

public class PersonTimeline {
    public String personId;
    public List<PresenceEntry> presence;
    public List<RoomAssignmentEntry> roomAssignments;

    public PersonTimeline() {
    }

    public PersonTimeline(String personId, List<PresenceEntry> presence, List<RoomAssignmentEntry> roomAssignments) {
        this.personId = personId;
        this.presence = presence;
        this.roomAssignments = roomAssignments;
    }

    public String getPersonId() {
        return personId;
    }

    public List<PresenceEntry> getPresence() {
        return presence;
    }

    public List<RoomAssignmentEntry> getRoomAssignments() {
        return roomAssignments;
    }

    @Override
    public String toString() {
        return "PersonTimeline{" +
                "personId='" + personId + '\'' +
                ", presence=" + presence +
                ", assignments=" + roomAssignments +
                '}';
    }
}
