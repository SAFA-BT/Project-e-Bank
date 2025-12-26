package com.ebank.backend_service.repositories;

import com.ebank.backend_service.entities.Compte;
import com.ebank.backend_service.entities.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationRepository extends JpaRepository<Operation, Long> {
    Page<Operation> findByCompteOrderByDateOperationDesc(Compte cpte, Pageable pageable);
}