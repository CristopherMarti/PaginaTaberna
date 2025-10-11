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