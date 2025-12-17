package com.carpick.domain.event.service;

import java.util.List;
import com.carpick.domain.event.model.EventDTO;

public interface EventService {
    List<EventDTO> getList();
    List<EventDTO> getEndList();
    EventDTO getEvent(int id);
    void insertEvent(EventDTO event);
    void updateEvent(EventDTO event);
    void deleteEvent(int id);
	List<EventDTO> searchEvents(String search, String type);
}