package com.ebank.backend_service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nom; // RG_5 [cite: 50]
    @Column(nullable = false) private String prenom; // RG_5 [cite: 50]
    @Column(unique = true, nullable = false) private String numeroIdentite; // RG_4 [cite: 49]
    @Column(nullable = false) private LocalDate dateAnniversaire; // RG_5 [cite: 50]
    @Column(unique = true, nullable = false) private String email; // RG_6 [cite: 51]
    @Column(nullable = false) private String adressePostale; // RG_5 [cite: 50]
}