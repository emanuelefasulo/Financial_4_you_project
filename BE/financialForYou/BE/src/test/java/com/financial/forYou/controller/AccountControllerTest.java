package com.financial.forYou.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.forYou.model.Account;
import com.financial.forYou.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {

    @Mock
    private AccountService accountService;

    @InjectMocks
    private AccountController accountController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(accountController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createAccount_Success() throws Exception {
        // Given
        Account inputAccount = new Account();
        inputAccount.setUsername("testuser");
        inputAccount.setPassword("password123");

        Account savedAccount = new Account();
        savedAccount.setId(1L);
        savedAccount.setUsername("testuser");
        savedAccount.setPassword("encoded_password");

        when(accountService.createAccount(any(Account.class))).thenReturn(savedAccount);

        mockMvc.perform(post("/api/public/insert-account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputAccount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(accountService, times(1)).createAccount(any(Account.class));
    }


    @Test
    void forgotPassword_Success() throws Exception {
        Account inputAccount = new Account();
        inputAccount.setUsername("testuser");
        inputAccount.setPassword("newpassword");
        inputAccount.setKey_recovery("correct_key");

        Account dbAccount = new Account();
        dbAccount.setId(1L);
        dbAccount.setUsername("testuser");
        dbAccount.setKey_recovery("correct_key");

        when(accountService.getAccountByName("testuser")).thenReturn(dbAccount);

        mockMvc.perform(post("/api/public/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputAccount)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password resettata con successo"));

        verify(accountService, times(1)).getAccountByName("testuser");
        verify(accountService, times(1)).updateAccount(any(Account.class));
    }

    @Test
    void forgotPassword_WrongRecoveryKey() throws Exception {
        Account inputAccount = new Account();
        inputAccount.setUsername("testuser");
        inputAccount.setPassword("newpassword");
        inputAccount.setKey_recovery("wrong_key");

        Account dbAccount = new Account();
        dbAccount.setId(1L);
        dbAccount.setUsername("testuser");
        dbAccount.setKey_recovery("correct_key");

        when(accountService.getAccountByName("testuser")).thenReturn(dbAccount);

        mockMvc.perform(post("/api/public/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputAccount)))
                .andExpect(status().isOk())
                .andExpect(content().string("Parola chiave errata, non è possibile resettare la password"));

        verify(accountService, times(1)).getAccountByName("testuser");
        verify(accountService, never()).updateAccount(any(Account.class));
    }


}