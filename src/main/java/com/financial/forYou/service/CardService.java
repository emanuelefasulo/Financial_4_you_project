package com.financial.forYou.service;

import com.financial.forYou.model.Carta;
import com.financial.forYou.model.User;
import com.financial.forYou.repository.CardRepository;
import com.financial.forYou.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CardService {

    private CardRepository cartaRepository;

    private UserRepository userRepository;

    public Carta aggiungiCarta(Long userId, Carta carta) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + userId));
        carta.setUser(user);
        return cartaRepository.save(carta);
    }


    public void eliminaCarta(Long cartaId) {
        if (!cartaRepository.existsById(cartaId)) {
            throw new RuntimeException("Carta non trovata con ID: " + cartaId);
        }

        cartaRepository.deleteById(cartaId);
    }

}
