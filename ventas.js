// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    productos: [
        { id: 1, nombre: 'Pisco Quebranta', categoria: 'Licores', stock: 25, precio: 45.00 },
        { id: 2, nombre: 'Coca Cola', categoria: 'Gaseosas', stock: 5, precio: 3.50 },
        { id: 3, nombre: 'Vaso Cervecero', categoria: 'Vasos y Jarras', stock: 50, precio: 8.00 },
        { id: 4, nombre: 'Pisco Sour', categoria: 'Licores', stock: 30, precio: 28.00 },
        { id: 5, nombre: 'Chicha Morada', categoria: 'Bebidas', stock: 20, precio: 22.00 },
        { id: 6, nombre: 'Cerveza Pilsen', categoria: 'Licores', stock: 40, precio: 14.00 }
    ],
    ventas: [
        { id: 1, fecha: '2025-10-17 18:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 3, precioUnit: 28.00, total: 84.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 2, fecha: '2025-10-17 18:45', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 1, precioUnit: 14.00, total: 14.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 3, fecha: '2025-10-17 19:15', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 1, precioUnit: 28.00, total: 28.00, metodoPago: 'Efectivo', estado: 'Completado' }
    ],
    movimientos: []
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    formatId: (id) => `V${String(id).padStart(3, '0')}`,
    formatPrice: (price) => `S/. ${price.toFixed(2)}`,
    formatDateTime: () => {
        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return `${fecha} ${hora}`;
    },
    getNextId: (array) => Math.max(0, ...array.map(item => item.id)) + 1
};

