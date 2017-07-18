package com.remarkablesystems.childwatch.domain.room;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Room {
    @Id
    @Column(name = "room_id")
    private String id;
    @NotNull
    private String name;
    private int staffCapacity;
    private int targetCapacity;
    private int maxCapacity;

    private Room() {
    }

    public Room(String id) {
        this.id = id;
    }

    public Room(String name, int staffCapacity, int targetCapacity, int maxCapacity) {
        this.name = name;
        this.staffCapacity = staffCapacity;
        this.targetCapacity = targetCapacity;
        this.maxCapacity = maxCapacity;
    }

    void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getStaffCapacity() {
        return staffCapacity;
    }

    public int getTargetCapacity() {
        return targetCapacity;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }
}
