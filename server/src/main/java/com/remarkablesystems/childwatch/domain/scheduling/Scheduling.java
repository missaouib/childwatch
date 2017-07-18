package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Participant;
import com.remarkablesystems.childwatch.domain.people.People;
import com.remarkablesystems.childwatch.domain.people.Staff;
import com.remarkablesystems.childwatch.domain.room.Room;
import com.remarkablesystems.childwatch.domain.room.Rooms;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class Scheduling {
    private final People people;
    private final Rooms rooms;

    private final ParticipantRoomAssignmentRepository participantAssignmentRepository;
    private final ParticipantPresenceLogRepository participantPresenceLogRepository;
    private final StaffRoomAssignmentRepository staffAssignmentRepository;
    private final StaffPresenceLogRepository staffPresenceLogRepository;
    private final PersonScheduleRepository personScheduleRepository;

    public Scheduling(People people,
                      Rooms rooms,
                      ParticipantRoomAssignmentRepository participantAssignmentRepository,
                      ParticipantPresenceLogRepository participantPresenceLogRepository,
                      StaffRoomAssignmentRepository staffAssignmentRepository,
                      StaffPresenceLogRepository staffPresenceLogRepository,
                      PersonScheduleRepository personScheduleRepository) {
        this.people = people;
        this.rooms = rooms;
        this.participantAssignmentRepository = participantAssignmentRepository;
        this.participantPresenceLogRepository = participantPresenceLogRepository;
        this.staffAssignmentRepository = staffAssignmentRepository;
        this.staffPresenceLogRepository = staffPresenceLogRepository;
        this.personScheduleRepository = personScheduleRepository;
    }

    public void updateParticipantRoomAssignment(
            String participantId, LocalDate date, List<RoomAssignmentEntry> entries) {
        Participant participant = people.findParticipant(participantId);
        entries = entries.stream()
                .map(a -> new RoomAssignmentEntry(rooms.findRoom(a.getRoom().getId()), a.getStart(), a.getEnd()))
                .sorted()
                .collect(toList());
        Optional<ParticipantRoomAssignment> assignment = participantAssignmentRepository.findByParticipantAndDate
                (participant,
                        date);
        if (assignment.isPresent()) {
            assignment.get().update(entries);
        } else {
            participantAssignmentRepository.save(new ParticipantRoomAssignment(participant, date, entries));
        }
    }

    public void recordParticipantArrival(String participantId, OffsetDateTime arrival, String roomId) {
        Participant participant = people.findParticipant(participantId);
        Room room = rooms.findRoom(roomId);
        participantPresenceLogRepository.save(ParticipantPresenceLog.arrival(participant, arrival, room));
    }

    public void recordParticipantDeparture(String participantId, OffsetDateTime departure) {
        Participant participant = people.findParticipant(participantId);
        participantPresenceLogRepository.save(ParticipantPresenceLog.departure(participant, departure));
    }

    public List<ParticipantRoomAssignment> findRoomAssignmentsForParticipants(LocalDate date) {
        return participantAssignmentRepository.findByDate(date);
    }

    public List<ParticipantPresenceLog> findPresenceLogForParticipants(LocalDate date) {
        // TODO move to util
        ZoneOffset offset = ZoneOffset.systemDefault().getRules().getOffset(date.atStartOfDay());
        OffsetDateTime start = OffsetDateTime.of(date, LocalTime.MIDNIGHT, offset);
        OffsetDateTime end = start.plusDays(1);
        return participantPresenceLogRepository.findByDateRange(start, end);
    }

    public void updateStaffRoomAssignment(
            String staffId, LocalDate date, List<RoomAssignmentEntry> entries) {
        Staff staff = people.findStaff(staffId);
        entries = entries.stream()
                .map(a -> new RoomAssignmentEntry(rooms.findRoom(a.getRoom().getId()), a.getStart(), a.getEnd()))
                .sorted()
                .collect(toList());
        Optional<StaffRoomAssignment> assignment = staffAssignmentRepository.findByStaffAndDate
                (staff, date);
        if (assignment.isPresent()) {
            assignment.get().update(entries);
        } else {
            staffAssignmentRepository.save(new StaffRoomAssignment(staff, date, entries));
        }
    }

    public void recordStaffArrival(String staffId, OffsetDateTime arrival, String roomId) {
        Staff staff = people.findStaff(staffId);
        Room room = rooms.findRoom(roomId);
        staffPresenceLogRepository.save(StaffPresenceLog.arrival(staff, arrival, room));
    }

    public void recordStaffDeparture(String staffId, OffsetDateTime departure) {
        Staff staff = people.findStaff(staffId);
        staffPresenceLogRepository.save(StaffPresenceLog.departure(staff, departure));
    }

    public List<StaffRoomAssignment> findRoomAssignmentsForStaff(LocalDate date) {
        return staffAssignmentRepository.findByDate(date);
    }

    public List<StaffPresenceLog> findPresenceLogForStaff(LocalDate date) {
        // TODO move to util
        ZoneOffset offset = ZoneOffset.systemDefault().getRules().getOffset(date.atStartOfDay());
        OffsetDateTime start = OffsetDateTime.of(date, LocalTime.MIDNIGHT, offset);
        OffsetDateTime end = start.plusDays(1);
        return staffPresenceLogRepository.findByDateRange(start, end);
    }

    public Optional<PersonSchedule> findPersonScheduleEffectiveOn(String personId, LocalDate effectiveOn) {
        return personScheduleRepository.findEffectiveOn(personId, effectiveOn);
    }

    public void updateSchedule(String personId, LocalDate effectiveDate, List<List<ScheduleEntry>> entries) {
        Optional<PersonSchedule> schedule = personScheduleRepository.findByPersonIdAndEffectiveDate
                (personId, effectiveDate);
        if (schedule.isPresent()) {
            schedule.get().updateSchedule(entries);
        } else {
            personScheduleRepository.save(new PersonSchedule(personId, effectiveDate, entries));
        }
    }
}
