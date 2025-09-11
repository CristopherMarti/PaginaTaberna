// Mostrar formulario de registro
function mostrarRegistro() {
  document.getElementById("formLogin").classList.add("oculto");
  document.getElementById("formRegistro").classList.remove("oculto");
}

// Mostrar formulario de login
function mostrarLogin() {
  document.getElementById("formRegistro").classList.add("oculto");
  document.getElementById("formLogin").classList.remove("oculto");
}

// Registro
document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  // Guarda los datos en localStorage
  localStorage.setItem("usuarioEmail", email);
  localStorage.setItem("usuarioPassword", password);

  alert("Cuenta registrada correctamente. Ahora puedes iniciar sesión.");
  mostrarLogin();
});

// Login
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const storedEmail = localStorage.getItem("usuarioEmail");
  const storedPass = localStorage.getItem("usuarioPassword");

  if (email === storedEmail && password === storedPass) {
    // Guardamos sesión
    localStorage.setItem("usuario", email);

    // Redirigir al inicio
    window.location.href = "index.html";
  } else {
    alert("Correo o contraseña incorrectos.");
  }
});
