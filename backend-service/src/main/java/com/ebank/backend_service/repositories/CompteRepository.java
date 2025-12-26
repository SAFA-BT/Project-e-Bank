package com.ebank.backend_service.repositories;

import com.ebank.backend_service.entities.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompteRepository extends JpaRepository<Compte, String> {
    java.util.List<Compte> findByClientId(Long clientId);
}
