package com.carpick.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
@Getter
public class FileProperties {
    @Value("${file.upload.path}")
    private String uploadPath;
}
