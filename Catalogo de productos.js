// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    productos: [
        { id: 1, nombre: 'Pisco Quebranta', categoria: 'Licores', marca: 'Tabernero', stock: 25, precio: 45.00, descripcion: 'Pisco puro de uva Quebranta', imagen: 'https://via.placeholder.com/300x300?text=Pisco+Quebranta' },
        { id: 2, nombre: 'Coca Cola', categoria: 'Gaseosas', marca: 'Coca Cola', stock: 5, precio: 3.50, descripcion: 'Gaseosa cola 500ml', imagen: 'https://via.placeholder.com/300x300?text=Coca+Cola' },
        { id: 3, nombre: 'Vaso Cervecero', categoria: 'Vasos y Jarras', marca: 'Generic', stock: 50, precio: 8.00, descripcion: 'Vaso para cerveza de 500ml', imagen: 'https://via.placeholder.com/300x300?text=Vaso' },
        { id: 4, nombre: 'Pisco Sour', categoria: 'Cócteles', marca: 'Casa', stock: 30, precio: 28.00, descripcion: 'Cóctel tradicional peruano', imagen: 'https://via.placeholder.com/300x300?text=Pisco+Sour' },
        { id: 5, nombre: 'Chicha Morada', categoria: 'Bebidas Calientes', marca: 'Casa', stock: 20, precio: 22.00, descripcion: 'Bebida tradicional de maíz morado', imagen: 'https://via.placeholder.com/300x300?text=Chicha' },
        { id: 6, nombre: 'Cerveza Pilsen', categoria: 'Cervezas', marca: 'Pilsen', stock: 40, precio: 14.00, descripcion: 'Cerveza premium 330ml', imagen: 'https://via.placeholder.com/300x300?text=Cerveza' }
    ],
    productoEditar: null
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    formatId: (id) => String(id).padStart(3, '0'),
    formatPrice: (price) => `S/. ${price.toFixed(2)}`,
    getNextId: () => Math.max(0, ...AppState.productos.map(p => p.id)) + 1,
    
    getEstado: (stock) => {
        if (stock === 0) return { texto: 'Agotado', clase: 'badge-agotado' };
        if (stock <= 10) return { texto: 'Bajo Stock', clase: 'badge-bajo-stock' };
        return { texto: 'Disponible', clase: 'badge-disponible' };
    }
};

