package com.financial.forYou.service;

import com.financial.forYou.model.Transazione;
import com.financial.forYou.model.User;
import com.financial.forYou.repository.TransizioneRepository;
import com.financial.forYou.repository.UserRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TransazioneService {

    private final TransizioneRepository transizioneRepository;
    private final UserRepository userRepository;

    public TransazioneService(TransizioneRepository transizioneRepository, UserRepository userRepository) {
        this.transizioneRepository = transizioneRepository;
        this.userRepository = userRepository;
    }

    public Transazione insertTransaction(Transazione transaction) {
        Long userId = transaction.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        transaction.setUser(user);
        return transizioneRepository.save(transaction);
    }

    public void updateTransazione(Transazione transaction) throws DataAccessException {
        transizioneRepository.updateapertaChiusaById(transaction.getId(), transaction.isApertaChiusa());
    }

    public List<Transazione> getTransazioni() {
        return transizioneRepository.findAll();
    }

}
