package com.remarkablesystems.childwatch.domain.room;

import com.remarkablesystems.childwatch.exception.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class Rooms {
    private final RoomRepository roomRepository;

    @Autowired
    public Rooms(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> findAll() {
        return this.roomRepository.findAll();
    }

    public void createRoom(Room room) {
        room.setId(UUID.randomUUID().toString());
        roomRepository.save(room);
    }

    public Room findRoom(String roomId) {
        return roomRepository.findById(roomId).orElseThrow(() -> new NotFound("Room not found: " + roomId));
    }
}