// ============================================
// GESTIÓN DE PRODUCTOS (CRUD)
// ============================================
const ProductManager = {
    // Renderizar tabla de productos
    render() {
        const tbody = document.getElementById('productosTableBody');
        if (!tbody) return;

        tbody.innerHTML = AppState.productos
            .map(producto => {
                const estado = Utils.getEstado(producto.stock);
                return `
                    <tr>
                        <td><strong>#${Utils.formatId(producto.id)}</strong></td>
                        <td>
                            <img src="${producto.imagen || 'https://via.placeholder.com/50x50?text=Sin+Img'}" 
                                 alt="${producto.nombre}" 
                                 class="product-image">
                        </td>
                        <td><strong>${producto.nombre}</strong></td>
                        <td>${producto.categoria}</td>
                        <td>${producto.stock}</td>
                        <td class="price">${Utils.formatPrice(producto.precio)}</td>
                        <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
                        <td>
                            <div class="actions-cell">
                                <button class="btn btn-view btn-small" data-action="ver" data-id="${producto.id}">
                                    👁️ Ver
                                </button>
                                <button class="btn btn-edit btn-small" data-action="editar" data-id="${producto.id}">
                                    ✏️ Editar
                                </button>
                                <button class="btn btn-delete btn-small" data-action="eliminar" data-id="${producto.id}">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join('');

        this.updateStats();
    },

    // Actualizar estadísticas
    updateStats() {
        const total = AppState.productos.length;
        const disponibles = AppState.productos.filter(p => p.stock > 10).length;
        const bajoStock = AppState.productos.filter(p => p.stock > 0 && p.stock <= 10).length;
        const categorias = [...new Set(AppState.productos.map(p => p.categoria))].length;

        document.getElementById('totalProductos').textContent = total;
        document.getElementById('productosDisponibles').textContent = disponibles;
        document.getElementById('productosBajoStock').textContent = bajoStock;
        document.getElementById('categorias').textContent = categorias;
    },

    // Crear nuevo producto
    add(data) {
        const nuevoProducto = {
            id: Utils.getNextId(),
            ...data
        };

        AppState.productos.push(nuevoProducto);
        this.render();
        return nuevoProducto;
    },

    // Actualizar producto existente
    update(id, data) {
        const index = AppState.productos.findIndex(p => p.id === id);
        if (index === -1) return false;

        AppState.productos[index] = {
            ...AppState.productos[index],
            ...data
        };

        this.render();
        return true;
    },

    // Eliminar producto
    delete(id) {
        AppState.productos = AppState.productos.filter(p => p.id !== id);
        this.render();
    },

    // Buscar producto por ID
    find(id) {
        return AppState.productos.find(p => p.id === id);
    },

    // Buscar productos (para la búsqueda)
    search(query) {
        const searchTerm = query.toLowerCase();
        const tbody = document.getElementById('productosTableBody');
        
        const filtrados = AppState.productos.filter(p => 
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm) ||
            (p.marca && p.marca.toLowerCase().includes(searchTerm))
        );

        tbody.innerHTML = filtrados
            .map(producto => {
                const estado = Utils.getEstado(producto.stock);
                return `
                    <tr>
                        <td><strong>#${Utils.formatId(producto.id)}</strong></td>
                        <td>
                            <img src="${producto.imagen || 'https://via.placeholder.com/50x50?text=Sin+Img'}" 
                                 alt="${producto.nombre}" 
                                 class="product-image">
                        </td>
                        <td><strong>${producto.nombre}</strong></td>
                        <td>${producto.categoria}</td>
                        <td>${producto.stock}</td>
                        <td class="price">${Utils.formatPrice(producto.precio)}</td>
                        <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
                        <td>
                            <div class="actions-cell">
                                <button class="btn btn-view btn-small" data-action="ver" data-id="${producto.id}">
                                    👁️ Ver
                                </button>
                                <button class="btn btn-edit btn-small" data-action="editar" data-id="${producto.id}">
                                    ✏️ Editar
                                </button>
                                <button class="btn btn-delete btn-small" data-action="eliminar" data-id="${producto.id}">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join('');
    }
};

// ============================================
// GESTIÓN DE MODALES
// ============================================
const ModalManager = {
    // Abrir modal para agregar producto
    openAdd() {
        AppState.productoEditar = null;
        
        document.getElementById('modalTitle').textContent = '➕ Agregar Nuevo Producto';
        document.getElementById('btnGuardar').innerHTML = '<span class="btn-icon">💾</span> Guardar Producto';
        
        // Limpiar formulario
        document.getElementById('formProducto').reset();
        
        // Mostrar modal
        document.getElementById('modalProducto').classList.add('active');
    },

    // Abrir modal para editar producto
    openEdit(id) {
        const producto = ProductManager.find(id);
        if (!producto) return;

        AppState.productoEditar = producto;

        document.getElementById('modalTitle').textContent = '✏️ Editar Producto';
        document.getElementById('btnGuardar').innerHTML = '<span class="btn-icon">💾</span> Actualizar Producto';

        // Llenar formulario con datos existentes
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria;
        document.getElementById('productoMarca').value = producto.marca || '';
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoDescripcion').value = producto.descripcion || '';
        document.getElementById('productoImagen').value = producto.imagen || '';

        // Mostrar modal
        document.getElementById('modalProducto').classList.add('active');
    },

    // Cerrar modal de producto
    closeProducto() {
        document.getElementById('modalProducto').classList.remove('active');
        document.getElementById('formProducto').reset();
        AppState.productoEditar = null;
    },

    // Abrir modal de detalles
    openDetails(id) {
        const producto = ProductManager.find(id);
        if (!producto) return;

        const estado = Utils.getEstado(producto.stock);

        document.getElementById('detalleImagen').src = producto.imagen || 'https://via.placeholder.com/300x300?text=Sin+Imagen';
        document.getElementById('detalleNombre').textContent = producto.nombre;
        document.getElementById('detalleId').textContent = `#${Utils.formatId(producto.id)}`;
        document.getElementById('detalleCategoria').textContent = producto.categoria;
        document.getElementById('detalleMarca').textContent = producto.marca || 'Sin marca';
        document.getElementById('detalleStock').textContent = producto.stock;
        document.getElementById('detalleStock').className = `badge ${estado.clase}`;
        document.getElementById('detallePrecio').textContent = Utils.formatPrice(producto.precio);
        document.getElementById('detalleEstado').textContent = estado.texto;
        document.getElementById('detalleEstado').className = `badge ${estado.clase}`;
        document.getElementById('detalleDescripcion').textContent = producto.descripcion || 'Sin descripción disponible';

        document.getElementById('modalDetalles').classList.add('active');
    },

    // Cerrar modal de detalles
    closeDetails() {
        document.getElementById('modalDetalles').classList.remove('active');
    }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================
const FormManager = {
    // Manejar envío del formulario
    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            nombre: document.getElementById('productoNombre').value.trim(),
            categoria: document.getElementById('productoCategoria').value,
            marca: document.getElementById('productoMarca').value.trim(),
            stock: parseInt(document.getElementById('productoStock').value),
            precio: parseFloat(document.getElementById('productoPrecio').value),
            descripcion: document.getElementById('productoDescripcion').value.trim(),
            imagen: document.getElementById('productoImagen').value.trim()
        };

        // Validaciones
        if (!formData.nombre || !formData.categoria) {
            alert('⚠️ Por favor complete todos los campos obligatorios');
            return;
        }

        if (formData.stock < 0 || formData.precio <= 0) {
            alert('⚠️ El stock y precio deben ser valores válidos');
            return;
        }

        try {
            if (AppState.productoEditar) {
                // Actualizar producto existente
                ProductManager.update(AppState.productoEditar.id, formData);
                alert('✅ Producto actualizado correctamente');
            } else {
                // Crear nuevo producto
                ProductManager.add(formData);
                alert('✅ Producto agregado correctamente');
            }

            ModalManager.closeProducto();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    },

    // Confirmar eliminación
    confirmDelete(id) {
        const producto = ProductManager.find(id);
        if (!producto) return;

        const confirmar = confirm(
            `¿Estás seguro de eliminar el producto?\n\n` +
            `Nombre: ${producto.nombre}\n` +
            `Categoría: ${producto.categoria}\n` +
            `Stock: ${producto.stock}\n\n` +
            `Esta acción no se puede deshacer.`
        );

        if (confirmar) {
            ProductManager.delete(id);
            alert('✅ Producto eliminado correctamente');
        }
    }
};

// ============================================
// GESTIÓN DE BÚSQUEDA
// ============================================
const SearchManager = {
    init() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query === '') {
                ProductManager.render();
            } else {
                ProductManager.search(query);
            }
        });
    }
};

