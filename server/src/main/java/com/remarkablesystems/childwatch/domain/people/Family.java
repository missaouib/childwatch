package com.remarkablesystems.childwatch.domain.people;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Family {
    @Id
    @Column(name = "family_id")
    private String id;
    @NotNull
    private String name;

    Family() {
    }

    public Family(String name) {
        this.name = name;
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
}
