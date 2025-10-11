// ============================================
// CONFIGURACIÓN Y ESTADO GLOBAL
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
    { id: 1, hora: '18:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 3, total: 84.00, metodoPago: 'Efectivo', estado: 'Completado' },
    { id: 2, hora: '18:45', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 1, total: 14.00, metodoPago: 'Tarjeta', estado: 'Completado' },
    { id: 3, hora: '19:15', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 1, total: 28.00, metodoPago: 'Efectivo', estado: 'Completado' }
  ],
  productosTemporales: [],
  productoCounter: 0,
  charts: {}
};

// ============================================
// UTILIDADES
// ============================================

const Utils = {
  formatId: (id, prefix = '') => `${prefix}${String(id).padStart(3, '0')}`,
  formatPrice: (price) => `S/. ${price.toFixed(2)}`,
  getCurrentTime: () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  },
  getNextId: (array) => Math.max(0, ...array.map(item => item.id)) + 1
};

// ============================================
// GESTIÓN DE PRODUCTOS
// ============================================

const ProductManager = {
  render() {
    const tbody = document.getElementById('productosTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = AppState.productos.map(producto => {
      const estado = producto.stock > 10 ? 'disponible' : 'bajo-stock';
      const estadoTexto = producto.stock > 10 ? 'Disponible' : 'Bajo Stock';
      
      return `
        <tr>
          <td>${Utils.formatId(producto.id)}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>${producto.stock}</td>
          <td>${Utils.formatPrice(producto.precio)}</td>
          <td><span class="status ${estado}">${estadoTexto}</span></td>
          <td>
            <a href="#" class="btn-action edit" data-action="edit" data-id="${producto.id}">Editar</a>
            <a href="#" class="btn-action delete" data-action="delete" data-id="${producto.id}">Eliminar</a>
          </td>
        </tr>
      `;
    }).join('');
    
    this.updateSelect();
    ChartManager.updateStock();
  },

  updateSelect() {
    const select = document.getElementById('saleProduct');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar producto...</option>' +
      AppState.productos
        .filter(p => p.stock > 0)
        .map(p => `<option value="${p.id}">${p.nombre} - ${Utils.formatPrice(p.precio)} (Stock: ${p.stock})</option>`)
        .join('');
  },

  add(data) {
    const newProduct = {
      id: Utils.getNextId(AppState.productos),
      ...data
    };
    
    AppState.productos.push(newProduct);
    this.render();
    return newProduct;
  },

  update(id, data) {
    const index = AppState.productos.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    AppState.productos[index] = { ...AppState.productos[index], ...data };
    this.render();
    return true;
  },

  delete(id) {
    AppState.productos = AppState.productos.filter(p => p.id !== id);
    this.render();
  },

  find(id) {
    return AppState.productos.find(p => p.id === id);
  }
};

// ============================================
// GESTIÓN DE VENTAS
// ============================================

