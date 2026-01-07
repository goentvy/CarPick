package com.carpick.domain.auth.dto.find;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class FAuthResponse {

    @Getter
    @AllArgsConstructor
    public static class FindId {
        private boolean success;
        private String message;

        private String maskedEmail;


    }

    @Getter
    @AllArgsConstructor
    public static class ResetPassword {
        private boolean success;
        private String message;
    }
}
