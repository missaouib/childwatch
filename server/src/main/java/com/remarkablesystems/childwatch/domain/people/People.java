package com.remarkablesystems.childwatch.domain.people;

import com.remarkablesystems.childwatch.exception.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(transactionManager = "domainTransactionManager")
public class People {
    public static final int NO_SPECIAL_INCLUDES = 0;
    public static final int INCLUDE_FAMILIES = 1 << 0;
    public static final int INCLUDE_NON_PARTICIPANT_RELATIONSHIPS = 1 << 1;

    private final StaffRepository staffRepository;
    private final FamilyRepository familyRepository;
    private final ParticipantRepository participantRepository;
    private final NonParticipantRepository nonParticipantRepository;

    @Autowired
    public People(StaffRepository staffRepository, FamilyRepository familyRepository, ParticipantRepository
            participantRepository, NonParticipantRepository nonParticipantRepository) {
        this.staffRepository = staffRepository;
        this.familyRepository = familyRepository;
        this.participantRepository = participantRepository;
        this.nonParticipantRepository = nonParticipantRepository;
    }

    public List<Staff> findAllStaff() {
        return this.staffRepository.findAll();
    }

    public Staff findStaff(String staffId) {
        return staffRepository.findById(staffId)
                .orElseThrow(() -> new NotFound("Staff not found: " + staffId));
    }

    public void createStaff(Staff staff) {
        staff.setId(UUID.randomUUID().toString());
        staffRepository.save(staff);
    }

    public List<NonParticipant> findAllNonParticipants() {
        return this.nonParticipantRepository.findAll();
    }

    public NonParticipant findNonParticipant(String nonParticipantId) {
        return nonParticipantRepository.findById(nonParticipantId)
                .orElseThrow(() -> new NotFound("NonParticipant not found: " + nonParticipantId));
    }

    public void createNonParticipant(NonParticipant nonParticipant) {
        nonParticipant.setId(UUID.randomUUID().toString());
        nonParticipantRepository.save(nonParticipant);
    }

    public List<Participant> findAllParticipants() {
        return findAllParticipants(NO_SPECIAL_INCLUDES);
    }

    public List<Participant> findAllParticipants(int fetchFlags) {
        List<Participant> participants = this.participantRepository.findAll();
        if (hasFlag(fetchFlags, INCLUDE_FAMILIES)) {
            participantRepository.findAllWithFamilies();
        }
        if (hasFlag(fetchFlags, INCLUDE_NON_PARTICIPANT_RELATIONSHIPS)) {
            participantRepository.findAllWithNonParticipantRelationships();
        }
        return participants;
    }

    public Participant findParticipant(String participantId) {
        return participantRepository.findById(participantId)
                .orElseThrow(() -> new NotFound("Participant not found: " + participantId));
    }

    public List<Participant> findParticipantsByFamily(String familyId) {
        return participantRepository.findByFamiliesId(familyId);
    }

    public void createParticipant(Participant participant) {
        participant.setId(UUID.randomUUID().toString());
        participantRepository.save(participant);
    }

    public List<Family> findAllFamilies() {
        return this.familyRepository.findAll();
    }

    public Family findFamily(String familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new NotFound("Family not found: " + familyId));
    }

    public void createFamily(Family family) {
        family.setId(UUID.randomUUID().toString());
        familyRepository.save(family);
    }

    public void addFamily(String participantId, String familyId) throws NotFound {
        Participant participant = findParticipant(participantId);
        Family family = findFamily(familyId);
        participant.addFamily(family);
    }

    public void updateNonParticipantRelationship(
            String participantId, String nonParticipantId, NonParticipantRelationship nonParticipantRelationship) {
        Participant p = findParticipant(participantId);
        NonParticipant npp = findNonParticipant(nonParticipantId);
        p.updateNonParticipantRelationship(npp, nonParticipantRelationship);
    }

    private static boolean hasFlag(int fetchFlags, int flag) {
        return (flag & fetchFlags) != 0;
    }
}
