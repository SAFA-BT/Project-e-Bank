package com.ebank.backend_service.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String numeroIdentite;
    private LocalDate dateAnniversaire;
    private String email;
    private String adressePostale;
}
