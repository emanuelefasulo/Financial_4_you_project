package com.financial.forYou.controller;

import com.financial.forYou.exception.DatabaseException;
import com.financial.forYou.exception.handler.GlobalExceptionHandler;
import com.financial.forYou.model.User;
import com.financial.forYou.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getUserById_Success() throws Exception {
        // Given
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setName("John");
        user.setCognome("Doe");
        user.setEmail("john.doe@example.com");

        when(userService.getUserById(userId)).thenReturn(user);

        // When & Then
        mockMvc.perform(get("/api/private/user/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.cognome").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void getUserById_ThrowsDatabaseException() throws Exception {
        // Given
        int userId = 1;

        when(userService.getUserById(anyLong()))
                .thenThrow(new DatabaseException("Database error", new RuntimeException("DB problem")));

        // When & Then
        mockMvc.perform(get("/api/private/user/{id}", userId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Si é verificato un errore interno, riprovare!!!")));

        verify(userService, times(1)).getUserById((long) userId);
    }

    @Test
    void getUserById_UserNotFound() throws Exception {
        // Given
        Long userId = 1L;

        when(userService.getUserById(userId))
                .thenThrow(new DatabaseException("User not found", new RuntimeException("No user with id 999")));

        // When & Then
        mockMvc.perform(get("/api/private/user/{id}", userId))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Si é verificato un errore interno, riprovare!!!")));

        verify(userService, times(1)).getUserById(userId);
    }

    // Alternative approach: Test the controller method directly
    @Test
    void getUserById_DirectCall_Success() {
        // Given
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setName("John");
        user.setCognome("Doe");

        when(userService.getUserById(userId)).thenReturn(user);

        // When
        User result = userController.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("John", result.getName());
        assertEquals("Doe", result.getCognome());
        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void getUserById_DirectCall_ThrowsException() {
        // Given
        Long userId = 1L;
        DatabaseException expectedException = new DatabaseException("Database error", new RuntimeException("DB problem"));

        when(userService.getUserById(userId)).thenThrow(expectedException);

        // When & Then
        DatabaseException thrown = assertThrows(DatabaseException.class, () -> {
            userController.getUserById(userId);
        });

        assertEquals("Si é verificato un errore interno, riprovare!!!", thrown.getMessage());
        verify(userService, times(1)).getUserById(userId);
    }
}