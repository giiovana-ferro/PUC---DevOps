const API_URL = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    mensagem.innerHTML = "";

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                senha: senha
            })

        });

        if (!response.ok) {

            throw new Error("E-mail ou senha inválidos.");

        }

        const data = await response.json();

        // Salva o JWT
        localStorage.setItem("token", data.token);

        // Salva o e-mail utilizado no login
        localStorage.setItem("email", email);

        // Vai para o dashboard
        window.location.href = "dashboard.html";

    } catch (error) {

        mensagem.innerHTML = `
            <div class="message error">
                ${error.message}
            </div>
        `;

    }

});