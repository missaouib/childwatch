package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Staff;
import org.springframework.data.repository.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface StaffRoomAssignmentRepository extends Repository<StaffRoomAssignment, Integer> {
    Optional<StaffRoomAssignment> findByStaffAndDate(Staff staff, LocalDate date);

    void save(StaffRoomAssignment staffRoomAssignment);

    List<StaffRoomAssignment> findByDate(LocalDate date);
}
