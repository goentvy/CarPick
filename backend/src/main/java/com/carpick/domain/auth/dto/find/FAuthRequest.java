package com.carpick.domain.auth.dto.find;

import lombok.Getter;
import lombok.Setter;

public class FAuthRequest {

    @Getter
    @Setter
    public static class FindId {
        private String name;
        private String email;
    }

    @Getter
    @Setter
    public static class ResetPassword {
        private String email;
    }
}