// ============================================
// GESTIÓN DE EVENTOS
// ============================================
const EventHandler = {
    init() {
        // Botón agregar producto
        const btnAgregar = document.getElementById('btnAgregarProducto');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => ModalManager.openAdd());
        }

        // Formulario de producto
        const formProducto = document.getElementById('formProducto');
        if (formProducto) {
            formProducto.addEventListener('submit', (e) => FormManager.handleSubmit(e));
        }

        // Botones de cerrar modales
        document.getElementById('btnCerrarModal')?.addEventListener('click', () => ModalManager.closeProducto());
        document.getElementById('btnCancelar')?.addEventListener('click', () => ModalManager.closeProducto());
        document.getElementById('btnCerrarDetalles')?.addEventListener('click', () => ModalManager.closeDetails());
        document.getElementById('btnCerrarDetallesFooter')?.addEventListener('click', () => ModalManager.closeDetails());

        // Cerrar modal al hacer clic fuera
        document.getElementById('modalProducto')?.addEventListener('click', (e) => {
            if (e.target.id === 'modalProducto') {
                ModalManager.closeProducto();
            }
        });

        document.getElementById('modalDetalles')?.addEventListener('click', (e) => {
            if (e.target.id === 'modalDetalles') {
                ModalManager.closeDetails();
            }
        });

        // Event delegation para botones de la tabla
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const action = target.dataset.action;
            const id = parseInt(target.dataset.id);

            if (!action || !id) return;

            switch (action) {
                case 'ver':
                    ModalManager.openDetails(id);
                    break;
                case 'editar':
                    ModalManager.openEdit(id);
                    break;
                case 'eliminar':
                    FormManager.confirmDelete(id);
                    break;
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    ProductManager.render();
    EventHandler.init();
    SearchManager.init();
    
    console.log('✅ Sistema de Gestión de Productos cargado correctamente');
    console.log(`📦 Total de productos: ${AppState.productos.length}`);
});