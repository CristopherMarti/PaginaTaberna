// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    categorias: [
        { 
            id: 1, 
            nombre: 'Licores', 
            descripcion: 'Bebidas alcohólicas destiladas de alta graduación', 
            imagen: 'ruta/licores.jpg',
            productos: 2,
            activo: true
        },
        { 
            id: 2, 
            nombre: 'Cocteles', 
            descripcion: 'Mezclas preparadas de bebidas alcohólicas y no alcohólicas', 
            imagen: 'ruta/cocteles.jpg',
            productos: 2,
            activo: true
        },
        { 
            id: 3, 
            nombre: 'Cervezas', 
            descripcion: 'Bebidas alcohólicas fermentadas a base de cebada', 
            imagen: 'ruta/cervezas.jpg',
            productos: 1,
            activo: true
        },
        { 
            id: 4, 
            nombre: 'Gaseosas', 
            descripcion: 'Bebidas carbonatadas sin alcohol', 
            imagen: 'ruta/gaseosas.jpg',
            productos: 1,
            activo: true
        },
        { 
            id: 5, 
            nombre: 'Bebidas Calientes', 
            descripcion: 'Infusiones y bebidas preparadas calientes', 
            imagen: 'ruta/bebidas-calientes.jpg',
            productos: 0,
            activo: true
        }
    ],
    categoriaEditando: null,
    mostrarOcultas: false
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    getNextId: () => Math.max(0, ...AppState.categorias.map(c => c.id)) + 1,
    formatId: (id) => `#${String(id).padStart(3, '0')}`
};

// ============================================
// GESTIÓN DE CATEGORÍAS (CRUD)
// ============================================
const CategoryManager = {
    // READ - Renderizar lista de categorías
    render(filtro = '') {
        const tbody = document.getElementById('categoriasTableBody');
        const emptyMessage = document.getElementById('emptyMessage');
        const tableContainer = document.querySelector('.table-container');

        let categoriasFiltradas = AppState.categorias;

        // Mostrar solo activas o todas según configuración
        if (!AppState.mostrarOcultas) {
            categoriasFiltradas = categoriasFiltradas.filter(c => c.activo);
        }

        // Aplicar filtro de búsqueda
        if (filtro) {
            const busqueda = filtro.toLowerCase();
            categoriasFiltradas = categoriasFiltradas.filter(c => 
                c.nombre.toLowerCase().includes(busqueda) ||
                c.descripcion.toLowerCase().includes(busqueda)
            );
        }

        if (categoriasFiltradas.length === 0) {
            tableContainer.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }

        tableContainer.style.display = 'block';
        emptyMessage.style.display = 'none';

        tbody.innerHTML = categoriasFiltradas.map(categoria => `
            <tr style="${!categoria.activo ? 'opacity: 0.5; background: #f8f9fa;' : ''}">
                <td><strong>${Utils.formatId(categoria.id)}</strong></td>
                <td>
                    <img 
                        src="${categoria.imagen || 'https://via.placeholder.com/80x80?text=Sin+Imagen'}" 
                        alt="${categoria.nombre}" 
                        class="categoria-imagen"
                    >
                </td>
                <td class="categoria-nombre">
                    ${categoria.nombre}
                    ${!categoria.activo ? '<span class="badge-oculto">OCULTO</span>' : ''}
                </td>
                <td class="categoria-descripcion-cell">
                    ${categoria.descripcion || 'Sin descripción'}
                </td>
                <td class="productos-count">${categoria.productos}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-edit" onclick="CategoryManager.edit(${categoria.id})">
                            ✏️ Editar
                        </button>
                        ${categoria.activo ? 
                            `<button class="btn-hide" onclick="CategoryManager.toggleVisible(${categoria.id})">
                                👁️ Ocultar
                            </button>` :
                            `<button class="btn-show" onclick="CategoryManager.toggleVisible(${categoria.id})">
                                👁️ Mostrar
                            </button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateStats();
    },

    // UPDATE - Actualizar estadísticas
    updateStats() {
        const totalCategorias = AppState.categorias.length;
        const totalProductos = AppState.categorias.reduce((sum, c) => sum + c.productos, 0);
        const categoriasActivas = AppState.categorias.filter(c => c.activo).length;
        const categoriaPopular = AppState.categorias
            .filter(c => c.activo)
            .reduce((max, c) => c.productos > max.productos ? c : max, AppState.categorias.filter(c => c.activo)[0]);

        document.getElementById('totalCategorias').textContent = totalCategorias;
        document.getElementById('totalProductos').textContent = totalProductos;
        document.getElementById('categoriasActivas').textContent = categoriasActivas;
        document.getElementById('categoriaPopular').textContent = categoriaPopular?.nombre || '-';
    },

    // CREATE - Crear nueva categoría
    create(data) {
        const nuevaCategoria = {
            id: Utils.getNextId(),
            nombre: data.nombre,
            descripcion: data.descripcion || '',
            imagen: data.imagen || '',
            productos: 0,
            activo: true
        };

        AppState.categorias.push(nuevaCategoria);
        this.render();
        return nuevaCategoria;
    },

    // UPDATE - Actualizar categoría existente
    update(id, data) {
        const index = AppState.categorias.findIndex(c => c.id === id);
        if (index === -1) return false;

        AppState.categorias[index] = {
            ...AppState.categorias[index],
            nombre: data.nombre,
            descripcion: data.descripcion || '',
            imagen: data.imagen || ''
        };

        this.render();
        return true;
    },

    // TOGGLE - Ocultar/Mostrar categoría
    toggleVisible(id) {
        const index = AppState.categorias.findIndex(c => c.id === id);
        if (index === -1) return false;

        const categoria = AppState.categorias[index];
        categoria.activo = !categoria.activo;

        const accion = categoria.activo ? 'activada' : 'ocultada';
        alert(`✅ Categoría "${categoria.nombre}" ${accion} correctamente`);

        this.render();
        return true;
    },

    // DELETE - Eliminar categoría (mantener por si acaso)
    delete(id) {
        AppState.categorias = AppState.categorias.filter(c => c.id !== id);
        this.render();
    },

    // Buscar categoría por ID
    find(id) {
        return AppState.categorias.find(c => c.id === id);
    },

    // Abrir formulario para editar
    edit(id) {
        const categoria = this.find(id);
        if (!categoria) return;

        AppState.categoriaEditando = categoria;
        FormManager.openEdit(categoria);
    },

    // Confirmar eliminación (Ya no se usa, pero se mantiene)
    confirmDelete(id) {
        const categoria = this.find(id);
        if (!categoria) return;

        const confirmar = confirm(
            `¿Estás seguro de eliminar esta categoría?\n\n` +
            `Nombre: ${categoria.nombre}\n` +
            `Productos asociados: ${categoria.productos}\n\n` +
            `Esta acción no se puede deshacer.`
        );

        if (confirmar) {
            this.delete(id);
            alert('✅ Categoría eliminada correctamente');
        }
    },

    // Buscar categorías
    search(query) {
        this.render(query);
    }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================
const FormManager = {
    // Abrir formulario para crear
    openCreate() {
        AppState.categoriaEditando = null;
        
        document.getElementById('formTitle').textContent = '➕ Nueva Categoría';
        document.getElementById('btnGuardarTexto').textContent = 'Guardar';
        
        // Limpiar formulario
        document.getElementById('formCategoria').reset();
        
        // Mostrar formulario
        document.getElementById('formSection').style.display = 'block';
        
        // Scroll al formulario
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
    },

    // Abrir formulario para editar
    openEdit(categoria) {
        AppState.categoriaEditando = categoria;

        document.getElementById('formTitle').textContent = '✏️ Editar Categoría';
        document.getElementById('btnGuardarTexto').textContent = 'Actualizar';

        // Llenar formulario con datos existentes
        document.getElementById('categoriaNombre').value = categoria.nombre;
        document.getElementById('categoriaDescripcion').value = categoria.descripcion || '';
        document.getElementById('categoriaImagen').value = categoria.imagen || '';

        // Mostrar formulario
        document.getElementById('formSection').style.display = 'block';
        
        // Scroll al formulario
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
    },

    // Cerrar formulario
    close() {
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('formCategoria').reset();
        AppState.categoriaEditando = null;
    },

    // Manejar envío del formulario
    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            nombre: document.getElementById('categoriaNombre').value.trim(),
            descripcion: document.getElementById('categoriaDescripcion').value.trim(),
            imagen: document.getElementById('categoriaImagen').value.trim()
        };

        // Validaciones
        if (!formData.nombre) {
            alert('⚠️ El nombre de la categoría es obligatorio');
            return;
        }

        try {
            if (AppState.categoriaEditando) {
                // Actualizar categoría existente
                CategoryManager.update(AppState.categoriaEditando.id, formData);
                alert('✅ Categoría actualizada correctamente');
            } else {
                // Crear nueva categoría
                CategoryManager.create(formData);
                alert('✅ Categoría creada correctamente');
            }

            this.close();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    }
};

// ============================================
// GESTIÓN DE BÚSQUEDA
// ============================================
const SearchManager = {
    init() {
        const searchInput = document.getElementById('searchCategoria');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query === '') {
                CategoryManager.render();
            } else {
                CategoryManager.search(query);
            }
        });
    }
};

