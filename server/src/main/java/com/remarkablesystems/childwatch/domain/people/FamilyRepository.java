package com.remarkablesystems.childwatch.domain.people;

import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface FamilyRepository extends Repository<Family, String> {
    List<Family> findAll();

    void save(Family family);

    Optional<Family> findById(String familyId);
}
