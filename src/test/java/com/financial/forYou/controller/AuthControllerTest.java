package com.financial.forYou.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.forYou.service.AccountService;
import com.financial.forYou.util.JwtUtils;
import com.financial.forYou.util.TokenBlacklist;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AccountService accountService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private TokenBlacklist tokenBlacklist;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void logout_Success() throws Exception {
        String token = "Bearer jwt-token";

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(content().string("Logged out"));

        verify(tokenBlacklist, times(1)).blacklistToken("jwt-token");
    }


    @Test
    void logout_InvalidAuthHeader() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Invalid token"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Missing or invalid Authorization header"));

        verify(tokenBlacklist, never()).blacklistToken(anyString());
    }
}