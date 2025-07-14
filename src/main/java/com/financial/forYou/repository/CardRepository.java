package com.financial.forYou.repository;

import com.financial.forYou.model.Carta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Carta, Long> {
}
