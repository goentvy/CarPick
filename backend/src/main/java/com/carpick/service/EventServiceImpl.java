package com.carpick.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import com.carpick.model.EventDTO;
import com.carpick.mapper.EventMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventMapper eventMapper;

    @Override
    public List<EventDTO> getList() {
        return eventMapper.getList();
    }
    
    @Override
    public List<EventDTO> getEndList() {
        return eventMapper.getEndList();
    }

    @Override
    public EventDTO getEvent(int id) {
        return eventMapper.getEvent(id);
    }

    @Override
    public void insertEvent(EventDTO event) {
        event.setCreated_at(LocalDateTime.now());
        event.setUpdated_at(LocalDateTime.now());
        eventMapper.insertEvent(event);
    }

    @Override
    public void updateEvent(EventDTO event) {
        event.setUpdated_at(LocalDateTime.now());
        eventMapper.updateEvent(event);
    }

    @Override
    public void deleteEvent(int id) {
        eventMapper.deleteEvent(id);
    }
}