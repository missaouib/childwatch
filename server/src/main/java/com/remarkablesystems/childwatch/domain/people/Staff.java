package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Staff implements Person {
    @Id
    @Column(name = "staff_id")
    private String id;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;

    private Staff() {
    }

    public Staff(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
