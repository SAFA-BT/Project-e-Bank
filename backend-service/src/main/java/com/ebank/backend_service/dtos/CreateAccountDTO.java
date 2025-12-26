package com.ebank.backend_service.dtos;

import lombok.Data;

@Data
public class CreateAccountDTO {
    private String rib;
    private double initialBalance;
    private Long clientId;
}
