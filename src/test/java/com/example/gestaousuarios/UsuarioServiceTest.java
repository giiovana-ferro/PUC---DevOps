package com.example.gestaousuarios;

import com.example.gestaousuarios.dto.UsuarioRequest;
import com.example.gestaousuarios.dto.UsuarioResponse;
import com.example.gestaousuarios.model.Perfil;
import com.example.gestaousuarios.model.Usuario;
import com.example.gestaousuarios.repository.UsuarioRepository;
import com.example.gestaousuarios.service.UsuarioService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    private Usuario usuario;
    private UsuarioRequest request;

    @BeforeEach
    void setUp() {
        usuario = new Usuario(
                "Giovana Ferro",
                "giovana@email.com",
                "senha-hash",
                Perfil.ADMIN
        );

        request = new UsuarioRequest();
        request.setNome("Giovana Ferro");
        request.setEmail("giovana@email.com");
        request.setSenha("123456");
        request.setPerfil(Perfil.ADMIN);
    }

    @Test
    void deveCriarUsuarioComSucesso() {
        when(repository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("senha-hash");
        when(repository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponse response = service.criar(request);

        assertNotNull(response);
        assertEquals("Giovana Ferro", response.getNome());
        assertEquals("giovana@email.com", response.getEmail());
        assertEquals(Perfil.ADMIN, response.getPerfil());

        verify(repository).save(any(Usuario.class));
        verify(passwordEncoder).encode("123456");
    }

    @Test
    void naoDeveCriarUsuarioComEmailJaCadastrado() {
        when(repository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.criar(request)
        );

        assertEquals("E-mail já cadastrado.", exception.getMessage());
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void deveListarUsuarios() {
        Usuario segundoUsuario = new Usuario(
                "Maria",
                "maria@email.com",
                "hash",
                Perfil.CLIENTE
        );

        when(repository.findAll()).thenReturn(List.of(usuario, segundoUsuario));

        List<UsuarioResponse> response = service.listar();

        assertEquals(2, response.size());
        assertEquals("Giovana Ferro", response.get(0).getNome());
        assertEquals("Maria", response.get(1).getNome());

        verify(repository).findAll();
    }

    @Test
    void deveBuscarUsuarioPorId() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioResponse response = service.buscarPorId(1L);

        assertNotNull(response);
        assertEquals("Giovana Ferro", response.getNome());
        assertEquals("giovana@email.com", response.getEmail());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarExcecaoAoBuscarUsuarioInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(99L)
        );

        assertEquals("Usuário não encontrado.", exception.getMessage());
        verify(repository).findById(99L);
    }
}