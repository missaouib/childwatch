package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Entity
public class NonParticipant {
    @Id
    @Column(name = "non_participant_id")
    private String id;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @OneToMany(mappedBy = "nonParticipant")
    @MapKeyJoinColumn(name = "participant_id")
    private Map<Participant, NonParticipantRelationship> participantRelationships = new HashMap<>();

    private NonParticipant() {
    }

    public NonParticipant(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Map<Participant, NonParticipantRelationship> getParticipantRelationships() {
        return Collections.unmodifiableMap(participantRelationships);
    }
}
