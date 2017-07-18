package com.remarkablesystems.childwatch.graphql;

import com.coxautodev.graphql.tools.GraphQLResolver;
import com.remarkablesystems.childwatch.domain.people.Family;
import com.remarkablesystems.childwatch.domain.people.NonParticipantRelationship;
import com.remarkablesystems.childwatch.domain.people.Participant;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ParticipantResolver implements GraphQLResolver<Participant> {

    public List<Family> families(Participant participant) {
        return new ArrayList<>(participant.getFamilies());
    }

    public List<NonParticipantRelationship> nonParticipantRelationships(Participant participant) {
        return new ArrayList<>(participant.getNonParticipantRelationships().values());
    }
}