const SaleManager = {
  render() {
    const tbody = document.getElementById('ventasTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = AppState.ventas.map(venta => `
      <tr>
        <td>${Utils.formatId(venta.id, 'V')}</td>
        <td>${venta.hora}</td>
        <td>${venta.productoNombre}</td>
        <td>${venta.cantidad}</td>
        <td>${Utils.formatPrice(venta.total)}</td>
        <td>${venta.metodoPago}</td>
        <td><span class="status ${venta.estado.toLowerCase()}">${venta.estado}</span></td>
      </tr>
    `).join('');
    
    MetricsManager.update();
    ChartManager.updateProductsSold();
    ChartManager.updatePaymentMethods();
  },

  add(data) {
    const producto = ProductManager.find(data.productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    if (producto.stock < data.cantidad) {
      throw new Error('Stock insuficiente');
    }
    
    const newSale = {
      id: Utils.getNextId(AppState.ventas),
      hora: Utils.getCurrentTime(),
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad: data.cantidad,
      total: producto.precio * data.cantidad,
      metodoPago: data.metodoPago,
      estado: 'Completado'
    };
    
    AppState.ventas.push(newSale);
    ProductManager.update(producto.id, { stock: producto.stock - data.cantidad });
    this.render();
    
    return newSale;
  }
};

// ============================================
// GESTIÓN DE MÉTRICAS
// ============================================

const MetricsManager = {
  update() {
    const totalVentas = AppState.ventas.reduce((sum, v) => sum + v.total, 0);
    const numVentas = AppState.ventas.length;
    const promedio = numVentas > 0 ? totalVentas / numVentas : 0;
    
    // Calcular producto más vendido
    const productosVendidos = AppState.ventas.reduce((acc, venta) => {
      acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
      return acc;
    }, {});
    
    const [productoTop, maxVendido] = Object.entries(productosVendidos)
      .reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
    
    // Actualizar DOM
    this.updateElement('metricVentasHoy', Utils.formatPrice(totalVentas));
    this.updateElement('metricTransacciones', `${numVentas} transacciones`);
    this.updateElement('metricPromedio', Utils.formatPrice(promedio));
    this.updateElement('metricProductoTop', productoTop || '-');
    this.updateElement('metricProductoTopUnidades', `${maxVendido} unidades`);
  },

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }
};

// ============================================
// GESTIÓN DE GRÁFICAS
// ============================================

const ChartManager = {
  config: {
    defaults: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#333'
          }
        }
      }
    },
    colors: {
      primary: '#720008',
      secondary: '#a83e43',
      dark: '#444444',
      gray: '#666666',
      lightGray: '#999999'
    }
  },

  init() {
    this.initMonthlySales();
    this.updateStock();
    this.updateProductsSold();
    this.updatePaymentMethods();
  },

  destroyChart(name) {
    if (AppState.charts[name]) {
      AppState.charts[name].destroy();
      delete AppState.charts[name];
    }
  },

  initMonthlySales() {
    const canvas = document.getElementById('ventasMensuales');
    if (!canvas) return;
    
    this.destroyChart('ventasMensuales');
    
    AppState.charts.ventasMensuales = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
        datasets: [{
          label: 'Ventas (S/.)',
          data: [12000, 15000, 13500, 18000, 16500, 19000, 21000, 20000, 22500, 24000],
          borderColor: this.config.colors.primary,
          backgroundColor: 'rgba(114, 0, 8, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        ...this.config.defaults,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => Utils.formatPrice(value)
            }
          }
        }
      }
    });
  },

  updateStock() {
    const canvas = document.getElementById('stockCategoria');
    if (!canvas) return;
    
    const categorias = AppState.productos.reduce((acc, producto) => {
      acc[producto.categoria] = (acc[producto.categoria] || 0) + producto.stock;
      return acc;
    }, {});
    
    this.destroyChart('stockCategoria');
    
    AppState.charts.stockCategoria = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          label: 'Stock',
          data: Object.values(categorias),
          backgroundColor: [
            this.config.colors.primary,
            this.config.colors.dark,
            this.config.colors.secondary,
            this.config.colors.gray,
            '#8b0000'
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        ...this.config.defaults,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },

  updateProductsSold() {
    const canvas = document.getElementById('productosMasVendidos');
    if (!canvas) return;
    
    const productosVendidos = AppState.ventas.reduce((acc, venta) => {
      acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
      return acc;
    }, {});
    
    const top5 = Object.entries(productosVendidos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    this.destroyChart('productosMasVendidos');
    
    AppState.charts.productosMasVendidos = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: top5.map(([name]) => name),
        datasets: [{
          data: top5.map(([, qty]) => qty),
          backgroundColor: [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.dark,
            this.config.colors.gray,
            this.config.colors.lightGray
          ],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        ...this.config.defaults,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15
            }
          }
        }
      }
    });
  },

  updatePaymentMethods() {
    const canvas = document.getElementById('metodosPago');
    if (!canvas) return;
    
    const metodosPago = AppState.ventas.reduce((acc, venta) => {
      acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
      return acc;
    }, {});
    
    this.destroyChart('metodosPago');
    
    AppState.charts.metodosPago = new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: Object.keys(metodosPago),
        datasets: [{
          data: Object.values(metodosPago),
          backgroundColor: [
            this.config.colors.primary,
            this.config.colors.dark,
            this.config.colors.secondary,
            this.config.colors.gray
          ],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        ...this.config.defaults,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${Utils.formatPrice(context.parsed)}`
            }
          }
        }
      }
    });
  }
};

