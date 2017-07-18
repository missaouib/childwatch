package com.remarkablesystems.childwatch.domain.room;

import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
interface RoomRepository extends Repository<Room, String> {
    List<Room> findAll();

    void save(Room room);

    Optional<Room> findById(String roomId);
}
