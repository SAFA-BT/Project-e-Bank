package com.ebank.backend_service.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateOperation; // RG_15 [cite: 78]
    private double montant;
    private String type; // Débit ou Crédit [cite: 63]
    private String intitule;
    @ManyToOne
    private Compte compte;
}