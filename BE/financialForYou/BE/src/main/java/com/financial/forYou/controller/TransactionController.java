package com.financial.forYou.controller;

import com.financial.forYou.exception.DatabaseException;
import com.financial.forYou.model.Transazione;
import com.financial.forYou.service.TransazioneService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/private/")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransazioneService transazioneService;

    public TransactionController(TransazioneService transazioneService) {
        this.transazioneService = transazioneService;
    }


    @PostMapping("/insert-transaction")
    public ResponseEntity<?> insertTransaction(@RequestBody Transazione transazione) {
        try {
            Transazione transaction = transazioneService.insertTransaction(transazione);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to insert transaction");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PostMapping(value = "/update-transazione", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> updateCard(@RequestBody Transazione transazione) {
        try {
            transazioneService.updateTransazione(transazione);
            Double difference = (transazione.getImporto() /  transazione.getInitialPrice()) * transazione.getFinalPrice();
            return ResponseEntity.ok().body(Collections.singletonMap("Difference", difference + ""));
        } catch (DatabaseException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Si é verificato un errore interno, riprovare!!!"));
        }
    }


    @GetMapping("/get-transaction")
    public ResponseEntity<List<Transazione>> SelectAllTransaction() {
        return ResponseEntity.ok(transazioneService.getTransazioni());
    }
}
