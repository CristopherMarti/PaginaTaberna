// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    productos: [
        { id: 1, nombre: 'Pisco Quebranta', categoria: 'Licores', stock: 25, precio: 45.00 },
        { id: 2, nombre: 'Coca Cola', categoria: 'Gaseosas', stock: 5, precio: 3.50 },
        { id: 3, nombre: 'Vaso Cervecero', categoria: 'Vasos y Jarras', stock: 50, precio: 8.00 },
        { id: 4, nombre: 'Pisco Sour', categoria: 'Cócteles', stock: 30, precio: 28.00 },
        { id: 5, nombre: 'Chicha Morada', categoria: 'Bebidas Calientes', stock: 0, precio: 22.00 },
        { id: 6, nombre: 'Cerveza Pilsen', categoria: 'Cervezas', stock: 3, precio: 14.00 }
    ],
    movimientos: [],
    productoEditando: null
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    formatId: (id) => String(id).padStart(3, '0'),
    formatPrice: (price) => `S/. ${price.toFixed(2)}`,
    formatDateTime: () => {
        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return `${fecha} ${hora}`;
    },
    getNextId: (array) => Math.max(0, ...array.map(item => item.id)) + 1,
    
    getEstado: (stock) => {
        if (stock === 0) return { texto: 'Agotado', clase: 'badge-agotado' };
        if (stock <= 10) return { texto: 'Bajo Stock', clase: 'badge-bajo-stock' };
        return { texto: 'Disponible', clase: 'badge-disponible' };
    }
};