// ============================================
// GESTIÓN DE VENTAS
// ============================================
const SalesManager = {
    // Actualizar estadísticas
    updateStats() {
        const totalVentas = AppState.ventas.reduce((sum, v) => sum + v.total, 0);
        const numVentas = AppState.ventas.length;
        const promedio = numVentas > 0 ? totalVentas / numVentas : 0;

        // Producto más vendido
        const productosVendidos = AppState.ventas.reduce((acc, venta) => {
            acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
            return acc;
        }, {});

        const [productoTop] = Object.entries(productosVendidos)
            .reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);

        document.getElementById('ventasHoy').textContent = Utils.formatPrice(totalVentas);
        document.getElementById('numVentas').textContent = numVentas;
        document.getElementById('promedioVenta').textContent = Utils.formatPrice(promedio);
        document.getElementById('productoTop').textContent = productoTop || '-';
    },

    // Actualizar select de productos
    updateProductSelect() {
        const select = document.getElementById('ventaProducto');
        if (!select) return;

        select.innerHTML = '<option value="">Seleccionar producto...</option>' +
            AppState.productos
                .filter(p => p.stock > 0)
                .map(p => `<option value="${p.id}">${p.nombre} - ${Utils.formatPrice(p.precio)} (Stock: ${p.stock})</option>`)
                .join('');
    },

    // Calcular resumen de venta
    calcularResumen() {
        const productoId = parseInt(document.getElementById('ventaProducto').value);
        const cantidad = parseInt(document.getElementById('ventaCantidad').value);

        const resumenDiv = document.getElementById('ventaResumen');

        if (!productoId || !cantidad) {
            resumenDiv.style.display = 'none';
            return;
        }

        const producto = AppState.productos.find(p => p.id === productoId);
        if (!producto) return;

        const total = producto.precio * cantidad;

        document.getElementById('resumenProducto').textContent = producto.nombre;
        document.getElementById('resumenCantidad').textContent = cantidad;
        document.getElementById('resumenPrecio').textContent = Utils.formatPrice(producto.precio);
        document.getElementById('resumenTotal').textContent = Utils.formatPrice(total);

        resumenDiv.style.display = 'flex';
    },

    // Registrar nueva venta
    registrarVenta(data) {
        const producto = AppState.productos.find(p => p.id === data.productoId);
        if (!producto) throw new Error('Producto no encontrado');

        if (producto.stock < data.cantidad) {
            throw new Error(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`);
        }

        const nuevaVenta = {
            id: Utils.getNextId(AppState.ventas),
            fecha: Utils.formatDateTime(),
            productoId: producto.id,
            productoNombre: producto.nombre,
            cantidad: data.cantidad,
            precioUnit: producto.precio,
            total: producto.precio * data.cantidad,
            metodoPago: data.metodoPago,
            estado: 'Completado'
        };

        // Agregar venta
        AppState.ventas.unshift(nuevaVenta);

        // Descontar stock
        producto.stock -= data.cantidad;

        // Registrar movimiento en inventario
        const movimiento = {
            id: Utils.getNextId(AppState.movimientos),
            fecha: Utils.formatDateTime(),
            productoId: producto.id,
            productoNombre: producto.nombre,
            tipo: 'Salida',
            cantidad: data.cantidad,
            stockAnterior: producto.stock + data.cantidad,
            stockNuevo: producto.stock,
            motivo: 'Venta',
            notas: `Venta ${Utils.formatId(nuevaVenta.id)}`
        };

        AppState.movimientos.unshift(movimiento);

        this.render();
        this.updateStats();
        this.updateProductSelect();

        return nuevaVenta;
    },

    // Renderizar tabla de ventas
    render(filtros = {}) {
        const tbody = document.getElementById('ventasTableBody');
        if (!tbody) return;

        let ventas = [...AppState.ventas];

        // Aplicar filtros
        if (filtros.metodo) {
            ventas = ventas.filter(v => v.metodoPago === filtros.metodo);
        }

        if (filtros.fecha) {
            ventas = ventas.filter(v => v.fecha.startsWith(filtros.fecha));
        }

        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            ventas = ventas.filter(v => 
                v.productoNombre.toLowerCase().includes(busqueda) ||
                Utils.formatId(v.id).toLowerCase().includes(busqueda)
            );
        }

        tbody.innerHTML = ventas.map(v => `
            <tr>
                <td><strong>${Utils.formatId(v.id)}</strong></td>
                <td>${v.fecha}</td>
                <td>${v.productoNombre}</td>
                <td>${v.cantidad}</td>
                <td>${Utils.formatPrice(v.precioUnit)}</td>
                <td class="precio">${Utils.formatPrice(v.total)}</td>
                <td>${v.metodoPago}</td>
                <td><span class="badge badge-${v.estado.toLowerCase()}">${v.estado}</span></td>
                <td>
                    <button class="btn btn-view btn-small" data-action="ver" data-id="${v.id}">
                        👁️ Ver
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // Buscar ventas
    search(query) {
        this.render({ busqueda: query });
    }
};

// ============================================
// GESTIÓN DE MODALES
// ============================================
const ModalManager = {
    openDetails(id) {
        const venta = AppState.ventas.find(v => v.id === id);
        if (!venta) return;

        document.getElementById('detalleId').textContent = Utils.formatId(venta.id);
        document.getElementById('detalleFecha').textContent = venta.fecha;
        document.getElementById('detalleProducto').textContent = venta.productoNombre;
        document.getElementById('detalleCantidad').textContent = venta.cantidad;
        document.getElementById('detallePrecioUnit').textContent = Utils.formatPrice(venta.precioUnit);
        document.getElementById('detalleMetodo').textContent = venta.metodoPago;
        document.getElementById('detalleTotal').textContent = Utils.formatPrice(venta.total);

        document.getElementById('modalDetalles').classList.add('active');
    },

    closeDetails() {
        document.getElementById('modalDetalles').classList.remove('active');
    }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================
const FormManager = {
    handleVenta(e) {
        e.preventDefault();

        const formData = {
            productoId: parseInt(document.getElementById('ventaProducto').value),
            cantidad: parseInt(document.getElementById('ventaCantidad').value),
            metodoPago: document.getElementById('ventaPago').value
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
            const venta = SalesManager.registrarVenta(formData);
            e.target.reset();
            document.getElementById('ventaResumen').style.display = 'none';
            
            alert(
                `✅ Venta registrada correctamente\n\n` +
                `ID: ${Utils.formatId(venta.id)}\n` +
                `Producto: ${venta.productoNombre}\n` +
                `Cantidad: ${venta.cantidad}\n` +
                `Total: ${Utils.formatPrice(venta.total)}\n` +
                `Método: ${venta.metodoPago}`
            );
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
        // Formulario de venta
        const formVenta = document.getElementById('formVenta');
        if (formVenta) {
            formVenta.addEventListener('submit', (e) => FormManager.handleVenta(e));
        }

        // Calcular resumen al cambiar producto o cantidad
        const ventaProducto = document.getElementById('ventaProducto');
        const ventaCantidad = document.getElementById('ventaCantidad');

        if (ventaProducto) {
            ventaProducto.addEventListener('change', () => SalesManager.calcularResumen());
        }

        if (ventaCantidad) {
            ventaCantidad.addEventListener('input', () => SalesManager.calcularResumen());
        }

        // Búsqueda
        const searchVenta = document.getElementById('searchVenta');
        if (searchVenta) {
            searchVenta.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query === '') {
                    SalesManager.render();
                } else {
                    SalesManager.search(query);
                }
            });
        }

        // Filtros
        const filterMetodo = document.getElementById('filterMetodo');
        const filterFecha = document.getElementById('filterFecha');

        if (filterMetodo) {
            filterMetodo.addEventListener('change', () => {
                SalesManager.render({
                    metodo: filterMetodo.value,
                    fecha: filterFecha?.value || ''
                });
            });
        }

        if (filterFecha) {
            filterFecha.addEventListener('change', () => {
                SalesManager.render({
                    metodo: filterMetodo?.value || '',
                    fecha: filterFecha.value
                });
            });
        }

        // Botones del modal
        document.getElementById('btnCerrarModal')?.addEventListener('click', () => ModalManager.closeDetails());
        document.getElementById('btnCerrarFooter')?.addEventListener('click', () => ModalManager.closeDetails());

        // Cerrar modal al hacer clic fuera
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

            if (action === 'ver' && id) {
                ModalManager.openDetails(id);
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    SalesManager.updateStats();
    SalesManager.updateProductSelect();
    SalesManager.render();
    EventHandler.init();

    console.log('✅ Sistema de Ventas cargado correctamente');
});