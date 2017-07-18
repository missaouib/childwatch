package com.remarkablesystems.childwatch.graphql;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.remarkablesystems.childwatch.domain.scheduling.RoomAssignmentEntry;
import com.remarkablesystems.childwatch.domain.scheduling.ScheduleEntry;
import com.remarkablesystems.childwatch.domain.scheduling.Scheduling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@Component
public class Mutation implements GraphQLMutationResolver {
    private final Scheduling scheduling;

    @Autowired
    public Mutation(Scheduling scheduling) {
        this.scheduling = scheduling;
    }

    public String updateStaffRoomAssignment(String staffId, LocalDate date, List<Map> rawAssignments) {
        scheduling.updateStaffRoomAssignment(staffId, date, deserializeRoomAssignments(rawAssignments));
        return "ok";
    }

    public String updateParticipantRoomAssignment(String participantId, LocalDate date, List<Map> rawAssignments) {
        scheduling.updateParticipantRoomAssignment(participantId, date, deserializeRoomAssignments(rawAssignments));
        return "ok";
    }

    private List<RoomAssignmentEntry> deserializeRoomAssignments(List<Map> rawAssignments) {
        // Ouch, graphql-java-tools does not deserialize for collections correctly, and just passes bare map. We
        // have to do the work ourselves.

        return rawAssignments.stream().map(m -> {
            return new RoomAssignmentEntry(
                    (String) m.get("roomId"),
                    (OffsetDateTime) m.get("start"),
                    (OffsetDateTime) m.get("end"));
        }).collect(toList());
    }

    public String updateSchedule(String personId, LocalDate effectiveDate, List<List<ScheduleEntryInput>>
            rawScheduleInput) {
        List<List<ScheduleEntry>> entries = new ArrayList<>();
        for (List<?> rawList : rawScheduleInput) {
            // The type in method signature is a lie. Sadly, graphql-java-tools gives us a Map instead of
            // ScheduleEntryInput there. At the same time, the method signature *has to* include ScheduleEntryInput
            // to get the library validation to pass.
            entries.add(rawList.stream().map(s -> new ScheduleEntry((int) ((Map) s).get("start"), (int) ((Map) s).get
                    ("end"))).collect(toList()));
        }
        scheduling.updateSchedule(personId, effectiveDate, entries);
        return "ok";
    }
}