// ============================================
// GESTIÓN DE FORMULARIOS
// ============================================

const FormManager = {
  handleProductForm(e) {
    e.preventDefault();
    
    const formData = {
      nombre: document.getElementById('productName').value,
      categoria: document.getElementById('productCategory').value,
      stock: parseInt(document.getElementById('productStock').value),
      precio: parseFloat(document.getElementById('productPrice').value)
    };
    
    try {
      ProductManager.add(formData);
      e.target.reset();
      alert('Producto agregado correctamente');
    } catch (error) {
      alert('Error al agregar producto: ' + error.message);
    }
  },

  handleSaleForm(e) {
    e.preventDefault();
    
    const formData = {
      productoId: parseInt(document.getElementById('saleProduct').value),
      cantidad: parseInt(document.getElementById('saleQuantity').value),
      metodoPago: document.getElementById('salePayment').value
    };
    
    if (!formData.productoId) {
      alert('Debe seleccionar un producto');
      return;
    }
    
    try {
      SaleManager.add(formData);
      e.target.reset();
      alert('Venta registrada correctamente');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  },

  handleProductEdit(id) {
    const producto = ProductManager.find(id);
    if (!producto) return;
    
    const nombre = prompt('Nuevo nombre:', producto.nombre);
    if (!nombre) return;
    
    const stock = prompt('Nuevo stock:', producto.stock);
    if (stock === null) return;
    
    const precio = prompt('Nuevo precio:', producto.precio);
    if (precio === null) return;
    
    ProductManager.update(id, {
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio)
    });
    
    alert('Producto actualizado correctamente');
  },

  handleProductDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    ProductManager.delete(id);
    alert('Producto eliminado correctamente');
  }
};

// ============================================
// GESTIÓN DE PRODUCTOS MÚLTIPLES
// ============================================

