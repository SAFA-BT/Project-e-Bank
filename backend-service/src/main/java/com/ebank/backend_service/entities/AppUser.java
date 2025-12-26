package com.ebank.backend_service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // RG_1: Doit être crypté [cite: 43]
    private String role; // CLIENT ou AGENT_GUICHET

}