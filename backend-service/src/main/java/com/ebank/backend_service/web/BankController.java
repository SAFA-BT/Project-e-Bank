package com.ebank.backend_service.web;

import com.ebank.backend_service.dtos.*;
import com.ebank.backend_service.entities.*;
import com.ebank.backend_service.repositories.OperationRepository;
import com.ebank.backend_service.services.BankService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class BankController {
    private final BankService bankService;
    private final OperationRepository opRepo;

    public BankController(BankService bs, OperationRepository or) {
        this.bankService = bs;
        this.opRepo = or;
    }

    // --- AGENT Ends ---

    @PostMapping("/agent/clients")
    public ClientDTO saveClient(@RequestBody ClientDTO clientDTO) {
        Client c = new Client();
        c.setNom(clientDTO.getNom());
        c.setPrenom(clientDTO.getPrenom());
        c.setEmail(clientDTO.getEmail());
        c.setAdressePostale(clientDTO.getAdressePostale());
        c.setDateAnniversaire(clientDTO.getDateAnniversaire());
        c.setNumeroIdentite(clientDTO.getNumeroIdentite());
        Client saved = bankService.creerClient(c);
        clientDTO.setId(saved.getId());
        return clientDTO;
    }

    @PostMapping("/agent/accounts")
    public AccountDTO createAccount(@RequestBody CreateAccountDTO request) {
        // RG_9 checked in service (simple check)
        Client client = new Client();
        client.setId(request.getClientId()); // Assuming mapped by ID

        Compte c = new Compte();
        c.setRib(request.getRib());
        c.setSolde(request.getInitialBalance());
        c.setClient(client);

        Compte saved = bankService.creerCompte(c);

        AccountDTO resp = new AccountDTO();
        resp.setRib(saved.getRib());
        resp.setSolde(saved.getSolde());
        resp.setStatut(saved.getStatut());
        // We could map client back here but skipping for brevity as Agent knows the
        // client
        return resp;
    }

    // --- CLIENT Ends ---

    @GetMapping("/client/accounts")
    public List<AccountDTO> myAccounts(Principal principal) {
        String email = principal.getName();
        Client client = bankService.getClientByEmail(email);
        return bankService.getAccountsByClient(client.getId()).stream()
                .map(this::mapToAccountDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/client/accounts/{rib}")
    public AccountDTO getAccount(@PathVariable String rib) {
        return mapToAccountDTO(bankService.getAccount(rib));
    }

    @PostMapping("/client/virement")
    public void doVirement(@RequestBody TransferRequestDTO req) {
        bankService.virement(req.getRibSource(), req.getRibDest(), req.getMontant());
    }

    @GetMapping("/client/operations/{rib}")
    public Page<Operation> listOps(@PathVariable String rib, @RequestParam(defaultValue = "0") int page) {
        return opRepo.findByCompteOrderByDateOperationDesc(new Compte(rib, 0, null, null), PageRequest.of(page, 10));
    }

    private AccountDTO mapToAccountDTO(Compte c) {
        AccountDTO dto = new AccountDTO();
        dto.setRib(c.getRib());
        dto.setSolde(c.getSolde());
        dto.setStatut(c.getStatut());
        if (c.getClient() != null) {
            ClientDTO cd = new ClientDTO();
            cd.setId(c.getClient().getId());
            cd.setNom(c.getClient().getNom());
            cd.setPrenom(c.getClient().getPrenom());
            cd.setEmail(c.getClient().getEmail());
            dto.setClient(cd);
        }
        return dto;
    }
}