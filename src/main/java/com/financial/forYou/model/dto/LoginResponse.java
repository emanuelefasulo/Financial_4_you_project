package com.financial.forYou.model.dto;

import lombok.Data;

@Data
public class LoginResponse {

    private Long userId;
    private String token;

    public LoginResponse(String s, Long id) {
    }
}
