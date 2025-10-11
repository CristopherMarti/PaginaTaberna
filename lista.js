/* ======= Datos de ejemplo por categoría ======= */
const catalogos = {
  licores: {
    title: 'Licores',
    description: 'Lista de licores disponibles en la taberna.',
    items: [
      { id: 'vodka_1', name: 'Vodka Absolute 700ml', desc: 'Vodka premium, 40% alc.', price: 45.00 },
      { id: 'whisky_1', name: 'Whisky Glen 700ml', desc: 'Single malt, 12 años.', price: 68.50 },
      { id: 'ron_1', name: 'Ron Havana 750ml', desc: 'Reposado, cuerpo suave.', price: 34.75 },
      { id: 'tequila_1', name: 'Tequila Oro 700ml', desc: 'Reposado, 38% alc.', price: 52.00 }
    ]
  },
  gaseosas: {
    title: 'Gaseosas',
    description: 'Gaseosas y refrescos más vendidos.',
    items: [
      { id: 'coca_1', name: 'Coca-Cola 1.5L', desc: 'Refresco clásico', price: 2.50 },
      { id: 'inca_1', name: 'Inca Kola 1.5L', desc: 'Sabor peruano', price: 2.30 },
      { id: 'sprite_1', name: 'Sprite 1.5L', desc: 'Lima-limón', price: 2.20 },
      { id: 'fanta_1', name: 'Fanta Naranja 1.5L', desc: 'Sabor naranja', price: 2.20 }
    ]
  },

  vasos: {
    title: 'Vasos y Jarras',
    description: 'Vasos, copas y jarras para servicio.',
    items: [
      { id: 'vaso_1', name: 'Vaso Pinta 500ml (x12)', desc: 'Cristal resistente', price: 18.00 },
      { id: 'copa_1', name: 'Copa Vino (x6)', desc: 'Elegante', price: 22.50 },
      { id: 'jarra_1', name: 'Jarra Cerámica 1L', desc: 'Para cervezas', price: 12.00 },
      { id: 'vaso_plast_1', name: 'Vaso plástico 300ml (x50)', desc: 'Desechable', price: 5.00 }
    ]
  }
};

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(catKey){
  const cat = catalogos[catKey];
  if(!cat) return;
  modalTitle.textContent = cat.title;
  modalBody.innerHTML = buildCatalogView(cat);
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');

  // Close on escape
  document.addEventListener('keydown', escClose);
}

function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
  document.removeEventListener('keydown', escClose);
}

function escClose(e){
  if(e.key === 'Escape') closeModal();
}

// Click fuera para cerrar
modal.addEventListener('click', function(e){
  if(e.target === modal) closeModal();
});

// Construir vista del catálogo (solo mostrar productos y precio)
function buildCatalogView(cat){
  const itemsHtml = cat.items.map(item => {
    return `
      <div class="product-item" data-id="${item.id}">
        <div class="product-info">
          <div class="product-name">${item.name}</div>
          <div class="product-desc">${item.desc}</div>
        </div>
        <div class="product-price">S/ ${Number(item.price).toFixed(2)}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="catalog-header">
      <div>
        <strong style="font-size:16px;color:var(--dark-gray)">${cat.title}</strong>
        <div class="info">${cat.description}</div>
      </div>
      <div class="info">Productos: ${cat.items.length}</div>
    </div>

    <div class="product-list">
      ${itemsHtml}
    </div>
  `;
}

// Mobile menu toggle (simple)
const mobileBtn = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');
mobileBtn && mobileBtn.addEventListener('click', () => {
  const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
  mobileBtn.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('active');
});
