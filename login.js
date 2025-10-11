document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validación simple - verifica que los campos no estén vacíos
  if (email && password) {
    // Redirige a la página de lista de categorías
    window.location.href = 'lista.html';
  } else {
    alert('Por favor completa todos los campos');
  }
});