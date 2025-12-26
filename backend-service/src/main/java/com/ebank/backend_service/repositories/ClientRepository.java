package com.ebank.backend_service.repositories;

import com.ebank.backend_service.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByNumeroIdentite(String ni);
}