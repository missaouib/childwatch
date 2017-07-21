package com.remarkablesystems.childwatch.graphql;

import com.coxautodev.graphql.tools.GraphQLRootResolver;
import com.remarkablesystems.childwatch.domain.meal.FoodItem;
import com.remarkablesystems.childwatch.domain.meal.repository.FoodComponentRepository;
import com.remarkablesystems.childwatch.domain.meal.repository.FoodItemRepository;
import com.remarkablesystems.childwatch.domain.meal.FoodComponent;
import com.remarkablesystems.childwatch.domain.people.*;
import com.remarkablesystems.childwatch.domain.room.Room;
import com.remarkablesystems.childwatch.domain.room.Rooms;
import com.remarkablesystems.childwatch.domain.scheduling.PersonPresenceLog;
import com.remarkablesystems.childwatch.domain.scheduling.PersonRoomAssignment;
import com.remarkablesystems.childwatch.domain.scheduling.PersonSchedule;
import com.remarkablesystems.childwatch.domain.scheduling.Scheduling;
import com.remarkablesystems.childwatch.view.scheduling.PersonTimeline;
import com.remarkablesystems.childwatch.view.scheduling.PresenceEntry;
import com.remarkablesystems.childwatch.view.scheduling.RoomAssignmentEntry;
import graphql.language.Field;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static com.remarkablesystems.childwatch.domain.people.People.*;
import static java.util.Collections.emptyList;
import static java.util.Collections.sort;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

@Component
public class Query implements GraphQLRootResolver {
	private final Rooms rooms;
    private final People people;
    private final Scheduling scheduling;
    private final FoodComponentRepository foodCategoryRepository;

    @Autowired
    public Query(Rooms rooms, People people, Scheduling scheduling, FoodComponentRepository foodCategoryRepository) {
        this.rooms = rooms;
        this.people = people;
        this.scheduling = scheduling;
        this.foodCategoryRepository = foodCategoryRepository;
    }

    public List<Room> rooms() {
        return rooms.findAll();
    }

    
    public Iterable<FoodComponent> foods(DataFetchingEnvironment env){
   		return foodCategoryRepository.findAll();
    }
    
    public List<Staff> staff() {
        return people.findAllStaff();
    }

    public List<Participant> participants(DataFetchingEnvironment env) {
        int fetchFlags = NO_SPECIAL_INCLUDES;
        if (includesPath(env, "participants", "families")) {
            fetchFlags |= INCLUDE_FAMILIES;
        }
        if (includesPath(env, "participants", "nonParticipantRelationships")) {
            fetchFlags |= INCLUDE_NON_PARTICIPANT_RELATIONSHIPS;
        }
        return people.findAllParticipants(fetchFlags);
    }

    public List<NonParticipant> nonParticipants() {
        return people.findAllNonParticipants();
    }

    public List<Family> families() {
        return people.findAllFamilies();
    }

    // TODO @Transactional
    public List<PersonTimeline> staffTimeline(LocalDate date) {
        return personTimeline(
                scheduling.findRoomAssignmentsForStaff(date),
                scheduling.findPresenceLogForStaff(date));
    }

    public List<PersonTimeline> participantTimeline(LocalDate date) {
        return personTimeline(
                scheduling.findRoomAssignmentsForParticipants(date),
                scheduling.findPresenceLogForParticipants(date));
    }

    private List<PersonTimeline> personTimeline(
            List<? extends PersonRoomAssignment> assignments,
            List<? extends PersonPresenceLog> presence) {
        Map<String, List<RoomAssignmentEntry>> _assignments = assignmentsByPerson(assignments);
        Map<String, List<PresenceEntry>> _presence = presenceByPerson(presence);
        return Stream.concat(_assignments.keySet().stream(), _presence.keySet().stream())
                .distinct()
                .map(personId -> new PersonTimeline(
                        personId,
                        _presence.getOrDefault(personId, emptyList()),
                        _assignments.getOrDefault(personId, emptyList())))
                .collect(toList());
    }

    private Map<String, List<RoomAssignmentEntry>> assignmentsByPerson(
            List<? extends PersonRoomAssignment> assignments) {
        return assignments
                .stream()
                .collect(toMap(
                        a -> a.getPersonId(),
                        a -> a.getEntries()
                                .stream()
                                .map(e -> new RoomAssignmentEntry(e.getRoomId(), e.getStart(), e.getEnd()))
                                .collect(toList())));
    }

    private Map<String, List<PresenceEntry>> presenceByPerson(List<? extends PersonPresenceLog> presence) {
        presence = new ArrayList<>(presence);
        sort(presence);
        Map<String, List<PresenceEntry>> presenceByPerson = new HashMap<>();
        String lastPersonId = null;
        List<PresenceEntry> entries = null;
        PresenceEntry lastEntry = null;
        for (PersonPresenceLog log : presence) {
            if (!log.getPersonId().equals(lastPersonId)) {
                entries = new ArrayList<>();
                lastEntry = null;
                presenceByPerson.put(log.getPersonId(), entries);
                lastPersonId = log.getPersonId();
            }
            switch (log.getType()) {
                case ARRIVAL:
                    if (lastEntry != null && lastEntry.isOpen()) {
                        lastEntry.end = log.getEventTime();
                    }

                    lastEntry = new PresenceEntry(log.getRoom().getId(), log.getEventTime());
                    entries.add(lastEntry);
                    break;
                case DEPARTURE:
                    if (lastEntry != null && lastEntry.isOpen()) {
                        lastEntry.end = log.getEventTime();
                    }
                    break;
            }
        }

        return presenceByPerson;
    }

    public PersonSchedule personSchedule(String personId, LocalDate effectiveOn) {
        return scheduling.findPersonScheduleEffectiveOn(personId, effectiveOn).orElse(null);
    }

    public User myself() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getPrincipal() instanceof UserDetails) {
            UserDetails user = (UserDetails) auth.getPrincipal();
            List<String> authorities = user.getAuthorities().stream().map(a -> a.getAuthority()).collect(toList());
            return new User(user.getUsername(), authorities);
        }
        return null;
    }

    /**
     * Does NOT support fragments and inline fragments yet.
     */
    private static boolean includesPath(DataFetchingEnvironment env, String... fieldPath) {
        Collection<Field> fields = env.getFields();
        for (int i = 0; i < fieldPath.length - 1; i++) {
            fields = fields.stream().filter(hasName(fieldPath[i])).flatMap(toSubfields()).collect(toList());
        }
        return fields.stream().anyMatch(hasName(fieldPath[fieldPath.length - 1]));
    }

    private static Predicate<Field> hasName(String name) {
        return f -> f.getName().equals(name);
    }

    /**
     * Does NOT support fragments and inline fragments yet.
     */
    private static Function<Field, Stream<Field>> toSubfields() {
        return f -> f.getSelectionSet().getSelections().stream().filter(s -> s instanceof Field).map(s -> (Field) s);
    }
}
