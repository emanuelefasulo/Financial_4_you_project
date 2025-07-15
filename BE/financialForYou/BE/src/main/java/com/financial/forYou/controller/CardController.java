package com.financial.forYou.controller;


import com.financial.forYou.model.Carta;
import com.financial.forYou.service.CardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/private/")
@CrossOrigin(origins = "*")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }


    @PostMapping("/aggiungi/{userId}")
    public ResponseEntity<Carta> aggiungiCarta(
            @PathVariable Long userId,
            @RequestBody Carta carta
    ) {
        Carta nuovaCarta = cardService.aggiungiCarta(userId, carta);
        return ResponseEntity.ok(nuovaCarta);
    }

    @DeleteMapping("/elimina/{id}")
    public ResponseEntity<String> eliminaCarta(@PathVariable Long id) {
        try {
            cardService.eliminaCarta(id);
            return ResponseEntity.ok("Carta eliminata con successo.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
