package com.financial.forYou.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.forYou.model.Carta;
import com.financial.forYou.service.CardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigInteger;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CardControllerTest {

    @Mock
    private CardService cardService;

    @InjectMocks
    private CardController cardController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(cardController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void aggiungiCarta_Success() throws Exception {
        Long userId = 1L;
        Carta inputCarta = new Carta();
        inputCarta.setNumero(BigInteger.valueOf(1234567890123457L));
        inputCarta.setTipo("VISA");

        Carta savedCarta = new Carta();
        savedCarta.setId(1L);
        savedCarta.setNumero(BigInteger.valueOf(1234567890123456L));
        savedCarta.setTipo("VISA");

        when(cardService.aggiungiCarta(anyLong(), any(Carta.class))).thenReturn(savedCarta);

        mockMvc.perform(post("/api/private/aggiungi/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputCarta)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.numero").value("1234567890123456"))
                .andExpect(jsonPath("$.tipo").value("VISA"));

        verify(cardService, times(1)).aggiungiCarta(userId, inputCarta);
    }

    @Test
    void eliminaCarta_Success() throws Exception {
        Long cardId = 1L;

        mockMvc.perform(delete("/api/private/elimina/{id}", cardId))
                .andExpect(status().isOk())
                .andExpect(content().string("Carta eliminata con successo."));

        verify(cardService, times(1)).eliminaCarta(cardId);
    }

    @Test
    void eliminaCarta_ServiceThrowsException() throws Exception {
        Long cardId = 1L;
        doThrow(new RuntimeException("Card not found")).when(cardService).eliminaCarta(cardId);

        mockMvc.perform(delete("/api/private/elimina/{id}", cardId))
                .andExpect(status().isInternalServerError());

        verify(cardService, times(1)).eliminaCarta(cardId);
    }
}