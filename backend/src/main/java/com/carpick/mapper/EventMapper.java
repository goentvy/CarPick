package com.carpick.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.carpick.model.EventDTO;

@Mapper
public interface EventMapper {

    @Select("SELECT * FROM event WHERE endDate > NOW() ORDER BY id DESC")
    List<EventDTO> getList();
    
    @Select("SELECT * FROM event WHERE endDate < NOW() ORDER BY id DESC")
    List<EventDTO> getEndList();

    @Select("SELECT * FROM event WHERE id = #{id}")
    EventDTO getEvent(int id);

    @Insert("""
        INSERT INTO event(title, content, start_date, end_date, thumbnail, created_at, updated_at)
        VALUES(#{title}, #{content}, #{startDate}, #{endDate}, #{thumbnail},NOW(),NOW())
    """)
    void insertEvent(EventDTO event);

    @Update("""
        UPDATE event SET
        title=#{title},
        content=#{content},
        start_date=#{startDate},
        end_date=#{endDate},
        thumbnail=#{thumbnail},
        updated_at=NOW()
        WHERE id=#{id}
    """)
    void updateEvent(EventDTO event);

    @Delete("DELETE FROM event WHERE id=#{id}")
    void deleteEvent(int id);
}