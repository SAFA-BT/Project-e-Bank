package com.ebank.backend_service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Compte {
    @Id
    private String rib; // RG_9 [cite: 56]
    private double solde;
    private String statut; // RG_10 [cite: 57]
    @ManyToOne
    private Client client; // RG_8 [cite: 55]

}