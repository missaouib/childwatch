package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class NonParticipantRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "participant_id")
    private Participant participant;
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "non_participant_id")
    private NonParticipant nonParticipant;
    private boolean dropoffAuthorization;
    @Enumerated(EnumType.STRING)
    private PickupAuthorization pickupAuthorization;
    private boolean paymentResponsibility;
    private boolean parent;
    private String notes;

    private NonParticipantRelationship() {
    }

    public NonParticipantRelationship(boolean dropoffAuthorization, PickupAuthorization pickupAuthorization, boolean
            paymentResponsibility, boolean parent, String notes) {
        this.dropoffAuthorization = dropoffAuthorization;
        this.pickupAuthorization = pickupAuthorization;
        this.paymentResponsibility = paymentResponsibility;
        this.parent = parent;
        this.notes = notes;
    }

    public Participant getParticipant() {
        return participant;
    }

    public NonParticipant getNonParticipant() {
        return nonParticipant;
    }

    public boolean isDropoffAuthorization() {
        return dropoffAuthorization;
    }

    public PickupAuthorization getPickupAuthorization() {
        return pickupAuthorization;
    }

    public boolean isPaymentResponsibility() {
        return paymentResponsibility;
    }

    public boolean isParent() {
        return parent;
    }

    public String getNotes() {
        return notes;
    }

    void setParticipant(Participant participant) {
        this.participant = participant;
    }

    void setNonParticipant(NonParticipant nonParticipant) {
        this.nonParticipant = nonParticipant;
    }

    void updateFrom(NonParticipantRelationship relationship) {
        this.dropoffAuthorization = relationship.dropoffAuthorization;
        this.pickupAuthorization = relationship.pickupAuthorization;
        this.paymentResponsibility = relationship.paymentResponsibility;
        this.parent = relationship.parent;
        this.notes = relationship.notes;
    }
}
