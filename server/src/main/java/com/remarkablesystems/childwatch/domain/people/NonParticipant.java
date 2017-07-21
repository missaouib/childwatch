package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name="non_participant")
public class NonParticipant {
    @Id
    @Column(name = "non_participant_id")
    private String id;
    @NotNull
    @Column(name="first_name")
    private String firstName;
    @NotNull
    @Column(name="last_name")
    private String lastName;
    @OneToMany(mappedBy = "nonParticipant")
    @MapKeyJoinColumn(name = "participant_id")
    private Map<Participant, NonParticipantRelationship> participantRelationships = new HashMap<>();

    NonParticipant() {
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
