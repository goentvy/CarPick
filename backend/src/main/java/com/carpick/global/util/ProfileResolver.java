package com.carpick.global.util;

import java.util.Arrays;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProfileResolver {

    private final Environment environment;

    public boolean isProd() {
        return Arrays.asList(environment.getActiveProfiles())
                     .contains("prod");
    }
}

