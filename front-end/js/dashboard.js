const API_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

let perfilAtual = null;


// ==========================================
// VERIFICA LOGIN
// ==========================================

if (!token) {

    window.location.href = "index.html";

}


// ==========================================
// DECODIFICAR JWT
// ==========================================

function decodificarToken(token) {

    try {

        const payload = token.split(".")[1];

        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function(c) {

                        return "%" +
                            ("00" + c.charCodeAt(0)
                                .toString(16))
                                .slice(-2);

                    })
                    .join("")
            )
        );

    } catch (error) {

        console.error(
            "Erro ao decodificar JWT:",
            error
        );

        return null;

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const dadosToken =
            decodificarToken(token);

        if (!dadosToken) {

            logout();

            return;

        }

        perfilAtual =
            dadosToken.perfil;

        document.getElementById(
            "perfilUsuario"
        ).textContent =
            `Perfil: ${perfilAtual}`;


        configurarInterface();

    }
);


// ==========================================
// CONFIGURAR INTERFACE POR PERFIL
// ==========================================

function configurarInterface() {

    const areaUsuarios =
        document.getElementById(
            "areaUsuarios"
        );

    const areaCliente =
        document.getElementById(
            "areaCliente"
        );

    const btnNovoUsuario =
        document.getElementById(
            "btnNovoUsuario"
        );


    // ADMIN E OPERADOR

    if (
        perfilAtual === "ADMIN" ||
        perfilAtual === "OPERADOR"
    ) {

        areaUsuarios.classList.remove(
            "hidden"
        );

        areaCliente.classList.add(
            "hidden"
        );

        carregarUsuarios();

    }


    // CLIENTE

    if (perfilAtual === "CLIENTE") {

        areaUsuarios.classList.add(
            "hidden"
        );

        areaCliente.classList.remove(
            "hidden"
        );

        btnNovoUsuario.style.display =
            "none";

        carregarMeusDados();

        esconderCards();

    }


    // OPERADOR NÃO PODE CRIAR

    if (perfilAtual === "OPERADOR") {

        btnNovoUsuario.style.display =
            "none";

    }

}


// ==========================================
// REQUISIÇÃO AUTENTICADA
// ==========================================

async function requisicao(url, options = {}) {

    options.headers = {

        ...(options.headers || {}),

        "Authorization":
            `Bearer ${token}`,

        "Content-Type":
            "application/json"

    };


    const response =
        await fetch(
            `${API_URL}${url}`,
            options
        );


    if (response.status === 401) {

        alert(
            "Sua sessão expirou. Faça login novamente."
        );

        logout();

        return;

    }


    if (response.status === 403) {

        throw new Error(
            "Você não possui permissão para realizar esta operação."
        );

    }


    return response;

}


// ==========================================
// LISTAR USUÁRIOS
// ==========================================

async function carregarUsuarios() {

    try {

        const response =
            await requisicao(
                "/usuarios"
            );

        if (!response.ok) {

            throw new Error(
                "Erro ao carregar usuários."
            );

        }

        const usuarios =
            await response.json();


        const tabela =
            document.getElementById(
                "tabelaUsuarios"
            );

        tabela.innerHTML = "";


        usuarios.forEach(
            usuario => {

                const tr =
                    document.createElement("tr");


                tr.innerHTML = `

                    <td>${usuario.id}</td>

                    <td>${usuario.nome}</td>

                    <td>${usuario.email}</td>

                    <td>
                        <span class="badge ${usuario.perfil.toLowerCase()}">
                            ${usuario.perfil}
                        </span>
                    </td>

                    <td>

                        ${
                    perfilAtual === "ADMIN" ||
                    perfilAtual === "OPERADOR"

                        ?

                        `
                            <button
                                class="btn-small btn-edit"
                                onclick="editarUsuario(${usuario.id})"
                            >
                                Editar
                            </button>
                            `

                        :

                        ""
                }


                        ${
                    perfilAtual === "ADMIN"

                        ?

                        `
                            <button
                                class="btn-small btn-delete"
                                onclick="excluirUsuario(${usuario.id})"
                            >
                                Excluir
                            </button>
                            `

                        :

                        ""
                }

                    </td>

                `;

                tabela.appendChild(tr);

            }
        );


        atualizarCards(usuarios);


    } catch (error) {

        mostrarMensagem(
            error.message,
            "error"
        );

    }

}


// ==========================================
// CARDS
// ==========================================

function atualizarCards(usuarios) {

    document.getElementById(
        "totalUsuarios"
    ).textContent =
        usuarios.length;


    document.getElementById(
        "totalAdmins"
    ).textContent =
        usuarios.filter(
            usuario =>
                usuario.perfil === "ADMIN"
        ).length;


    document.getElementById(
        "totalOperadores"
    ).textContent =
        usuarios.filter(
            usuario =>
                usuario.perfil === "OPERADOR"
        ).length;


    document.getElementById(
        "totalClientes"
    ).textContent =
        usuarios.filter(
            usuario =>
                usuario.perfil === "CLIENTE"
        ).length;

}


