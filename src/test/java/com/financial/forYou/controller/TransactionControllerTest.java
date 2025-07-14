package com.financial.forYou.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.forYou.exception.DatabaseException;
import com.financial.forYou.model.Transazione;
import com.financial.forYou.service.TransazioneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransazioneService transazioneService;

    @InjectMocks
    private TransactionController transactionController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void insertTransaction_Success() throws Exception {
        Transazione inputTransaction = new Transazione();
        inputTransaction.setImporto(100.0);
        inputTransaction.setDescrizione("Test transaction");

        Transazione savedTransaction = new Transazione();
        savedTransaction.setId(1L);
        savedTransaction.setImporto(100.0);
        savedTransaction.setDescrizione("Test transaction");

        when(transazioneService.insertTransaction(any(Transazione.class))).thenReturn(savedTransaction);

        mockMvc.perform(post("/api/private/insert-transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputTransaction)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.importo").value(100.0))
                .andExpect(jsonPath("$.descrizione").value("Test transaction"));

        verify(transazioneService, times(1)).insertTransaction(any(Transazione.class));
    }

    @Test
    void updateCard_Success() throws Exception {
        Transazione transazione = new Transazione();
        transazione.setId(1L);
        transazione.setImporto(100.0);
        transazione.setInitialPrice(50.0);
        transazione.setFinalPrice(75.0);

        mockMvc.perform(post("/api/private/update-transazione")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transazione)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.Difference").value("150.0"));

        verify(transazioneService, times(1)).updateTransazione(any(Transazione.class));
    }

    @Test
    void updateCard_ThrowsDatabaseException() throws Exception {
        Transazione transazione = new Transazione();
        transazione.setImporto(100.0);
        transazione.setInitialPrice(50.0);
        transazione.setFinalPrice(70.0);
        transazione.setId(1L);
        transazione.setApertaChiusa(true);

        doThrow(new DatabaseException("Si é verificato un errore interno, riprovare!!!",
                new RuntimeException("Si é verificato un errore interno, riprovare!!!")))
                .when(transazioneService).updateTransazione(any(Transazione.class));

        mockMvc.perform(post("/api/private/update-transazione")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transazione)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Si é verificato un errore interno, riprovare!!!"));

        verify(transazioneService, times(1)).updateTransazione(any(Transazione.class));
    }

    @Test
    void SelectAllTransaction_Success() throws Exception {
        Transazione transaction1 = new Transazione();
        transaction1.setId(1L);
        transaction1.setImporto(100.0);

        Transazione transaction2 = new Transazione();
        transaction2.setId(2L);
        transaction2.setImporto(200.0);

        List<Transazione> transactions = Arrays.asList(transaction1, transaction2);

        when(transazioneService.getTransazioni()).thenReturn(transactions);

        mockMvc.perform(get("/api/private/get-transaction"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].importo").value(100.0))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].importo").value(200.0));

        verify(transazioneService, times(1)).getTransazioni();
    }
}