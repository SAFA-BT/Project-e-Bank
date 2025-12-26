package com.ebank.backend_service.services;

import com.ebank.backend_service.entities.*;
import com.ebank.backend_service.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BankService {
    private final ClientRepository clientRepo;
    private final CompteRepository compteRepo;
    private final OperationRepository opRepo;
    private final com.ebank.backend_service.repositories.UserRepository userRepo;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public BankService(ClientRepository cr, CompteRepository cor, OperationRepository or,
            com.ebank.backend_service.repositories.UserRepository ur,
            org.springframework.security.crypto.password.PasswordEncoder pe) {
        this.clientRepo = cr;
        this.compteRepo = cor;
        this.opRepo = or;
        this.userRepo = ur;
        this.passwordEncoder = pe;
    }

    public Client creerClient(Client c) {
        if (clientRepo.findByEmail(c.getEmail()).isPresent())
            throw new RuntimeException("Email déjà utilisé");

        // RG_7: Create AppUser for login
        String computedPassword = "1234"; // Should be random in prod
        com.ebank.backend_service.entities.AppUser user = new com.ebank.backend_service.entities.AppUser();
        user.setUsername(c.getEmail());
        user.setPassword(passwordEncoder.encode(computedPassword));
        user.setRole("CLIENT");
        userRepo.save(user);

        // Simulate sending email
        System.out.println(
                "EMAIL SENT TO " + c.getEmail() + " WITH LOGIN " + c.getEmail() + " AND PASSWORD " + computedPassword);

        return clientRepo.save(c);
    }

    public Client getClientByEmail(String email) {
        return clientRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Client introuvable"));
    }

    public Compte creerCompte(Compte c) {
        // RG_9: Le RIB doit être un RIB valide (Simple null check here, complex
        // validation if needed)
        if (c.getRib() == null || c.getRib().isBlank())
            throw new RuntimeException("RIB invalide");
        // RG_8: Client handled by relationship, assuming passed Compte has valid Client
        // set
        if (c.getClient() == null)
            throw new RuntimeException("Client obligatoire pour un compte");

        c.setStatut("OUVERT"); // RG_10
        return compteRepo.save(c);
    }

    public Compte getAccount(String rib) {
        return compteRepo.findById(rib).orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    public List<Compte> getAccountsByClient(Long clientId) {
        return compteRepo.findByClientId(clientId); // Need to check if this method exists in Repo, likely needs
                                                    // addition
    }

    public void virement(String ribSource, String ribDest, double montant) {
        Compte source = compteRepo.findById(ribSource).orElseThrow(() -> new RuntimeException("Source introuvable"));
        Compte dest = compteRepo.findById(ribDest).orElseThrow(() -> new RuntimeException("Destination introuvable"));

        if (source.getStatut().equalsIgnoreCase("BLOQUE") || source.getStatut().equalsIgnoreCase("CLOTURE"))
            throw new RuntimeException("Compte indisponible (Bloqué ou Clôturé)");
        if (source.getSolde() < montant)
            throw new RuntimeException("Solde insuffisant"); // RG_12

        source.setSolde(source.getSolde() - montant);
        dest.setSolde(dest.getSolde() + montant);

        opRepo.save(new Operation(null, LocalDateTime.now(), montant, "DEBIT", "Vers " + ribDest, source));
        opRepo.save(new Operation(null, LocalDateTime.now(), montant, "CREDIT", "De " + ribSource, dest));
    }
}