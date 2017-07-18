package com.remarkablesystems.childwatch.domain.scheduling;

import com.remarkablesystems.childwatch.domain.people.Staff;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(indexes = {@Index(columnList = "staff_id,date")})
public class StaffRoomAssignment implements PersonRoomAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @NotNull
    private LocalDate date;

    @ElementCollection
    @OrderBy("start")
    @Fetch(FetchMode.JOIN)
    private List<RoomAssignmentEntry> entries = new ArrayList<>();

    private StaffRoomAssignment() {
    }

    public StaffRoomAssignment(Staff staff, LocalDate date, List<RoomAssignmentEntry> entries) {
        this.staff = staff;
        this.date = date;
        this.entries = entries;
    }

    void update(List<RoomAssignmentEntry> entries) {
        this.entries.clear();
        this.entries.addAll(entries);
    }

    @Override
    public String getPersonId() {
        return staff.getId();
    }

    public List<RoomAssignmentEntry> getEntries() {
        return Collections.unmodifiableList(entries);
    }
}
