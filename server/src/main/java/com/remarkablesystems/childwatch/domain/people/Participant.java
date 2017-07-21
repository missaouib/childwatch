package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name="participant")
public class Participant implements Person {
    @Id
    @Column(name = "participant_id")
    private String id;
    @NotNull
    @Column( name="first_name")
    private String firstName;
    @NotNull
    @Column(name="last_name")
    private String lastName;
    @Column(name="date_of_birth")
    private LocalDate dateOfBirth;
    @Column(name="img_url")
    private String imgUrl;
    @ManyToMany
    @JoinTable(
            name = "participant_family",
            joinColumns = {@JoinColumn(name = "participant_id")},
            inverseJoinColumns = {@JoinColumn(name = "family_id")})
    private Set<Family> families = new HashSet<>();
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "participant")
    @MapKeyJoinColumn(name = "non_participant_id")
    private Map<NonParticipant, NonParticipantRelationship> nonParticipantRelationships = new HashMap<>();

    Participant() {
    }

    public Participant(String firstName, String lastName, LocalDate dateOfBirth, String imgUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.imgUrl = imgUrl;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public Set<Family> getFamilies() {
        return Collections.unmodifiableSet(families);
    }

    public Map<NonParticipant, NonParticipantRelationship> getNonParticipantRelationships() {
        return Collections.unmodifiableMap(nonParticipantRelationships);
    }

    void addFamily(Family family) {
        this.families.add(family);
    }

    void updateNonParticipantRelationship(NonParticipant npp, NonParticipantRelationship relationship) {
        NonParticipantRelationship existing = nonParticipantRelationships.get(npp);
        if (existing == null) {
            relationship.setParticipant(this);
            relationship.setNonParticipant(npp);
            nonParticipantRelationships.put(npp, relationship);
        } else {
            existing.updateFrom(relationship);
        }
    }
}
