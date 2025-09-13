document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navItems = document.querySelectorAll('.nav-item');
    const proyectoCards = document.querySelectorAll('.proyecto-card');
    const modales = document.querySelectorAll('.modal-container');
    const modalCerrar = document.querySelectorAll('.modal-close');
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    
    // FUNCIONES PRINCIPALES
    
    // Navegación
  function inicializarNavegacion() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
    
    // Modales
    function abrirModal(id) {
        const modal = document.getElementById(`modal-${id}`);
        if (!modal) return;
        
        // Prevenir scroll en el body
        document.body.style.overflow = 'hidden';
        
        // Mostrar el modal con animación
        modal.classList.add('active');
        
        // Enfoque para accesibilidad
        const primerElementoEnfocable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (primerElementoEnfocable) {
            primerElementoEnfocable.focus();
        }
    }
    
    function cerrarModales() {
        // Restaurar scroll en el body
        document.body.style.overflow = '';
        
        // Ocultar todos los modales
        modales.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    function scrollToCard(id) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }
    
    // Animaciones
    function animarTarjetas() {
        proyectoCards.forEach((tarjeta, index) => {
            setTimeout(() => {
                tarjeta.style.opacity = '0';
                tarjeta.style.transform = 'translateY(20px)';
                tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    tarjeta.style.opacity = '1';
                    tarjeta.style.transform = 'translateY(0)';
                }, 50);
            }, index * 150); // Escalonar la animación para cada tarjeta
        });
    }
    
    // EVENTOS
    
    // Configurar eventos para tarjetas de proyectos
    function configurarEventosTarjetas() {
        proyectoCards.forEach(card => {
            // Hacer las tarjetas enfocables
            card.setAttribute('tabindex', '0');
            
            // Evento de clic
            card.addEventListener('click', function() {
                const proyectoId = this.getAttribute('data-id');
                abrirModal(proyectoId);
            });
            
            // Navegación con teclado para accesibilidad
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const proyectoId = this.getAttribute('data-id');
                    abrirModal(proyectoId);
                }
            });
        });
    }
    
    // Configurar eventos para cerrar modales
    function configurarEventosCierre() {
        // Botones de cierre
        modalCerrar.forEach(boton => {
            boton.addEventListener('click', function() {
                const modalId = this.closest('.modal-container').id;
                const proyectoId = modalId.replace('modal-', '');
                cerrarModales();
                scrollToCard(proyectoId);
            });
        });
        
        // Backdrop (fondo oscuro)
        modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', cerrarModales);
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cerrarModales();
            }
        });
    }
    
    // Configurar trampa de foco para accesibilidad
    function configurarTrampaFoco() {
        modales.forEach(modal => {
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const firstFocusable = focusables[0];
                    const lastFocusable = focusables[focusables.length - 1];
                    
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else { // Tab
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
        });
    }
    
    // INICIALIZACIÓN
    function inicializarAplicacion() {
        inicializarNavegacion();
        configurarEventosTarjetas();
        configurarEventosCierre();
        configurarTrampaFoco();
        animarTarjetas();
    }
    
    // Iniciar la aplicación
    inicializarAplicacion();
});

// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Animaciones con IntersectionObserver
  const elements = document.querySelectorAll(".fade-in, .slide-left, .slide-right, .zoom-in");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Ejecuta solo una vez
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));

  // Navbar efecto al hacer scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Animación menú móvil
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
