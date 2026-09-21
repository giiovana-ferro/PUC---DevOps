package com.example.gestaousuarios.controller;

import com.example.gestaousuarios.dto.LoginRequest;
import com.example.gestaousuarios.dto.LoginResponse;
import com.example.gestaousuarios.model.Usuario;
import com.example.gestaousuarios.repository.UsuarioRepository;
import com.example.gestaousuarios.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Usuario usuario =
                repository.findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credenciais inválidas."
                                )
                        );

        if (!passwordEncoder.matches(
                request.getSenha(),
                usuario.getSenha())) {

            throw new RuntimeException(
                    "Credenciais inválidas."
            );
        }

        String token =
                jwtService.gerarToken(usuario);

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }
}