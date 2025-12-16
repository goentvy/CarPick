package com.carpick.domain.event.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.carpick.domain.event.model.EventDTO;

@Mapper
public interface EventMapper {

    @Select("SELECT * FROM event WHERE endDate > NOW() ORDER BY id DESC")
    List<EventDTO> getList();
    
    @Select("SELECT * FROM event WHERE endDate < NOW() ORDER BY id DESC")
    List<EventDTO> getEndList();

    @Select("SELECT * FROM event WHERE id = #{id}")
    EventDTO getEvent(int id);
    
    @Select("SELECT * FROM event WHERE (title LIKE CONCAT('%', #{search}, '%') OR content LIKE CONCAT('%', #{search}, '%'))")
    List<EventDTO> searchOngoingEvents(String search);

    @Select("SELECT * FROM event WHERE (title LIKE CONCAT('%', #{search}, '%') OR content LIKE CONCAT('%', #{search}, '%'))")
    List<EventDTO> searchEndEvents(String search);


    @Insert("""
        INSERT INTO event(title, content, startDate, endDate, thumbnail, created_at, updated_at)
        VALUES(#{title}, #{content}, #{startDate}, #{endDate}, #{thumbnail},NOW(),NOW())
    """)
    void insertEvent(EventDTO event);

    @Update("""
        UPDATE event SET
        title=#{title},
        content=#{content},
        startDate=#{startDate},
        endDate=#{endDate},
        thumbnail=#{thumbnail},
        updated_at=NOW()
        WHERE id=#{id}
    """)
    void updateEvent(EventDTO event);

    @Delete("DELETE FROM event WHERE id=#{id}")
    void deleteEvent(int id);
}