// ============================================
// GESTIÓN DE INVENTARIO
// ============================================
const InventoryManager = {
    // Renderizar alertas de stock bajo
    renderAlertas() {
        const container = document.getElementById('alertasContainer');
        if (!container) return;

        const productosAlerta = AppState.productos.filter(p => p.stock === 0 || p.stock <= 10);

        if (productosAlerta.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = productosAlerta.map(p => {
            const tipo = p.stock === 0 ? 'agotado' : 'bajo';
            const mensaje = p.stock === 0 
                ? `<strong>${p.nombre}</strong> está AGOTADO` 
                : `<strong>${p.nombre}</strong> tiene solo ${p.stock} unidades`;
            
            return `
                <div class="alerta">
                    <div class="alerta-icon">${p.stock === 0 ? '🔴' : '⚠️'}</div>
                    <div class="alerta-content">
                        <h4>Alerta de Stock ${tipo === 'agotado' ? 'Agotado' : 'Bajo'}</h4>
                        <p>${mensaje}</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Actualizar estadísticas
    updateStats() {
        const total = AppState.productos.length;
        const stockTotal = AppState.productos.reduce((sum, p) => sum + p.stock, 0);
        const bajoStock = AppState.productos.filter(p => p.stock > 0 && p.stock <= 10).length;
        const agotados = AppState.productos.filter(p => p.stock === 0).length;

        document.getElementById('totalProductos').textContent = total;
        document.getElementById('stockDisponible').textContent = stockTotal;
        document.getElementById('stockBajo').textContent = bajoStock;
        document.getElementById('stockAgotado').textContent = agotados;
    },

    // Renderizar tabla de stock
    renderStock() {
        const tbody = document.getElementById('stockTableBody');
        if (!tbody) return;

        if (AppState.productos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem;">
                        <p style="color: #666;">No hay productos en el inventario</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = AppState.productos.map(p => {
            const estado = Utils.getEstado(p.stock);
            const valorTotal = p.stock * p.precio;

            return `
                <tr>
                    <td><strong>#${Utils.formatId(p.id)}</strong></td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td><strong>${p.stock}</strong></td>
                    <td>${Utils.formatPrice(p.precio)}</td>
                    <td class="precio">${Utils.formatPrice(valorTotal)}</td>
                    <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-ver" onclick="verDetalles(${p.id})">
                                👁️ Ver
                            </button>
                            <button class="btn-action btn-editar" onclick="editarStock(${p.id})">
                                ✏️ Editar
                            </button>
                            <button class="btn-action btn-eliminar" onclick="eliminarProducto(${p.id})">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Cargar productos en los selects de los registros
    cargarProductosEnSelect(selectElement) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Seleccionar producto...</option>' +
            AppState.productos.map(p => 
                `<option value="${p.id}">${p.nombre} (Stock: ${p.stock}) - ${Utils.formatPrice(p.precio)}</option>`
            ).join('');
    },

    // Cargar productos en todos los selects
    cargarTodosLosSelects() {
        const selects = document.querySelectorAll('.entradaProducto');
        selects.forEach(select => this.cargarProductosEnSelect(select));
    },

    // Registrar múltiples entradas de stock
    registrarEntradas(entradas) {
        entradas.forEach(entrada => {
            const producto = AppState.productos.find(p => p.id === entrada.productoId);
            if (!producto) return;

            const stockAnterior = producto.stock;
            const stockNuevo = stockAnterior + entrada.cantidad;

            // Actualizar stock
            producto.stock = stockNuevo;

            // Registrar movimiento
            const movimiento = {
                id: Utils.getNextId(AppState.movimientos),
                fecha: Utils.formatDateTime(),
                productoId: producto.id,
                productoNombre: producto.nombre,
                tipo: 'Entrada',
                cantidad: entrada.cantidad,
                stockAnterior,
                stockNuevo,
                motivo: entrada.motivo,
                notas: entrada.notas || '-'
            };

            AppState.movimientos.unshift(movimiento);
        });

        this.renderStock();
        this.renderAlertas();
        this.updateStats();
        this.cargarTodosLosSelects();
    },

    // Actualizar stock de un producto
    actualizarStock(id, nuevoStock, motivo, notas) {
        const producto = AppState.productos.find(p => p.id === id);
        if (!producto) throw new Error('Producto no encontrado');

        const stockAnterior = producto.stock;
        const diferencia = nuevoStock - stockAnterior;
        const tipo = diferencia > 0 ? 'Entrada' : 'Salida';

        // Actualizar stock
        producto.stock = nuevoStock;

        // Registrar movimiento
        const movimiento = {
            id: Utils.getNextId(AppState.movimientos),
            fecha: Utils.formatDateTime(),
            productoId: producto.id,
            productoNombre: producto.nombre,
            tipo,
            cantidad: Math.abs(diferencia),
            stockAnterior,
            stockNuevo: nuevoStock,
            motivo,
            notas: notas || '-'
        };

        AppState.movimientos.unshift(movimiento);

        this.renderStock();
        this.renderAlertas();
        this.updateStats();
        this.cargarTodosLosSelects();
    },

    // Eliminar producto
    eliminarProducto(id) {
        const index = AppState.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            AppState.productos.splice(index, 1);
            this.renderStock();
            this.renderAlertas();
            this.updateStats();
            this.cargarTodosLosSelects();
        }
    },

    // Buscar productos en stock
    search(query) {
        const tbody = document.getElementById('stockTableBody');
        const searchTerm = query.toLowerCase();

        const filtrados = AppState.productos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );

        if (filtrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem;">
                        <p style="color: #666;">No se encontraron productos</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtrados.map(p => {
            const estado = Utils.getEstado(p.stock);
            const valorTotal = p.stock * p.precio;

            return `
                <tr>
                    <td><strong>#${Utils.formatId(p.id)}</strong></td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td><strong>${p.stock}</strong></td>
                    <td>${Utils.formatPrice(p.precio)}</td>
                    <td class="precio">${Utils.formatPrice(valorTotal)}</td>
                    <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-ver" onclick="verDetalles(${p.id})">
                                👁️ Ver
                            </button>
                            <button class="btn-action btn-editar" onclick="editarStock(${p.id})">
                                ✏️ Editar
                            </button>
                            <button class="btn-action btn-eliminar" onclick="eliminarProducto(${p.id})">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
};

// ============================================
// GESTIÓN DE MODALES
// ============================================
const ModalManager = {
    // Ver detalles del producto
    verDetalles(id) {
        const producto = AppState.productos.find(p => p.id === id);
        if (!producto) return;

        const estado = Utils.getEstado(producto.stock);
        const valorTotal = producto.stock * producto.precio;

        document.getElementById('detalleId').textContent = `#${Utils.formatId(producto.id)}`;
        document.getElementById('detalleNombre').textContent = producto.nombre;
        document.getElementById('detalleCategoria').textContent = producto.categoria;
        document.getElementById('detalleStock').textContent = producto.stock;
        document.getElementById('detallePrecio').textContent = Utils.formatPrice(producto.precio);
        document.getElementById('detalleValorTotal').textContent = Utils.formatPrice(valorTotal);
        
        const estadoSpan = document.getElementById('detalleEstado');
        estadoSpan.textContent = estado.texto;
        estadoSpan.className = `badge ${estado.clase}`;

        document.getElementById('modalDetalles').classList.add('active');
    },

    // Editar stock del producto
    editarStock(id) {
        const producto = AppState.productos.find(p => p.id === id);
        if (!producto) return;

        AppState.productoEditando = producto.id;

        document.getElementById('editarNombre').value = producto.nombre;
        document.getElementById('editarStockActual').value = producto.stock;
        document.getElementById('editarNuevoStock').value = producto.stock;
        document.getElementById('editarMotivo').value = '';
        document.getElementById('editarNotas').value = '';

        document.getElementById('modalEditar').classList.add('active');
    }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================
const FormManager = {
    // Manejar envío del formulario de múltiples entradas
    handleEntradas(e) {
        e.preventDefault();
        
        const registros = document.querySelectorAll('.registro-item');
        const entradas = [];
        
        registros.forEach((registro) => {
            const productoId = parseInt(registro.querySelector('.entradaProducto').value);
            const cantidad = parseInt(registro.querySelector('.entradaCantidad').value);
            const motivo = registro.querySelector('.entradaMotivo').value;
            const notas = registro.querySelector('.entradaNotas').value.trim();
            
            if (productoId && cantidad > 0) {
                entradas.push({
                    productoId,
                    cantidad,
                    motivo,
                    notas
                });
            }
        });
        
        if (entradas.length === 0) {
            alert('⚠️ Complete al menos un registro válido');
            return;
        }

        try {
            InventoryManager.registrarEntradas(entradas);
            alert(`✅ Se registraron ${entradas.length} entrada(s) de stock correctamente`);
            
            // Limpiar formulario
            if (window.limpiarFormulario) {
                window.limpiarFormulario();
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    },

    // Manejar envío del formulario de edición
    handleEditar(e) {
        e.preventDefault();

        const nuevoStock = parseInt(document.getElementById('editarNuevoStock').value);
        const motivo = document.getElementById('editarMotivo').value;
        const notas = document.getElementById('editarNotas').value.trim();

        if (!motivo) {
            alert('⚠️ Debe seleccionar un motivo del ajuste');
            return;
        }

        if (nuevoStock < 0) {
            alert('⚠️ El stock no puede ser negativo');
            return;
        }

        try {
            InventoryManager.actualizarStock(
                AppState.productoEditando,
                nuevoStock,
                motivo,
                notas
            );

            document.getElementById('modalEditar').classList.remove('active');
            alert('✅ Stock actualizado correctamente');
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    }
};

// ============================================
// FUNCIONES GLOBALES (llamadas desde HTML)
// ============================================
function verDetalles(id) {
    ModalManager.verDetalles(id);
}

function editarStock(id) {
    ModalManager.editarStock(id);
}

function eliminarProducto(id) {
    const producto = AppState.productos.find(p => p.id === id);
    if (!producto) return;

    const confirmar = confirm(
        `¿Estás seguro de eliminar este producto del inventario?\n\n` +
        `Producto: ${producto.nombre}\n` +
        `Stock actual: ${producto.stock}\n` +
        `Categoría: ${producto.categoria}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    if (confirmar) {
        InventoryManager.eliminarProducto(id);
        alert('✅ Producto eliminado correctamente');
    }
}

function cerrarModalDetalles() {
    document.getElementById('modalDetalles').classList.remove('active');
}

function cerrarModalEditar() {
    document.getElementById('modalEditar').classList.remove('active');
    AppState.productoEditando = null;
}

// ============================================
// GESTIÓN DE EVENTOS
// ============================================
const EventHandler = {
    init() {
        // Formulario de múltiples entradas
        const formEntrada = document.getElementById('formEntrada');
        if (formEntrada) {
            formEntrada.addEventListener('submit', (e) => FormManager.handleEntradas(e));
        }

        // Formulario de edición
        const formEditar = document.getElementById('formEditar');
        if (formEditar) {
            formEditar.addEventListener('submit', (e) => FormManager.handleEditar(e));
        }

        // Búsqueda de stock
        const searchStock = document.getElementById('searchStock');
        if (searchStock) {
            searchStock.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query === '') {
                    InventoryManager.renderStock();
                } else {
                    InventoryManager.search(query);
                }
            });
        }

        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    InventoryManager.renderAlertas();
    InventoryManager.updateStats();
    InventoryManager.renderStock();
    InventoryManager.cargarTodosLosSelects();
    EventHandler.init();

    console.log('✅ Sistema de Inventario con CRUD cargado correctamente');
    console.log(`📦 Total de productos: ${AppState.productos.length}`);
});