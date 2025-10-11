// Base de datos simulada (en memoria)
let categories = [
  { id: 1, name: 'Licores', icon: '🥃', description: 'Lista de licores disponibles en la taberna.' },
  { id: 2, name: 'Gaseosas', icon: '🥤', description: 'Gaseosas y refrescos más vendidos.' },
  { id: 3, name: 'Vasos y Jarras', icon: '🍺', description: 'Vasos, copas y jarras para servicio.' }
];

let nextId = 4;
let categoryToDelete = null;
let editingCategoryId = null;

// Referencias del DOM
const categoryModal = document.getElementById('categoryModal');
const confirmModal = document.getElementById('confirmModal');
const categoryForm = document.getElementById('categoryForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
});

// Renderizar lista de categorías
function renderCategories() {
  const categoriesList = document.getElementById('categories-list');
  
  if (categories.length === 0) {
    categoriesList.innerHTML = `
      <div class="empty-state">
        <p>📦 No hay categorías registradas</p>
        <p>Crea tu primera categoría usando el botón de arriba</p>
      </div>
    `;
    return;
  }

  categoriesList.innerHTML = categories.map(category => `
    <div class="category-card">
      <div class="category-info">
        <div class="category-icon">${category.icon}</div>
        <div class="category-details">
          <h3>${category.name}</h3>
          <p>${category.description || 'Sin descripción'}</p>
        </div>
      </div>
      <div class="category-actions">
        <button class="btn-edit" onclick="editCategory(${category.id})">✏️ Editar</button>
        <button class="btn-delete" onclick="prepareDelete(${category.id})">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

// Abrir modal para crear
function openCreateModal() {
  editingCategoryId = null;
  modalTitle.textContent = 'Nueva Categoría';
  submitBtn.textContent = 'Crear Categoría';
  categoryForm.reset();
  categoryModal.classList.add('show');
}

// Editar categoría
function editCategory(id) {
  const category = categories.find(c => c.id === id);
  if (!category) return;

  editingCategoryId = id;
  modalTitle.textContent = 'Editar Categoría';
  submitBtn.textContent = 'Guardar Cambios';
  
  document.getElementById('categoryName').value = category.name;
  document.getElementById('categoryIcon').value = category.icon;
  document.getElementById('categoryDescription').value = category.description || '';
  
  categoryModal.classList.add('show');
}

// Cerrar modal de categoría
function closeModal() {
  categoryModal.classList.remove('show');
  categoryForm.reset();
  editingCategoryId = null;
}

// Preparar eliminación
function prepareDelete(id) {
  categoryToDelete = id;
  confirmModal.classList.add('show');
}

// Confirmar eliminación
function confirmDelete() {
  if (categoryToDelete !== null) {
    categories = categories.filter(c => c.id !== categoryToDelete);
    renderCategories();
    showNotification('Categoría eliminada exitosamente', 'success');
    categoryToDelete = null;
  }
  closeConfirmModal();
}

// Cerrar modal de confirmación
function closeConfirmModal() {
  confirmModal.classList.remove('show');
  categoryToDelete = null;
}

// Manejar envío del formulario
categoryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('categoryName').value.trim();
  const icon = document.getElementById('categoryIcon').value.trim();
  const description = document.getElementById('categoryDescription').value.trim();

  if (!name || !icon) {
    showNotification('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  if (editingCategoryId) {
    // Actualizar categoría existente
    const index = categories.findIndex(c => c.id === editingCategoryId);
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        name,
        icon,
        description
      };
      showNotification('Categoría actualizada exitosamente', 'success');
    }
  } else {
    // Crear nueva categoría
    const newCategory = {
      id: nextId++,
      name,
      icon,
      description
    };
    categories.push(newCategory);
    showNotification('Categoría creada exitosamente', 'success');
  }

  renderCategories();
  closeModal();
});

// Sistema de notificaciones
function showNotification(message, type = 'success') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Cerrar modales al hacer clic fuera
categoryModal.addEventListener('click', (e) => {
  if (e.target === categoryModal) closeModal();
});

confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) closeConfirmModal();
});

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (categoryModal.classList.contains('show')) closeModal();
    if (confirmModal.classList.contains('show')) closeConfirmModal();
  }
});

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);