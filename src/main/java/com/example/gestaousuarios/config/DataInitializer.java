package com.example.gestaousuarios.config;

import com.example.gestaousuarios.model.Perfil;
import com.example.gestaousuarios.model.Usuario;
import com.example.gestaousuarios.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!repository.existsByEmail(
                    "admin@email.com")) {

                repository.save(
                        new Usuario(
                                "Administrador",
                                "admin@email.com",
                                passwordEncoder.encode("123456"),
                                Perfil.ADMIN
                        )
                );
            }

            if (!repository.existsByEmail(
                    "operador@email.com")) {

                repository.save(
                        new Usuario(
                                "Operador",
                                "operador@email.com",
                                passwordEncoder.encode("123456"),
                                Perfil.OPERADOR
                        )
                );
            }

            if (!repository.existsByEmail(
                    "cliente@email.com")) {

                repository.save(
                        new Usuario(
                                "Cliente",
                                "cliente@email.com",
                                passwordEncoder.encode("123456"),
                                Perfil.CLIENTE
                        )
                );
            }
        };
    }
}