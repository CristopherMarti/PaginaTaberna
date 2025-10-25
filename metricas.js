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
        { id: 1, fecha: '2025-10-17 18:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 3, total: 84.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 2, fecha: '2025-10-17 18:45', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 1, total: 14.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 3, fecha: '2025-10-17 19:15', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 1, total: 28.00, metodoPago: 'Efectivo', estado: 'Completado' }
    ],
    charts: {}
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    formatPrice: (price) => `S/. ${price.toFixed(2)}`
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

        // Stock total
        const stockTotal = AppState.productos.reduce((sum, p) => sum + p.stock, 0);

        // Actualizar métricas del día
        this.updateElement('metricVentasHoy', Utils.formatPrice(totalVentas));
        this.updateElement('metricTransacciones', `${numVentas} transacciones`);
        this.updateElement('metricPromedio', Utils.formatPrice(promedio));
        this.updateElement('metricProductoTop', productoTop || '-');
        this.updateElement('metricProductoTopUnidades', `${maxVendido} unidades`);
        this.updateElement('metricStockTotal', stockTotal);

        // Actualizar resumen
        this.updateElement('ingresosTotales', Utils.formatPrice(totalVentas));
        this.updateElement('totalVentas', numVentas);
        this.updateElement('productosActivos', AppState.productos.length);
        
        const productosBajoStock = AppState.productos.filter(p => p.stock > 0 && p.stock <= 10).length;
        this.updateElement('productosBajoStock', productosBajoStock);
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
                        color: '#333',
                        font: {
                            size: 12
                        }
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

    // Plugin para mostrar porcentajes
    segmentPercentPlugin: {
        id: 'segmentPercentPlugin',
        afterDraw: (chart) => {
            if (!chart || !chart.config || !chart.config.type) return;
            const type = chart.config.type;
            if (type !== 'doughnut' && type !== 'pie') return;

            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            if (!meta || !meta.data) return;
            
            const dataset = chart.data.datasets[0];
            const data = dataset.data || [];
            const total = data.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
            if (total === 0) return;

            ctx.save();
            ctx.font = '14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            meta.data.forEach((arc, index) => {
                const val = data[index];
                if (!val || val <= 0) return;

                let pos;
                try {
                    pos = arc.tooltipPosition();
                } catch (e) {
                    const box = arc.getProps ? arc.getProps(['x','y']) : { x: arc.x, y: arc.y };
                    pos = { x: box.x, y: box.y };
                }

                const percent = (val / total) * 100;
                const text = percent < 1 ? '<1%' : percent.toFixed(1) + '%';

                // Sombra para mejor legibilidad
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillText(text, pos.x + 1, pos.y + 1);

                // Texto principal
                ctx.fillStyle = '#ffffff';
                ctx.fillText(text, pos.x, pos.y);
            });

            ctx.restore();
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

    // Gráfica de Ventas Mensuales
    initMonthlySales() {
        const canvas = document.getElementById('ventasMensuales');
        if (!canvas) return;

        this.destroyChart('ventasMensuales');

        AppState.charts.ventasMensuales = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
                datasets: [{
                    label: 'Ventas (S/.)',
                    data: [12000, 15000, 13500, 18000, 16500, 19000, 21000, 20000, 22500, 24000],
                    borderColor: this.config.colors.primary,
                    backgroundColor: 'rgba(114, 0, 8, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: this.config.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                ...this.config.defaults,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => Utils.formatPrice(value)
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Ventas: ${Utils.formatPrice(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    },

    // Gráfica de Stock por Categoría
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
                    label: 'Stock por Categoría',
                    data: Object.values(categorias),
                    backgroundColor: [
                        this.config.colors.primary,
                        this.config.colors.dark,
                        this.config.colors.secondary,
                        this.config.colors.gray,
                        '#8b0000'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 8
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
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    // Gráfica de Productos más Vendidos
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

        const labels = top5.map(([name]) => name);
        const dataValues = top5.map(([, qty]) => qty);

        AppState.charts.productosMasVendidos = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: dataValues,
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
            plugins: [this.segmentPercentPlugin],
            options: {
                ...this.config.defaults,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 20,
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataset = context.dataset;
                                const value = context.parsed;
                                const total = dataset.data.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
                                const percent = total === 0 ? 0 : (value / total) * 100;
                                return `${context.label}: ${value} unidades (${percent.toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // Gráfica de Métodos de Pago
    updatePaymentMethods() {
        const canvas = document.getElementById('metodosPago');
        if (!canvas) return;

        const metodosPago = AppState.ventas.reduce((acc, venta) => {
            acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
            return acc;
        }, {});

        this.destroyChart('metodosPago');

        const labels = Object.keys(metodosPago);
        const dataValues = Object.values(metodosPago);

        AppState.charts.metodosPago = new Chart(canvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: dataValues,
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
            plugins: [this.segmentPercentPlugin],
            options: {
                ...this.config.defaults,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataset = context.dataset;
                                const value = context.parsed;
                                const total = dataset.data.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
                                const percent = total === 0 ? 0 : (value / total) * 100;
                                return `${context.label}: ${Utils.formatPrice(value)} (${percent.toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    MetricsManager.update();
    ChartManager.init();

    console.log('✅ Sistema de Métricas cargado correctamente');
    console.log('📊 Gráficas inicializadas:', Object.keys(AppState.charts));
});