// ============================================
// GESTIÓN DE EVENTOS
// ============================================
const EventHandler = {
    init() {
        // Botón nueva categoría
        const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');
        if (btnNuevaCategoria) {
            btnNuevaCategoria.addEventListener('click', () => FormManager.openCreate());
        }

        // Botón cerrar formulario
        const btnCerrarForm = document.getElementById('btnCerrarForm');
        if (btnCerrarForm) {
            btnCerrarForm.addEventListener('click', () => FormManager.close());
        }

        // Botón cancelar
        const btnCancelar = document.getElementById('btnCancelar');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => FormManager.close());
        }

        // Formulario
        const formCategoria = document.getElementById('formCategoria');
        if (formCategoria) {
            formCategoria.addEventListener('submit', (e) => FormManager.handleSubmit(e));
        }
    }
};

// ============================================
// FUNCIÓN GLOBAL PARA TOGGLE
// ============================================
function toggleMostrarOcultas() {
    AppState.mostrarOcultas = !AppState.mostrarOcultas;
    const btn = document.getElementById('btnToggleOcultas');
    
    if (AppState.mostrarOcultas) {
        btn.innerHTML = '<span class="btn-icon">👁️</span> Ocultar Inactivas';
    } else {
        btn.innerHTML = '<span class="btn-icon">👁️</span> Ver Ocultas';
    }
    
    CategoryManager.render();
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    CategoryManager.render();
    CategoryManager.updateStats();
    EventHandler.init();
    SearchManager.init();
    
    console.log('✅ Sistema de Gestión de Categorías cargado correctamente');
    console.log(`📂 Total de categorías: ${AppState.categorias.length}`);
});