// ==========================================
// ESCONDER CARDS DO CLIENTE
// ==========================================

function esconderCards() {

    document.querySelector(
        ".cards"
    ).style.display = "none";

}


// ==========================================
// ABRIR MODAL DE CADASTRO
// ==========================================

function abrirModalCadastro() {

    document.getElementById(
        "modalTitulo"
    ).textContent =
        "Novo usuário";


    document.getElementById(
        "usuarioForm"
    ).reset();


    document.getElementById(
        "usuarioId"
    ).value = "";


    document.getElementById(
        "campoSenha"
    ).style.display =
        "block";


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );

}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal() {

    document.getElementById(
        "modal"
    ).classList.add(
        "hidden"
    );

}


// ==========================================
// CADASTRAR / EDITAR
// ==========================================

document.getElementById(
    "usuarioForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "usuarioId"
            ).value;


        const usuario = {

            nome:
            document.getElementById(
                "nome"
            ).value,

            email:
            document.getElementById(
                "emailUsuario"
            ).value,

            senha:
            document.getElementById(
                "senhaUsuario"
            ).value,

            perfil:
            document.getElementById(
                "perfil"
            ).value

        };


        try {

            let response;


            // CADASTRO

            if (!id) {

                response =
                    await requisicao(
                        "/usuarios",
                        {
                            method: "POST",
                            body: JSON.stringify(
                                usuario
                            )
                        }
                    );

            }


            // EDIÇÃO

            else {

                response =
                    await requisicao(
                        `/usuarios/${id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify(
                                usuario
                            )
                        }
                    );

            }


            if (!response.ok) {

                const erro =
                    await response.text();

                throw new Error(
                    erro ||
                    "Erro ao salvar usuário."
                );

            }


            fecharModal();

            mostrarMensagem(
                id
                    ? "Usuário atualizado com sucesso!"
                    : "Usuário cadastrado com sucesso!",
                "success"
            );


            carregarUsuarios();


        } catch (error) {

            mostrarMensagem(
                error.message,
                "error"
            );

        }

    }
);


// ==========================================
// EDITAR USUÁRIO
// ==========================================

async function editarUsuario(id) {

    try {

        const response =
            await requisicao(
                `/usuarios/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao buscar usuário."
            );

        }


        const usuario =
            await response.json();


        document.getElementById(
            "modalTitulo"
        ).textContent =
            "Editar usuário";


        document.getElementById(
            "usuarioId"
        ).value =
            usuario.id;


        document.getElementById(
            "nome"
        ).value =
            usuario.nome;


        document.getElementById(
            "emailUsuario"
        ).value =
            usuario.email;


        document.getElementById(
            "perfil"
        ).value =
            usuario.perfil;


        document.getElementById(
            "senhaUsuario"
        ).value = "";


        document.getElementById(
            "campoSenha"
        ).style.display =
            "block";


        document.getElementById(
            "modal"
        ).classList.remove(
            "hidden"
        );


    } catch (error) {

        mostrarMensagem(
            error.message,
            "error"
        );

    }

}


// ==========================================
// EXCLUIR
// ==========================================

async function excluirUsuario(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este usuário?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const response =
            await requisicao(
                `/usuarios/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok &&
            response.status !== 204) {

            throw new Error(
                "Não foi possível excluir o usuário."
            );

        }


        mostrarMensagem(
            "Usuário excluído com sucesso!",
            "success"
        );


        carregarUsuarios();


    } catch (error) {

        mostrarMensagem(
            error.message,
            "error"
        );

    }

}


// ==========================================
// CLIENTE - MEUS DADOS
// ==========================================

async function carregarMeusDados() {

    try {

        const response =
            await requisicao(
                "/usuarios/me"
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar seus dados."
            );

        }


        const usuario =
            await response.json();


        document.getElementById(
            "dadosCliente"
        ).innerHTML = `

            <div class="profile-card">

                <div class="profile-icon">
                    👤
                </div>

                <h2>
                    ${usuario.nome}
                </h2>

                <p>
                    <strong>E-mail:</strong>
                    ${usuario.email}
                </p>

                <p>
                    <strong>Perfil:</strong>
                    ${usuario.perfil}
                </p>

            </div>

        `;


    } catch (error) {

        mostrarMensagem(
            error.message,
            "error"
        );

    }

}


// ==========================================
// MENSAGENS
// ==========================================

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    mensagem.innerHTML = `

        <div class="message ${tipo}">
            ${texto}
        </div>

    `;


    setTimeout(
        () => {

            mensagem.innerHTML = "";

        },
        4000
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "email"
    );

    window.location.href =
        "index.html";

}