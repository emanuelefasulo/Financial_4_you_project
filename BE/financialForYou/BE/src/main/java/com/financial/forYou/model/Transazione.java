package com.financial.forYou.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;


@Entity
@Data
public class Transazione implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date data;

    @Column(nullable = false)
    private String descrizione;

    @Column(nullable = false)
    private Double importo;

    @Column(nullable = true)
    private Double initialPrice;

    @Column(nullable = true)
    private Double finalPrice;

    @Column(nullable = false)
    private boolean apertaChiusa;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

}
