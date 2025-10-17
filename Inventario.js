// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    productos: [
        { id: 1, nombre: 'Pisco Quebranta', categoria: 'Licores', stock: 25, precio: 45.00 },
        { id: 2, nombre: 'Coca Cola', categoria: 'Gaseosas', stock: 5, precio: 3.50 },
        { id: 3, nombre: 'Vaso Cervecero', categoria: 'Vasos y Jarras', stock: 50, precio: 8.00 },
        { id: 4, nombre: 'Pisco Sour', categoria: 'Licores', stock: 30, precio: 28.00 },
        { id: 5, nombre: 'Chicha Morada', categoria: 'Bebidas', stock: 0, precio: 22.00 },
        { id: 6, nombre: 'Cerveza Pilsen', categoria: 'Licores', stock: 3, precio: 14.00 }
    ],
    movimientos: [
        { id: 1, fecha: '2025-10-17 10:30', productoId: 1, productoNombre: 'Pisco Quebranta', tipo: 'Entrada', cantidad: 20, stockAnterior: 5, stockNuevo: 25, motivo: 'Compra', notas: 'Proveedor ABC' },
        { id: 2, fecha: '2025-10-17 14:15', productoId: 4, productoNombre: 'Pisco Sour', tipo: 'Salida', cantidad: 3, stockAnterior: 33, stockNuevo: 30, motivo: 'Venta', notas: 'Venta regular' },
        { id: 3, fecha: '2025-10-17 16:45', productoId: 2, productoNombre: 'Coca Cola', tipo: 'Entrada', cantidad: 10, stockAnterior: 0, stockNuevo: 10, motivo: 'Reposición', notas: 'Stock agotado' }
    ]
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
                </tr>
            `;
        }).join('');
    },

    // Actualizar select de productos
    updateProductSelect() {
        const select = document.getElementById('entradaProducto');
        if (!select) return;

        select.innerHTML = '<option value="">Seleccionar producto...</option>' +
            AppState.productos.map(p => 
                `<option value="${p.id}">${p.nombre} (Stock actual: ${p.stock})</option>`
            ).join('');
    },

    // Registrar entrada de stock
    registrarEntrada(data) {
        const producto = AppState.productos.find(p => p.id === data.productoId);
        if (!producto) throw new Error('Producto no encontrado');

        const stockAnterior = producto.stock;
        const stockNuevo = stockAnterior + data.cantidad;

        // Actualizar stock del producto
        producto.stock = stockNuevo;

        // Registrar movimiento
        const movimiento = {
            id: Utils.getNextId(AppState.movimientos),
            fecha: Utils.formatDateTime(),
            productoId: producto.id,
            productoNombre: producto.nombre,
            tipo: 'Entrada',
            cantidad: data.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: data.motivo,
            notas: data.notas || '-'
        };

        AppState.movimientos.unshift(movimiento);

        this.renderStock();
        this.renderAlertas();
        this.updateStats();
        MovimientosManager.render();

        return movimiento;
    },

    // Buscar productos en stock
    search(query) {
        const tbody = document.getElementById('stockTableBody');
        const searchTerm = query.toLowerCase();

        const filtrados = AppState.productos.filter(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );

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
                </tr>
            `;
        }).join('');
    }
};

// ============================================
// GESTIÓN DE MOVIMIENTOS
// ============================================
const MovimientosManager = {
    render(filtros = {}) {
        const tbody = document.getElementById('movimientosTableBody');
        if (!tbody) return;

        let movimientos = [...AppState.movimientos];

        // Aplicar filtros
        if (filtros.tipo) {
            movimientos = movimientos.filter(m => m.tipo === filtros.tipo);
        }

        if (filtros.fecha) {
            movimientos = movimientos.filter(m => m.fecha.startsWith(filtros.fecha));
        }

        tbody.innerHTML = movimientos.map(m => `
            <tr>
                <td>${m.fecha}</td>
                <td>${m.productoNombre}</td>
                <td><span class="badge badge-${m.tipo.toLowerCase()}">${m.tipo}</span></td>
                <td><strong>${m.tipo === 'Entrada' ? '+' : '-'}${m.cantidad}</strong></td>
                <td>${m.stockAnterior}</td>
                <td><strong>${m.stockNuevo}</strong></td>
                <td>${m.motivo}</td>
                <td>${m.notas}</td>
            </tr>
        `).join('');
    }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================
const FormManager = {
    handleEntrada(e) {
        e.preventDefault();

        const formData = {
            productoId: parseInt(document.getElementById('entradaProducto').value),
            cantidad: parseInt(document.getElementById('entradaCantidad').value),
            motivo: document.getElementById('entradaMotivo').value,
            notas: document.getElementById('entradaNotas').value.trim()
        };

        if (!formData.productoId) {
            alert('⚠️ Debe seleccionar un producto');
            return;
        }

        if (formData.cantidad <= 0) {
            alert('⚠️ La cantidad debe ser mayor a 0');
            return;
        }

        try {
            InventoryManager.registrarEntrada(formData);
            e.target.reset();
            alert(`✅ Entrada registrada correctamente\n\nSe agregaron ${formData.cantidad} unidades al inventario`);
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    }
};

// ============================================
// GESTIÓN DE EVENTOS
// ============================================
const EventHandler = {
    init() {
        // Formulario de entrada
        const formEntrada = document.getElementById('formEntrada');
        if (formEntrada) {
            formEntrada.addEventListener('submit', (e) => FormManager.handleEntrada(e));
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

        // Filtros de movimientos
        const filterTipo = document.getElementById('filterTipo');
        const filterFecha = document.getElementById('filterFecha');

        if (filterTipo) {
            filterTipo.addEventListener('change', () => {
                MovimientosManager.render({
                    tipo: filterTipo.value,
                    fecha: filterFecha?.value || ''
                });
            });
        }

        if (filterFecha) {
            filterFecha.addEventListener('change', () => {
                MovimientosManager.render({
                    tipo: filterTipo?.value || '',
                    fecha: filterFecha.value
                });
            });
        }
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    InventoryManager.renderAlertas();
    InventoryManager.updateStats();
    InventoryManager.renderStock();
    InventoryManager.updateProductSelect();
    MovimientosManager.render();
    EventHandler.init();

    console.log('✅ Sistema de Inventario cargado correctamente');
});