package com.remarkablesystems.childwatch.domain.people;

import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface StaffRepository extends Repository<Staff, String> {
    List<Staff> findAll();

    void save(Staff staff);

    Optional<Staff> findById(String staffId);
}
