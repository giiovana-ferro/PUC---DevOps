# Desenvolvimento de uma API REST Segura para Gestão de Usuários

## 1. Objetivo do projeto

Este projeto tem como objetivo desenvolver uma aplicação web para gerenciamento de usuários por meio de uma **API REST segura**, utilizando mecanismos de autenticação, autorização e controle de acesso.

A aplicação permite realizar operações de cadastro, consulta, atualização e exclusão de usuários (CRUD), além de possuir um sistema de login baseado em **JWT (JSON Web Token)**.

O acesso às funcionalidades da API é controlado de acordo com o perfil do usuário:

* **ADMIN:** possui acesso completo às funcionalidades da aplicação.
* **OPERADOR:** pode listar, consultar e atualizar usuários.
* **CLIENTE:** pode consultar somente os próprios dados.

Além do back-end desenvolvido com Spring Boot, o projeto possui um front-end simples desenvolvido com HTML, CSS e JavaScript para permitir a interação com a API.

---

## 2. Tecnologias utilizadas

### Back-end

* **Java 17**
* **Spring Boot**
* **Spring Web** – desenvolvimento da API REST.
* **Spring Data JPA** – persistência e acesso aos dados.
* **Spring Security** – autenticação e autorização.
* **Spring Validation** – validação dos dados recebidos pela API.
* **JWT (JSON Web Token)** – autenticação baseada em tokens.
* **BCrypt** – criptografia das senhas.
* **H2 Database** – banco de dados utilizado durante o desenvolvimento.
* **Maven** – gerenciamento de dependências e execução do projeto.

### Front-end

* **HTML5**
* **CSS3**
* **JavaScript**
* **Fetch API** – comunicação entre o front-end e a API REST.

### Ferramentas utilizadas

* IntelliJ IDEA
* Postman
* Navegador web
* Git/GitHub

---

## 3. Estrutura do projeto

```text
gestao-usuarios/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── login.js
│       └── dashboard.js
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── gestaousuarios/
│       │               ├── config/
│       │               ├── controller/
│       │               ├── dto/
│       │               ├── model/
│       │               ├── repository/
│       │               ├── security/
│       │               └── service/
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
└── README.md
```

---

# 4. Como instalar

## 4.1 Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Java JDK 17 ou superior;
* IntelliJ IDEA ou outra IDE compatível com Java;
* Maven;
* Navegador web;
* Postman (opcional, para testes da API).

O projeto utiliza o banco de dados **H2**, portanto não é necessário instalar um servidor de banco de dados externo.

---

## 4.2 Instalação do projeto

1. Baixe ou clone o projeto para o computador.

2. Abra a pasta do projeto no **IntelliJ IDEA**.

3. Aguarde o Maven realizar o download das dependências definidas no arquivo `pom.xml`.

4. Verifique se o projeto está utilizando o **Java 17**.

5. Caso esteja utilizando o Git, o projeto pode ser clonado com:

```bash
git clone URL_DO_REPOSITORIO
```

6. Entre na pasta do projeto:

```bash
cd gestao-usuarios
```

---

# 5. Como executar

## 5.1 Executar o back-end

No IntelliJ IDEA, localize a classe:

```text
GestaoUsuariosApplication.java
```

Ela está localizada em:

```text
src/main/java/com/example/gestaousuarios/
```

Execute a classe utilizando o botão **Run** da IDE.

Também é possível executar pelo terminal com:

```bash
mvn spring-boot:run
```

Após a inicialização, a API estará disponível em:

```text
http://localhost:8080
```

---

## 5.2 Banco de dados H2

O projeto utiliza um banco H2 em memória para armazenar os usuários.

A interface do banco pode ser acessada em:

```text
http://localhost:8080/h2-console
```

Configurações utilizadas:

```text
JDBC URL: jdbc:h2:mem:gestaousuarios
User Name: sa
Password:
```

Como o banco é em memória, os dados são recriados quando a aplicação é reiniciada.

---

## 5.3 Usuários para teste

A aplicação possui usuários cadastrados automaticamente para facilitar os testes.

### Administrador

```text
E-mail: admin@email.com
Senha: 123456
Perfil: ADMIN
```

### Operador

```text
E-mail: operador@email.com
Senha: 123456
Perfil: OPERADOR
```

### Cliente

```text
E-mail: cliente@email.com
Senha: 123456
Perfil: CLIENTE
```

---

## 5.4 Executar o front-end

Com o back-end funcionando, abra o arquivo:

```text
frontend/index.html
```

no navegador.

A tela inicial apresentará o formulário de login.

Após realizar o login, o sistema armazenará o JWT e permitirá o acesso às funcionalidades disponíveis para o perfil autenticado.

---

# 6. Como testar a aplicação

A API pode ser testada utilizando o **Postman** ou diretamente pelo front-end.

## 6.1 Login

Para realizar o login:

**Método:**

```text
POST
```

**URL:**

```text
http://localhost:8080/auth/login
```

**Body:**

```json
{
    "email": "admin@email.com",
    "senha": "123456"
}
```

A API deverá retornar um token JWT semelhante a:

```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

O token deverá ser enviado nas requisições protegidas utilizando o cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

---

# 7. Endpoints da API

| Método | Endpoint         | Acesso           |
| ------ | ---------------- | ---------------- |
| POST   | `/auth/login`    | Público          |
| POST   | `/usuarios`      | ADMIN            |
| GET    | `/usuarios`      | ADMIN / OPERADOR |
| GET    | `/usuarios/{id}` | ADMIN / OPERADOR |
| GET    | `/usuarios/me`   | CLIENTE          |
| PUT    | `/usuarios/{id}` | ADMIN / OPERADOR |
| DELETE | `/usuarios/{id}` | ADMIN            |

---

## 7.1 Cadastrar usuário

**Método:**

```text
POST
```

**URL:**

```text
http://localhost:8080/usuarios
```

**Header:**

```text
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

**Body:**

```json
{
    "nome": "Novo Usuário",
    "email": "novo@email.com",
    "senha": "123456",
    "perfil": "CLIENTE"
}
```

Apenas usuários com perfil **ADMIN** podem
