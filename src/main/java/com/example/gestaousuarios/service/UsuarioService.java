package com.example.gestaousuarios.service;

import com.example.gestaousuarios.dto.UsuarioRequest;
import com.example.gestaousuarios.dto.UsuarioResponse;
import com.example.gestaousuarios.model.Usuario;
import com.example.gestaousuarios.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse criar(UsuarioRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());

        usuario.setSenha(
                passwordEncoder.encode(request.getSenha())
        );

        usuario.setPerfil(request.getPerfil());

        return UsuarioResponse.fromEntity(
                repository.save(usuario)
        );
    }

    public List<UsuarioResponse> listar() {

        return repository.findAll()
                .stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        return UsuarioResponse.fromEntity(usuario);
    }

    public Usuario atualizar(Long id, UsuarioRequest request) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setPerfil(request.getPerfil());

        if (request.getSenha() != null &&
                !request.getSenha().isBlank()) {

            usuario.setSenha(
                    passwordEncoder.encode(request.getSenha())
            );
        }

        return repository.save(usuario);
    }

    public void excluir(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        repository.deleteById(id);
    }

    public Usuario buscarPorEmail(String email) {

        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado.")
                );
    }
}