package com.ebank.backend_service.dtos;

import lombok.Data;

@Data
public class TransferRequestDTO {
    private String ribSource;
    private String ribDest;
    private double montant;
    private String motif;
}
