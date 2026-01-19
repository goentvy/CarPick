package com.carpick.global.mybatis.handler;

import com.carpick.domain.auth.entity.Gender;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.*;

@MappedTypes(Gender.class)                 // 🔥 핵심 1
@MappedJdbcTypes(JdbcType.VARCHAR)          // 🔥 핵심 2
public class GenderTypeHandler extends BaseTypeHandler<Gender> {

    @Override
    public void setNonNullParameter(
            PreparedStatement ps,
            int i,
            Gender parameter,
            JdbcType jdbcType
    ) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public Gender getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : Gender.valueOf(value);
    }

    @Override
    public Gender getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : Gender.valueOf(value);
    }

    @Override
    public Gender getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : Gender.valueOf(value);
    }
}
