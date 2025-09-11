// Base de datos del inventario
const inventario = {
    licores: {
        titulo: "🥃 Licores",
        items: [
            { nombre: "Whisky Johnnie Walker", icono: "🥃" },
            { nombre: "Ron Havana Club", icono: "🍹" },
            { nombre: "Vodka Absolut", icono: "🍸" },
            { nombre: "Tequila José Cuervo", icono: "🥃" },
            { nombre: "Gin Tanqueray", icono: "🍸" },
            { nombre: "Pisco Quebranta", icono: "🍷" },
            { nombre: "Brandy", icono: "🥃" },
            { nombre: "Baileys", icono: "🥛" },
            { nombre: "Jägermeister", icono: "🍶" },
            { nombre: "Campari", icono: "🍹" },
            { nombre: "Aperol", icono: "🍊" },
            { nombre: "Vermut", icono: "🍷" }
        ]
    },
    gaseosas: {
        titulo: "🥤 Gaseosas",
        items: [
            { nombre: "Coca Cola", icono: "🥤" },
            { nombre: "Coca Cola Zero", icono: "🥤" },
            { nombre: "Sprite", icono: "🥤" },
            { nombre: "Fanta Naranja", icono: "🍊" },
            { nombre: "Inca Kola", icono: "🥤" },
            { nombre: "Pepsi", icono: "🥤" },
            { nombre: "7up", icono: "🥤" },
            { nombre: "Ginger Ale", icono: "🥤" },
            { nombre: "Agua Tónica", icono: "💧" },
            { nombre: "Agua con Gas", icono: "💧" },
            { nombre: "Red Bull", icono: "⚡" },
            { nombre: "Monster Energy", icono: "⚡" }
        ]
    },
    frutas: {
        titulo: "🍊 Frutas",
        items: [
            { nombre: "Limones", icono: "🍋" },
            { nombre: "Naranjas", icono: "🍊" },
            { nombre: "Fresas", icono: "🍓" },
            { nombre: "Maracuyá", icono: "🥭" },
            { nombre: "Piña", icono: "🍍" },
            { nombre: "Mango", icono: "🥭" },
            { nombre: "Sandía", icono: "🍉" },
            { nombre: "Manzanas", icono: "🍎" },
            { nombre: "Uvas", icono: "🍇" },
            { nombre: "Arándanos", icono: "🫐" },
            { nombre: "Cerezas", icono: "🍒" },
            { nombre: "Kiwi", icono: "🥝" }
        ]
    },
    insumos: {
        titulo: "🍯 Insumos",
        items: [
            { nombre: "Azúcar Blanca", icono: "🍚" },
            { nombre: "Azúcar Morena", icono: "🟫" },
            { nombre: "Miel", icono: "🍯" },
            { nombre: "Jarabe de Goma", icono: "🍶" },
            { nombre: "Jarabe de Granadina", icono: "🍷" },
            { nombre: "Sal", icono: "🧂" },
            { nombre: "Pimienta", icono: "🌶️" },
            { nombre: "Canela en Rama", icono: "🥖" },
            { nombre: "Menta Fresca", icono: "🌿" },
            { nombre: "Hielo", icono: "🧊" },
            { nombre: "Crema de Coco", icono: "🥥" },
            { nombre: "Leche Condensada", icono: "🥛" },
            { nombre: "Salsa Tabasco", icono: "🌶️" },
            { nombre: "Salsa Inglesa", icono: "🍶" },
            { nombre: "Aceitunas", icono: "🫒" }
        ]
    },
    vasos: {
        titulo: "🍺 Vasos y Jarras",
        items: [
            { nombre: "Copa de Vino", icono: "🍷" },
            { nombre: "Copa de Champagne", icono: "🥂" },
            { nombre: "Vaso Old Fashioned", icono: "🥃" },
            { nombre: "Vaso Highball", icono: "🥤" },
            { nombre: "Copa Martini", icono: "🍸" },
            { nombre: "Copa Margarita", icono: "🍹" },
            { nombre: "Jarra de Cerveza", icono: "🍺" },
            { nombre: "Vaso Shot", icono: "🥃" },
            { nombre: "Copa Balón", icono: "🍷" },
            { nombre: "Vaso Collins", icono: "🥤" },
            { nombre: "Copa Hurricane", icono: "🍹" },
            { nombre: "Vaso Pilsner", icono: "🍺" },
            { nombre: "Copa Coupe", icono: "🥂" },
            { nombre: "Taza de Cobre (Moscow Mule)", icono: "🍺" }
        ]
    }
};

// Función para abrir el modal
function openModal(categoria) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Verificar si la categoría existe
    if (!inventario[categoria]) {
        console.error('Categoría no encontrada:', categoria);
        return;
    }
    
    // Obtener datos de la categoría
    const categoriaData = inventario[categoria];
    
    // Establecer el título
    modalTitle.innerHTML = categoriaData.titulo;
    
    // Limpiar el contenido anterior
    modalBody.innerHTML = '';
    
    // Agregar el atributo de categoría al modal para estilos
    modal.setAttribute('data-category', categoria);
    
    // Crear elementos para cada item
    categoriaData.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.style.animationDelay = `${index * 0.05}s`;
        itemDiv.innerHTML = `
            <span class="inventory-item-icon">${item.icono}</span>
            <span class="inventory-item-text">${item.nombre}</span>
        `;
        
        // Agregar evento click a cada item
        itemDiv.addEventListener('click', function() {
            handleItemClick(item.nombre, categoria);
        });
        
        modalBody.appendChild(itemDiv);
    });
    
    // Mostrar el modal
    modal.style.display = 'block';
    
    // Agregar animación de entrada
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.removeAttribute('data-category');
    }, 300);
}

// Función para manejar el click en un item
function handleItemClick(itemName, categoria) {
    // Aquí puedes agregar la lógica para cuando se hace click en un item
    console.log(`Item seleccionado: ${itemName} de la categoría ${categoria}`);
    
    // Ejemplo: mostrar una alerta personalizada
    showNotification(`Has seleccionado: ${itemName}`);
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.animation = 'slideInRight 0.3s ease';
        }, 300);
    }, 3000);
}

// Cerrar modal al hacer click fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Animaciones CSS adicionales
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
    
    .modal.show {
        animation: fadeIn 0.3s ease;
    }
    
    .inventory-item {
        animation: fadeInUp 0.5s ease backwards;
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Taberna del Monkey - Sistema de Inventario Cargado ✅');
    
    // Agregar efecto de parallax al scroll (opcional)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.container');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});