const MultiProductManager = {
  init() {
    this.setupEventListeners();
    this.updateState();
    this.addProduct(); // Agregar primer producto automáticamente
  },

  setupEventListeners() {
    const btnAdd = document.getElementById('btnAgregarProducto');
    const btnSave = document.getElementById('btnGuardarTodos');
    const btnCancel = document.getElementById('btnCancelar');
    const form = document.getElementById('formProducto');
    
    if (btnAdd) btnAdd.addEventListener('click', () => this.addProduct());
    if (btnSave) form?.addEventListener('submit', (e) => this.saveAll(e));
    if (btnCancel) btnCancel.addEventListener('click', () => this.cancel());
  },

  addProduct() {
    AppState.productoCounter++;
    const container = document.getElementById('productosContainer');
    if (!container) return;
    
    const productDiv = document.createElement('div');
    productDiv.className = 'producto-item';
    productDiv.dataset.numero = AppState.productoCounter;
    productDiv.innerHTML = this.getProductHTML(AppState.productoCounter);
    
    container.appendChild(productDiv);
    this.updateState();
  },

  getProductHTML(numero) {
    return `
      <div class="producto-header">
        <span class="producto-numero">Producto #${numero}</span>
        <button type="button" class="btn-remove" data-remove="${numero}">
          🗑️ Eliminar
        </button>
      </div>
      
      <div class="form-group">
        <label>Nombre del Producto</label>
        <input type="text" class="product-name" data-numero="${numero}" 
               placeholder="Ej: Pisco Acholado" required>
      </div>
      
      <div class="form-group">
        <label>Categoría</label>
        <select class="product-category" data-numero="${numero}" required>
          <option value="">Seleccionar...</option>
          <option>Licores</option>
          <option>Gaseosas</option>
          <option>Bebidas</option>
          <option>Insumos</option>
          <option>Vasos y Jarras</option>
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Stock Inicial</label>
          <input type="number" class="product-stock" data-numero="${numero}" 
                 placeholder="0" min="0" required>
        </div>
        <div class="form-group">
          <label>Precio (S/.)</label>
          <input type="number" class="product-price" data-numero="${numero}" 
                 step="0.01" placeholder="0.00" min="0" required>
        </div>
      </div>
    `;
  },

  removeProduct(numero) {
    const producto = document.querySelector(`[data-numero="${numero}"]`);
    if (!producto) return;
    
    producto.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      producto.remove();
      this.updateState();
    }, 300);
  },

  updateState() {
    const container = document.getElementById('productosContainer');
    const emptyState = document.getElementById('emptyState');
    const productCount = document.getElementById('productCount');
    const btnSave = document.getElementById('btnGuardarTodos');
    
    if (!container) return;
    
    const count = container.querySelectorAll('.producto-item').length;
    
    if (productCount) productCount.textContent = count;
    if (emptyState) emptyState.style.display = count === 0 ? 'block' : 'none';
    if (btnSave) {
      btnSave.disabled = count === 0;
      btnSave.style.opacity = count === 0 ? '0.5' : '1';
    }
  },

  saveAll(e) {
    e.preventDefault();
    
    const container = document.getElementById('productosContainer');
    if (!container) return;
    
    const productos = container.querySelectorAll('.producto-item');
    
    if (productos.length === 0) {
      alert('⚠️ Debe agregar al menos un producto');
      return;
    }
    
    const productosData = [];
    let valid = true;
    
    productos.forEach(producto => {
      const numero = producto.dataset.numero;
      const data = {
        nombre: producto.querySelector(`.product-name[data-numero="${numero}"]`).value.trim(),
        categoria: producto.querySelector(`.product-category[data-numero="${numero}"]`).value,
        stock: parseInt(producto.querySelector(`.product-stock[data-numero="${numero}"]`).value),
        precio: parseFloat(producto.querySelector(`.product-price[data-numero="${numero}"]`).value)
      };
      
      if (!data.nombre || !data.categoria || isNaN(data.stock) || isNaN(data.precio)) {
        valid = false;
        return;
      }
      
      productosData.push(data);
    });
    
    if (!valid) {
      alert('⚠️ Complete todos los campos correctamente');
      return;
    }
    
    // Guardar productos
    productosData.forEach(data => ProductManager.add(data));
    
    alert(`✅ ${productosData.length} producto(s) guardado(s)!\n\n` + 
          productosData.map(p => `• ${p.nombre} - ${p.categoria}`).join('\n'));
    
    // Limpiar
    container.innerHTML = '';
    AppState.productoCounter = 0;
    this.updateState();
  },

  cancel() {
    const container = document.getElementById('productosContainer');
    if (!container) return;
    
    if (container.querySelectorAll('.producto-item').length > 0) {
      if (confirm('¿Cancelar? Se perderán los cambios no guardados.')) {
        container.innerHTML = '';
        AppState.productoCounter = 0;
        this.updateState();
      }
    }
  }
};

// ============================================
// EVENT DELEGATION
// ============================================

const EventHandler = {
  init() {
    // Delegación para acciones de productos
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Acciones de productos
      if (target.dataset.action === 'edit') {
        e.preventDefault();
        FormManager.handleProductEdit(parseInt(target.dataset.id));
      }
      
      if (target.dataset.action === 'delete') {
        e.preventDefault();
        FormManager.handleProductDelete(parseInt(target.dataset.id));
      }
      
      // Eliminar producto múltiple
      if (target.dataset.remove) {
        MultiProductManager.removeProduct(target.dataset.remove);
      }
    });
    
    // Formularios
    const formProducto = document.getElementById('formProducto');
    const formVenta = document.getElementById('formVenta');
    
    if (formProducto) {
      formProducto.addEventListener('submit', (e) => FormManager.handleProductForm(e));
    }
    
    if (formVenta) {
      formVenta.addEventListener('submit', (e) => FormManager.handleSaleForm(e));
    }
  }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  EventHandler.init();
  ProductManager.render();
  SaleManager.render();
  ChartManager.init();
  MetricsManager.update();
  MultiProductManager.init();
});