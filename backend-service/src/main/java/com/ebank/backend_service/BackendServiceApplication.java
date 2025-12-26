package com.ebank.backend_service;

import com.ebank.backend_service.entities.AppUser;
import com.ebank.backend_service.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendServiceApplication.class, args);
	}

	// Bean nécessaire pour résoudre l'erreur d'autowire du PasswordEncoder
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); // RG_1: Mots de passe cryptés en base [cite: 43]
	}

	@Bean
	CommandLineRunner start(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Création des comptes de test pour l'UC-1 [cite: 30, 31, 32]
			// Création ou mise à jour des comptes de test pour l'UC-1 [cite: 30, 31, 32]
			System.out.println("Starting data seeding...");
			AppUser agent = userRepository.findByUsername("agent1").orElse(
					new AppUser(null, "agent1", "1234", "AGENT_GUICHET"));
			String encodedAgentPass = passwordEncoder.encode("1234");
			agent.setPassword(encodedAgentPass);
			agent.setRole("AGENT_GUICHET"); // Ensure role is correct
			userRepository.save(agent);
			System.out.println("Updated agent1 with password hash: " + encodedAgentPass);

			AppUser client = userRepository.findByUsername("client1").orElse(
					new AppUser(null, "client1", "1234", "CLIENT"));
			String encodedClientPass = passwordEncoder.encode("1234");
			client.setPassword(encodedClientPass);
			client.setRole("CLIENT"); // Ensure role is correct
			userRepository.save(client);
			System.out.println("Updated client1 with password hash: " + encodedClientPass);
			System.out.println("Data seeding completed.");
		};
	}
}