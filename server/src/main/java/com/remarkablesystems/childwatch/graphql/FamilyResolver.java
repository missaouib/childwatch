package com.remarkablesystems.childwatch.graphql;

import com.coxautodev.graphql.tools.GraphQLResolver;
import com.remarkablesystems.childwatch.domain.people.Family;
import com.remarkablesystems.childwatch.domain.people.Participant;
import com.remarkablesystems.childwatch.domain.people.People;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FamilyResolver implements GraphQLResolver<Family> {
    private final People people;

    public FamilyResolver(People people) {
        this.people = people;
    }

    public List<Participant> participants(Family family) {
        return people.findParticipantsByFamily(family.getId());
    }
}

