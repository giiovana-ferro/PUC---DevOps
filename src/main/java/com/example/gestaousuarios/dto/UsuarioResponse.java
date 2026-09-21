package com.example.gestaousuarios.dto;

import com.example.gestaousuarios.model.Perfil;
import com.example.gestaousuarios.model.Usuario;

public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private Perfil perfil;

    public UsuarioResponse(Long id, String nome, String email, Perfil perfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
    }

    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil()
        );
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public Perfil getPerfil() {
        return perfil;
    }
}