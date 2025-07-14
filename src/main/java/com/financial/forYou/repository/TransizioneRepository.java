package com.financial.forYou.repository;

import com.financial.forYou.model.Transazione;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransizioneRepository extends JpaRepository<Transazione, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Transazione c SET c.apertaChiusa = :apertaChiusa WHERE c.id = :id")
    void updateapertaChiusaById(@Param("id") Long id, @Param("apertaChiusa") boolean apertaChiusa);

}
