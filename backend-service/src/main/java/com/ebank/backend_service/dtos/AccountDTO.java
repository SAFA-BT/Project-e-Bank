package com.ebank.backend_service.dtos;

import lombok.Data;

@Data
public class AccountDTO {
    private String rib;
    private double solde;
    private String statut;
    private ClientDTO client;
}
