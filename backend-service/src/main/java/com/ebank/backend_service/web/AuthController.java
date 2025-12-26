package com.ebank.backend_service.web;

import com.ebank.backend_service.entities.AppUser;
import com.ebank.backend_service.repositories.UserRepository;
import com.ebank.backend_service.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/login")
@CrossOrigin("*")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository ur, PasswordEncoder e, JwtUtils ju) {
        this.userRepo = ur;
        this.encoder = e;
        this.jwtUtils = ju;
    }

    @PostMapping
    public Map<String, String> authenticate(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        System.out.println("Login info: username=" + username + ", password=" + password);
        AppUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("User not found: " + username);
                    return new RuntimeException("Login ou mot de passe erronés");
                });

        System.out.println("User found: " + user.getUsername() + ", DB Password Hash: " + user.getPassword());
        if (!encoder.matches(password, user.getPassword())) {
            System.out.println("Password mismatch for user: " + username);
            System.out.println("Encoded input password would be: " + encoder.encode(password));
            throw new RuntimeException("Login ou mot de passe erronés");
        }
        System.out.println("Login successful for: " + username);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return Map.of("token", token, "role", user.getRole());
    }
}