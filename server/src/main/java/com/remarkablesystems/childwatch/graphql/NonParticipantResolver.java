package com.remarkablesystems.childwatch.graphql;

import com.coxautodev.graphql.tools.GraphQLResolver;
import com.remarkablesystems.childwatch.domain.people.NonParticipant;
import com.remarkablesystems.childwatch.domain.people.NonParticipantRelationship;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class NonParticipantResolver implements GraphQLResolver<NonParticipant> {

    public List<NonParticipantRelationship> participantRelationships(NonParticipant nonParticipant) {
        return new ArrayList<>(nonParticipant.getParticipantRelationships().values());
    }
}
