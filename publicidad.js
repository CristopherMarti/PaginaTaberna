// === Modal de Reservas ===
const reservaBtn = document.getElementById('reservaBtn');
const modal = document.getElementById('modalReserva');
const closeModal = document.getElementById('closeModal');
const formReserva = document.getElementById('formReserva');

if (reservaBtn && modal && closeModal && formReserva) {
  reservaBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al enviar formulario
  formReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Reserva confirmada! Nos pondremos en contacto contigo.');
    modal.style.display = 'none';
    formReserva.reset();
  });
}

// === Scroll animado a Especialidades ===
const especialidadesBtn = document.getElementById('especialidadesBtn');
const especialidadesSec = document.getElementById('especialidades');

if (especialidadesBtn && especialidadesSec) {
  especialidadesBtn.addEventListener('click', () => {
    especialidadesSec.scrollIntoView({ behavior: 'smooth' });
  });
}

// === Animaciones de aparición con IntersectionObserver ===
const faders = document.querySelectorAll('.fade-in');
if (faders.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  faders.forEach((el) => observer.observe(el));
}